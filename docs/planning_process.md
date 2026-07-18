# Planning Process — something-app

> Autonomous product discovery record. Written 2026-07-19 by the orchestrating agent so every
> decision below can be audited against its data source.

---

## 1. Data Sources Consulted

| # | Source | Type | Key data extracted |
|---|--------|------|--------------------|
| S1 | [Sensor Tower — State of Mobile 2026](https://sensortower.com/blog/state-of-mobile-2026) | Market report | Non-game IAP revenue surpassed games for the first time (+21% YoY); $167B total IAP; downloads flat (+0.8%) → market is monetization-driven, not adoption-driven |
| S2 | [AppMagic — Mobile Market Landscape 2026](https://appmagic.rocks/files/view/upload/Reports/EN_MobileMarkeLandscape2026.pdf) | Market report | 1.4M releases in 2025, only ~10% get any attention; Tools +20% revenue; Gen AI +273% revenue (crowded); Finance app count +43.5% (validated demand) |
| S3 | [InvestGame — The Future of Consumer Apps 2026](https://investgame.net/wp-content/uploads/2026/03/2026-03-24-consumer-apps-report-2026_wp.pdf) | VC thesis report | $20.7B invested in gamified consumer apps since 2020, **97% concentrated in EdTech / Fitness / Entertainment — FinTech gamification is explicitly named whitespace**; "game design + data advantage" beats "selling AI"; 18–24 month category window |
| S4 | [Yahoo Tech — "Subscription creep" backlash](https://tech.yahoo.com/apps/articles/subscription-creep-backlash-grows-users-084000792.html) | Consumer sentiment (r/Anticonsumption) | Users exhausted by questionnaires → paywall → weekly fees; "I'm willing to pay for something useful but this is outrageous" |
| S5 | [Remio — App Subscription Fatigue](https://www.remio.ai/post/app-subscription-fatigue-spurs-cancelation-hacks-and-industry-backlash) | Trend analysis | **>70% of households in developed markets feel overwhelmed by recurring charges; average user pays for 9 services, uses 4**; cancellation dark patterns spawning DIY hack tools; regulators moving (CA ARL, EU, AU one-click mandates) |
| S6 | [RevenueCat — one sec case study](https://www.revenuecat.com/blog/growth/frederik-riedel-expected-12-his-app-cut-screen-time-by-57/) | Indie success case | Weekend prototype → viral tweet → research moat (57% reduction, Max Planck); privacy-first + "essentials are free" positioning is a trust weapon |
| S7 | [TechCrunch — Focus Friend](https://techcrunch.com/2025/08/18/hank-greens-focus-friend-app-is-climbing-the-app-store-charts-and-its-extremely-cute/) | Indie success case | A knitting bean pet drove a utility app to **#4 free overall / #2 productivity**; emotional companion > feature list; ad-free stance is part of the brand |
| S8 | [Subnesio — tracker comparison](https://www.subnesio.one/blog/subscription-tracker-apps-compared), [Finny — Rocket Money privacy review](https://getfinny.app/blog/is-rocket-money-safe-2026), [Subkept vs Rocket Money](https://subkept.com/compare/subkept-vs-rocket-money/), [NexaSphere — SubGrade](https://nexasphere.io/blog/rocket-money-alternative-privacy-first) | Competitor analysis | Full competitive map of the subscription-tracker category (see §4); **58% of consumers refuse to link bank accounts to third-party apps** (PYMNTS 2024); Rocket Money FTC settlement 2024 |
| S9 | [Startup Founder Stories — Minimalist Phone $20K MRR](https://startupfounderstories.com/stories/martin-moravek-minimalist-phone-20k-mrr) | Indie success case | Solo dev, $100 launch cost, 2M+ downloads solving own behavioral problem |

## 2. Extracted Market Signals (reasoning)

1. **The pain is money, and the pain is documented.** Subscription creep is the single most
   consistent consumer complaint across 2025–2026 sources (S4, S5, S8). It is mainstream enough
   to reach legislative hearings. Average household: 9 paid services, 4 used → ~5 "zombie
   subscriptions" per household leaking money every month.
2. **The trust gap is structural.** The only apps that solve discovery (Rocket Money et al.)
   require full bank-transaction access via Plaid; 58% of consumers refuse this categorically
   (S8). The privacy-first alternatives that exist (Bobby, Subkept, Subnesio, SubGrade) are
   functional but emotionally inert — plain lists with reminders.
3. **The proven growth mechanic is an emotional companion.** Focus Friend (S7) demonstrated in
   Aug 2025 that attaching a cute dependent creature to a boring utility rockets it up the
   charts. one sec (S6) proved privacy-first + measurable-outcome positioning compounds virally.
4. **The whitespace is named by investors.** InvestGame (S3) explicitly calls FinTech the
   under-gamified vertical: 97% of gamified-app capital went elsewhere. Nobody has shipped
   "Focus Friend for your wallet."
5. **Anti-subscription monetization is itself marketing.** The audience is defined by
   subscription resentment (S4, S5). A one-time-purchase model isn't just pricing — it is the
   viral hook and the moral high ground, exactly like one sec's "it is not our goal to get rich
   over your phone addiction" (S6).

## 3. Target Persona

| Attribute | Primary persona — "Audit-day Alex" | Secondary — "Frugal-family Fumi" |
|---|---|---|
| Age / context | 24–38, digitally native, 8–15 active subscriptions | 30–45, household budget owner |
| Trigger moment | Sees an unexpected renewal charge; reads a subscription-creep thread | Monthly budget review; inflation pressure |
| Core frustration | "I'm being billed for things I forgot; every tracker wants my bank login" | "Small charges add up invisibly across the family" |
| Privacy stance | In the 58% who refuse bank linking (S8) | Wary, wants data on-device |
| What existing tools give them | A spreadsheet-like list (Bobby/Subkept) or a bank pipe (Rocket Money) | Nothing localized, nothing shared |
| What they actually need | **Motivation to act** (cancel/downgrade), not just visibility | A glanceable total + renewal warnings |
| Willingness to pay | One-time purchase yes; another subscription — ironically, no | One-time family unlock |

## 4. Competitor Weakness Analysis

| Competitor | Model | Strength | Exploitable weakness |
|---|---|---|---|
| Rocket Money | Bank-linked (Plaid), sub + 30–60% negotiation fee | Auto-detection, concierge | Full transaction history exposed to a mortgage conglomerate; FTC settlement 2024; US-only coverage; persistent upsell (S8) |
| Bobby | iOS one-time IAP, manual | Beautiful, cheap | iOS only; push-only reminders; no engagement loop — retention dies after entry (S8) |
| Subkept / Subnesio / Finny / SubGrade | Web/manual, privacy-first | No bank link | All are *utilitarian lists*. Zero emotional retention mechanic; several charge a monthly subscription **to track subscriptions** (brand dissonance); tiny distribution |
| Focus Friend | Free + cosmetics, screen-time pet | Emotional loop, chart-proven | Different vertical (attention, not money) — validates the mechanic without competing |

**Synthesis:** the category is barbelled into "invasive automation" vs "boring lists".
No player combines: privacy-first manual tracking × game-design retention loop × shareable
outcome ("I rescued $840/yr") × anti-subscription one-time pricing. That combination is
buildable fully client-side (no backend, no free-tier risk) and is defensible by brand/mascot
rather than by features that Big Tech can clone overnight.

## 5. Three Candidate Concepts

### Concept A — "Zenny" 🐷 Gamified privacy-first subscription slayer
Your money is a creature. Zenny (a coin-hoarding piggy-dragon) lives on your phone, gets sick
when zombie subscriptions drain you, and visibly thrives every time you cancel, downgrade, or
consciously *keep* a subscription after a "worth-it" check-in. Cancelled money accumulates as a
"Rescued" ledger that feeds Zenny's growth and unlocks cosmetics. 100% on-device data.

### Concept B — Screen-time companion (Focus Friend variant with body-doubling)
A pet that co-works with you and blocks doomscrolling. **Rejected on feasibility:** requires
iOS FamilyControls / Screen Time entitlements (Apple-gated, approval risk) and Android
UsageStats/Accessibility (Play policy risk). Cannot be built or CI-tested without store-side
entitlements, violating the "fully local/free CI" constraint. Also a direct rehash of Focus
Friend / one sec — prohibited by the no-rehash rule.

### Concept C — AI micro-tutor with game loop (EdTech whitespace per S3)
Story-driven adaptive drilling. **Rejected on constraints:** requires a hosted LLM (recurring
API cost, no free tier at quality), server infra, and content pipelines; competes against
Duolingo's 50.5M DAU distribution moat; Gen AI category +273% revenue but maximally crowded (S2).

### Decision Matrix

| Criterion (weight) | A: Zenny | B: Screen-time pet | C: AI tutor |
|---|---|---|---|
| Validated pain intensity (25%) | 5 — S4/S5 mainstream backlash | 4 — proven but served | 4 |
| Competitive whitespace (20%) | 5 — named by S3, no direct rival | 2 — one sec, Focus Friend, Opal | 2 — ChatGPT/Duolingo |
| Viral mechanics (20%) | 5 — shareable "rescued $/yr" card + mascot + ironic pricing story | 4 | 3 |
| Feasibility: local build, free CI, no backend (20%) | 5 — pure client-side | 1 — OS entitlements | 1 — LLM costs |
| Monetization fit (15%) | 4 — one-time unlock + cosmetics | 3 | 3 |
| **Weighted total** | **4.85** | 2.75 | 2.60 |

## 6. Adopted Concept: **Zenny — the Subscription Slayer** (Concept A)

### Positioning
"The anti-subscription app." A subscription tracker that will never charge you a subscription,
never sees your bank, and turns cancelling into a game you want to win.

### Core loop (game-design principles per S3/S7)
1. **Feed** — add subscriptions (fast manual entry; smart presets for top ~40 services).
2. **Sense** — dashboard shows monthly burn, annual burn, and per-subscription renewal countdown;
   Zenny's mood/health reflects wasted spend (zombie score from periodic "did you use it?" checks).
3. **Slay** — cancel/downgrade flow marks a subscription as slain → its yearly cost moves to the
   **Rescued ledger** → Zenny levels up, evolves, unlocks cosmetics.
4. **Show** — one-tap share card: "Zenny helped me rescue $840/yr" (PNG, no account needed) —
   the organic-viral engine, modeled on one sec's screen-recording virality (S6).

### Monetization design
| Layer | Mechanic | Rationale |
|---|---|---|
| Free forever | Unlimited subscriptions, reminders, dashboard, base pet | Trust-first; "essentials are free" (S6); zero dark patterns as brand |
| **Slayer Pack** (one-time IAP / web payment, ~$6.99) | Cosmetic evolutions, themes, multi-currency polish, data export, household profiles | One-time by principle — the pricing IS the marketing (S4/S5 audience) |
| No ads, no accounts, no bank | — | Converts the 58% refusers (S8); App Store privacy nutrition label becomes an asset |

Revenue potential: category comps (Bobby-class trackers at ~$5 one-time with weak loops) vs
Focus Friend-class chart performance with cosmetics. The gamified loop raises retention →
retention raises word-of-mouth K-factor → one-time conversions scale with installs, not MAU
maintenance costs. Server cost is $0 at any scale (fully client-side), so margin ≈ 100% minus
store fees.

### Risks & mitigations
| Risk | Mitigation |
|---|---|
| Manual entry friction | Preset catalog + 3-field quick add (<15s per subscription); optional trial-mode defaults |
| Retention decay after initial audit | Renewal reminders + weekly worth-it check-ins + pet mood decay pull users back |
| Clone risk | Mascot/brand moat + speed (18–24mo window per S3); feature surface is deliberately simple |
| Store rejection | No restricted APIs used; pure standard app — low review risk |

## 7. Next Steps (executed in this repo)
1. `docs/architecture.md` — technical design (client-side PWA + Capacitor packaging, free CI).
2. TDD implementation: domain logic first (money math, renewal dates, zombie score, pet state).
3. Store-ready packaging scripts + GitHub Actions CI (100% test pass gate).
