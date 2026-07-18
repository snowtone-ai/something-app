# Store Listing — Zenny

## App identity
- **Name:** Zenny — Subscription Slayer
- **Bundle/App ID:** `com.snowtone.zenny`
- **Category:** Finance (primary), Productivity (secondary)
- **Price:** Free (one-time "Slayer Pack" IAP planned post-launch; v1 ships fully free)

## Short description (Play, 80 chars)
Slay zombie subscriptions. Rescue your money. 100% private — no bank link ever.

## Full description
Zenny is the anti-subscription app: a subscription tracker that will never charge you a
subscription, never asks for your bank login, and turns cancelling into a game.

- 🧟 Find your zombies — weekly "did you actually use it?" check-ins expose what you pay for but never use
- ⚔️ Slay them — every cancelled subscription feeds Zenny, your money-guardian pet, who grows from egg to elder dragon
- 📈 Know your burn — true monthly & yearly totals across weekly, monthly, quarterly and yearly billing
- ⏰ Never get ambushed — renewal countdowns and free-trial alarms before you're charged
- 🖼 Brag a little — share a "rescued $X/yr" victory card with friends
- 🔒 Actually private — every byte stays on your device; no account, no server, no analytics, no ads

The average household pays for 9 subscriptions and uses 4. Zenny exists to slay the other 5.

## Keywords (App Store, 100 chars)
subscription,tracker,cancel,budget,bill,reminder,trial,money,saving,privacy,pet,renewal

## Data safety / privacy nutrition label
- Data collected: **None**
- Data shared: **None**
- Network access: **None** (no INTERNET permission on Android)
- All data stored locally (localStorage / WebView storage); delete the app, delete the data.

## Submission checklist
| Item | Status |
|---|---|
| Android release AAB | ✅ built by CI (`zenny-release-aab` artifact); sign via `ZENNY_KEYSTORE_*` secrets |
| Play data-safety form | Declare "no data collected/shared" |
| iOS project | `ios/` generated; archive + sign in Xcode on macOS (no entitlements needed) |
| PWA | `dist/` deployable to any static host |
| Screenshots | Capture from e2e runs (`test-results/*.png`) or device emulators |
| Privacy policy URL | Static page stating "no data leaves the device" (host with the PWA) |
