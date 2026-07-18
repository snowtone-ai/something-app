# Zenny — the Subscription Slayer 🐷⚔️

**The anti-subscription app.** Track your subscriptions, hunt the zombies you pay for but never
use, and slay them — while Zenny, your money-guardian pet, grows with every dollar you rescue.

- 🔒 **100% private** — everything stays on your device. No account, no bank link, no tracking, no server.
- 🧟 **Zombie detection** — weekly "did you actually use it?" check-ins surface the money leaks.
- ⚔️ **Slay & rescue** — cancelling feels like winning: rescued money levels up your pet from egg to elder.
- 📈 **Burn dashboard** — true monthly/yearly burn across weekly/monthly/quarterly/yearly cycles, multi-currency.
- ⏰ **Renewal & trial radar** — see what renews next and which trials are about to convert.
- 🖼 **Share cards** — export a "rescued $X/yr" victory image. No account needed, ever.
- 💚 **One-time purchase model** — a subscription tracker will never charge you a subscription.

See [docs/planning_process.md](docs/planning_process.md) for the data-driven product rationale
and [docs/architecture.md](docs/architecture.md) for technical design.

## Development

```bash
npm install
npm run dev        # local dev server
npm test           # unit + component tests (Vitest)
npm run e2e        # Playwright end-to-end tests (builds not required; uses preview server)
npm run build      # production web build (PWA) → dist/
```

## Store packaging

| Target | Command | Output |
|---|---|---|
| Web / PWA | `npm run build` | `dist/` (deploy to any static host) |
| Android | `scripts/build-android.ps1` (or CI job) | `android/app/build/outputs/bundle/release/app-release.aab` |
| iOS | `npx cap add ios && npx cap sync ios` on macOS, then archive in Xcode | `.ipa` |

CI (GitHub Actions) runs typecheck → unit tests → build → e2e on every push, then produces the
release `.aab` artifact. All gates require a 100% pass rate.
