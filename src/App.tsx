import { useEffect, useMemo, useState } from 'react';
import { PetView } from './components/PetView';
import { SubscriptionForm } from './components/SubscriptionForm';
import { ShareCard } from './components/ShareCard';
import { toISODate, nextRenewalDate, daysUntil } from './domain/dates';
import {
  formatCents,
  monthlyCostCents,
  totalMonthlyBurnCents,
  totalYearlyBurnCents,
  yearlyCostCents
} from './domain/money';
import { petState } from './domain/pet';
import { shouldPromptCheckIn, zombieLevel } from './domain/zombie';
import type { Subscription } from './domain/types';
import { useZenny } from './store';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'INR', 'BRL'];

const STAGE_TAGLINE: Record<string, string> = {
  egg: 'Slay your first zombie subscription to hatch me!',
  hatchling: 'I hatched! Keep rescuing your money.',
  kid: 'Growing strong on rescued cash!',
  guardian: 'I guard your wallet now.',
  dragon: 'Subscription companies fear us.',
  elder: 'Maximum power. Your wallet is legendary.'
};

const MOOD_LINE: Record<string, string> = {
  happy: 'No zombies in sight — feeling great!',
  worried: 'I sense a zombie subscription draining you…',
  sick: 'So many zombies… please slay something!'
};

export default function App() {
  const { subscriptions, settings, slaySubscription, restoreSubscription, removeSubscription, recordUsageCheck, setCurrency } =
    useZenny();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Subscription | undefined>();
  const [showShare, setShowShare] = useState(false);

  // refreshes at midnight so renewal countdowns stay correct in long-lived sessions
  const [today, setToday] = useState(() => toISODate(new Date()));
  useEffect(() => {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const t = setTimeout(() => setToday(toISODate(new Date())), midnight.getTime() - now.getTime() + 1000);
    return () => clearTimeout(t);
  }, [today]);
  const currency = settings.currency;

  const pet = useMemo(() => petState(subscriptions, today), [subscriptions, today]);
  const tracked = subscriptions.filter((s) => s.status !== 'slain');
  const slain = subscriptions.filter((s) => s.status === 'slain');
  const checkInTarget = tracked.find((s) => shouldPromptCheckIn(s, today));

  const sortedTracked = [...tracked].sort(
    (a, b) =>
      daysUntil(nextRenewalDate(a.firstBillDate, a.cadence, today), today) -
      daysUntil(nextRenewalDate(b.firstBillDate, b.cadence, today), today)
  );

  return (
    <div className="app">
      <header className="topbar">
        <h1>
          <span className="logo-mark">Ƶ</span> Zenny
        </h1>
        <select
          aria-label="Currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="currency-select"
        >
          {CURRENCIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </header>

      <section className="pet-card" aria-label="Your pet">
        <PetView pet={pet} />
        <div className="pet-info">
          <p className="pet-title">
            <strong>Zenny the {pet.stage}</strong> · Lv. {pet.level}
          </p>
          <p className="pet-line">{pet.rescuedYearlyCents === 0 ? STAGE_TAGLINE[pet.stage] : MOOD_LINE[pet.mood]}</p>
          <p className="rescued">
            Rescued <strong>{formatCents(pet.rescuedYearlyCents, currency)}/yr</strong>
          </p>
          {pet.toNextLevelCents > 0 && (
            <div className="progress" role="progressbar" aria-label="Progress to next level">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(
                    100,
                    (pet.rescuedYearlyCents / (pet.rescuedYearlyCents + pet.toNextLevelCents)) * 100
                  )}%`
                }}
              />
            </div>
          )}
          {slain.length > 0 && (
            <button className="btn small" onClick={() => setShowShare(true)}>
              Share victory
            </button>
          )}
        </div>
      </section>

      <section className="burn" aria-label="Your burn rate">
        <div className="burn-box" aria-label="Monthly burn">
          <span className="burn-label">Monthly burn</span>
          <span className="burn-value">{formatCents(totalMonthlyBurnCents(subscriptions), currency)}</span>
        </div>
        <div className="burn-box" aria-label="Yearly burn">
          <span className="burn-label">Yearly burn</span>
          <span className="burn-value">{formatCents(totalYearlyBurnCents(subscriptions), currency)}</span>
        </div>
      </section>

      {checkInTarget && (
        <section className="checkin" aria-label="Weekly check-in">
          <p>
            Did you actually use <strong>{checkInTarget.name}</strong> this week?
          </p>
          <div className="checkin-actions">
            <button className="btn small" onClick={() => recordUsageCheck(checkInTarget.id, true, today)}>
              Yes
            </button>
            <button className="btn small ghost" onClick={() => recordUsageCheck(checkInTarget.id, false, today)}>
              No
            </button>
          </div>
        </section>
      )}

      <section aria-label="Tracked subscriptions" className="list-section">
        <h2>Tracked</h2>
        {sortedTracked.length === 0 && (
          <p className="empty">Nothing tracked yet. Add your subscriptions and let&apos;s find the zombies. 🧟</p>
        )}
        <ul className="sub-list">
          {sortedTracked.map((s) => {
            const renewal = nextRenewalDate(s.firstBillDate, s.cadence, today);
            const days = daysUntil(renewal, today);
            const z = zombieLevel(s, today);
            const trialDays = s.status === 'trial' && s.trialEndDate ? daysUntil(s.trialEndDate, today) : null;
            return (
              <li key={s.id} className="sub-row">
                <button className="sub-main" onClick={() => setEditing(s)} aria-label={`Edit ${s.name}`}>
                  <span className="sub-name">
                    {s.name}
                    {z === 'zombie' && <span className="badge zombie">🧟 zombie</span>}
                    {z === 'watch' && <span className="badge watch">⚠️ barely used</span>}
                    {trialDays !== null && (
                      <span className={`badge trial ${trialDays <= 3 ? 'urgent' : ''}`}>
                        trial ends in {trialDays}d
                      </span>
                    )}
                  </span>
                  <span className="sub-meta">
                    {formatCents(s.priceCents, currency)}/{s.cadence.replace('ly', '')}
                    {s.cadence !== 'monthly' && (
                      <> · {formatCents(monthlyCostCents(s.priceCents, s.cadence), currency)}/mo</>
                    )}{' '}
                    ·{' '}
                    <span className={days <= 3 ? 'renew urgent' : 'renew'}>
                      {days === 0 ? 'renews today' : `renews in ${days}d`}
                    </span>
                  </span>
                </button>
                <button className="btn slay" onClick={() => slaySubscription(s.id, today)} aria-label={`Slay ${s.name}`}>
                  ⚔️ Slay
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {slain.length > 0 && (
        <section aria-label="Trophy shelf" className="list-section">
          <h2>Trophy shelf</h2>
          <ul className="sub-list">
            {slain.map((s) => (
              <li key={s.id} className="sub-row slain">
                <div className="sub-main">
                  <span className="sub-name">🏆 {s.name}</span>
                  <span className="sub-meta">
                    rescued {formatCents(yearlyCostCents(s.priceCents, s.cadence), currency)}/yr
                  </span>
                </div>
                <div className="row-actions">
                  <button className="btn small ghost" onClick={() => restoreSubscription(s.id, today)} aria-label={`Restore ${s.name}`}>
                    Restore
                  </button>
                  <button className="btn small ghost" onClick={() => removeSubscription(s.id)} aria-label={`Delete ${s.name}`}>
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="privacy-note">
        🔒 Everything stays on your device. No account. No bank link. No tracking. Ever.
      </footer>

      <button className="fab" onClick={() => setShowForm(true)} aria-label="Add subscription">
        ＋
      </button>

      {showForm && <SubscriptionForm onClose={() => setShowForm(false)} />}
      {editing && <SubscriptionForm editing={editing} onClose={() => setEditing(undefined)} />}
      {showShare && (
        <ShareCard pet={pet} slainCount={slain.length} currency={currency} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
}
