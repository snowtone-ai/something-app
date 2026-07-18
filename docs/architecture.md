# Architecture — Zenny (Subscription Slayer)

## Constraints driving the design
1. **$0 infrastructure at any scale** — all data on-device; no accounts, no backend, no API keys.
2. **Build + test 100% locally / free CI** — no store entitlements, no restricted OS APIs.
3. **Ship to iOS + Android + Web from one codebase** — store presence and PWA distribution.
4. **Privacy is the product** — no network calls with user data, ever. Trivially auditable.

## Stack

| Layer | Choice | Rationale |
|---|---|---|
| UI | React 19 + TypeScript + Vite | Fastest local iteration, huge testability ecosystem |
| State | Zustand + `persist` (localStorage) | Tiny (~1KB), serializable store = easy tests & migration |
| Domain logic | Pure TS modules in `src/domain/` (zero React imports) | 100% unit-testable, money math isolated from UI |
| PWA | `vite-plugin-pwa` (Workbox) | Offline-first, installable web distribution for $0 |
| Native shells | Capacitor 7 | Wraps the same build into iOS (`.ipa`) / Android (`.aab`); no rewrite |
| Unit/component tests | Vitest + Testing Library + jsdom | Fast, first-class Vite integration |
| E2E + visual | Playwright (chromium) | Real-browser flows + screenshot-based layout checks |
| CI | GitHub Actions (free tier) | typecheck → unit → build → e2e → Android bundle artifact |

## Data model (all on-device)

```
Subscription {
  id, name, priceCents (integer — no float money), currency, cadence: weekly|monthly|quarterly|yearly,
  firstBillDate (ISO), status: active|trial|slain, trialEndDate?, slainAt?,
  usageChecks: [{date, used}]  // weekly "worth-it" check-ins → zombie score
}
```

Derived (pure functions, never stored):
- `money.ts` — monthly/yearly normalization, total burn, formatting (integer cents only)
- `dates.ts` — next renewal date, days-until, trial countdown
- `zombie.ts` — zombie score from recent usage checks → healthy | watch | zombie
- `pet.ts` — deterministic pet state: level/stage from rescued-per-year total, mood from zombie ratio
- `rescue.ts` — rescued ledger: sum of slain subscriptions' yearly cost

## Why no backend, spelled out
Discovery-by-bank-scan is the competitor's moat and the users' dealbreaker (58% refuse).
Choosing manual entry makes "no server" possible, which makes the privacy claim *structural*
(verifiable in the repo) rather than a policy promise. It also means CI needs no secrets to
run every test, and store review needs no data-safety disclosures beyond "none collected."

## Packaging & CI

- `npm run build` → static `dist/` (deployable to any static host / PWA).
- `npx cap sync android && gradle bundleRelease` → `.aab` (script: `scripts/build-android.ps1`, CI job on ubuntu).
- `npx cap sync ios` → Xcode project (`.ipa` requires a Mac + signing; project kept store-ready).
- GitHub Actions `ci.yml`: push/PR to main → typecheck, vitest (100% pass gate), build, Playwright e2e, upload Android `.aab` artifact.

## Testing strategy (TDD)
1. Domain tests written **before** domain implementations (money math, cadence edge cases,
   month-end renewal dates, leap years, zombie scoring, pet leveling thresholds).
2. Component tests for the core loop: add → burn updates → slay → rescued ledger + pet levels up.
3. Playwright e2e for the full user journey incl. persistence across reload, plus screenshot
   assertions to catch layout breakage.
