import { useState } from 'react';
import { PRESETS } from '../domain/presets';
import { parseToCents, formatCents } from '../domain/money';
import { toISODate } from '../domain/dates';
import type { Cadence, Subscription } from '../domain/types';
import { useZenny } from '../store';

interface Props {
  editing?: Subscription;
  onClose: () => void;
}

export function SubscriptionForm({ editing, onClose }: Props) {
  const { settings, addSubscription, updateSubscription } = useZenny();
  const digitsPrice = (cents: number) => {
    // present stored minor units back as a plain number string for the input
    return formatCents(cents, settings.currency).replace(/[^0-9.,]/g, '');
  };

  const [name, setName] = useState(editing?.name ?? '');
  const [price, setPrice] = useState(editing ? digitsPrice(editing.priceCents) : '');
  const [cadence, setCadence] = useState<Cadence>(editing?.cadence ?? 'monthly');
  const [firstBillDate, setFirstBillDate] = useState(editing?.firstBillDate ?? toISODate(new Date()));
  const [isTrial, setIsTrial] = useState(editing?.status === 'trial');
  const [trialEndDate, setTrialEndDate] = useState(editing?.trialEndDate ?? '');
  const [error, setError] = useState('');

  const applyPreset = (presetName: string) => {
    const p = PRESETS.find((x) => x.name === presetName);
    if (!p) return;
    setName(p.name);
    setCadence(p.cadence);
    setPrice((p.priceCents / 100).toFixed(2));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceCents = parseToCents(price, settings.currency);
    if (!name.trim()) return setError('Please give it a name.');
    if (priceCents === null || priceCents === 0) return setError('Please enter a valid price.');
    if (isTrial && !trialEndDate) return setError('When does the trial end?');

    const base = {
      name: name.trim(),
      priceCents,
      cadence,
      firstBillDate,
      status: (isTrial ? 'trial' : 'active') as 'trial' | 'active',
      trialEndDate: isTrial ? trialEndDate : undefined
    };
    if (editing) updateSubscription(editing.id, base);
    else addSubscription(base);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-label={editing ? 'Edit subscription' : 'New subscription'} onClick={(e) => e.stopPropagation()}>
        <h2>{editing ? 'Edit subscription' : 'Track a subscription'}</h2>
        <form onSubmit={submit}>
          {!editing && (
            <label>
              Preset
              <select defaultValue="" onChange={(e) => applyPreset(e.target.value)}>
                <option value="">Custom…</option>
                {PRESETS.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Netflix" />
          </label>
          <label>
            Price ({settings.currency})
            <input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" placeholder="15.49" />
          </label>
          <label>
            Billing cycle
            <select value={cadence} onChange={(e) => setCadence(e.target.value as Cadence)}>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </label>
          <label>
            First bill date
            <input type="date" value={firstBillDate} onChange={(e) => setFirstBillDate(e.target.value)} />
          </label>
          <label className="row">
            <input type="checkbox" checked={isTrial} onChange={(e) => setIsTrial(e.target.checked)} />
            Free trial
          </label>
          {isTrial && (
            <label>
              Trial end date
              <input type="date" value={trialEndDate} onChange={(e) => setTrialEndDate(e.target.value)} />
            </label>
          )}
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="btn ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
