import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cadence, Subscription } from './domain/types';

export interface NewSubscription {
  name: string;
  priceCents: number;
  cadence: Cadence;
  firstBillDate: string;
  status?: 'active' | 'trial';
  trialEndDate?: string;
  category?: string;
}

interface Settings {
  currency: string;
}

interface ZennyState {
  subscriptions: Subscription[];
  settings: Settings;
  addSubscription: (input: NewSubscription) => void;
  updateSubscription: (id: string, patch: Partial<Subscription>) => void;
  slaySubscription: (id: string, todayISO: string) => void;
  restoreSubscription: (id: string, todayISO: string) => void;
  removeSubscription: (id: string) => void;
  recordUsageCheck: (id: string, used: boolean, todayISO: string) => void;
  setCurrency: (currency: string) => void;
}

const patchSub = (
  subs: Subscription[],
  id: string,
  fn: (s: Subscription) => Subscription
): Subscription[] => subs.map((s) => (s.id === id ? fn(s) : s));

export const useZenny = create<ZennyState>()(
  persist(
    (set) => ({
      subscriptions: [],
      settings: { currency: 'USD' },

      addSubscription: (input) =>
        set((st) => ({
          subscriptions: [
            ...st.subscriptions,
            {
              id: crypto.randomUUID(),
              status: 'active',
              ...input,
              usageChecks: []
            }
          ]
        })),

      updateSubscription: (id, patch) =>
        set((st) => ({ subscriptions: patchSub(st.subscriptions, id, (s) => ({ ...s, ...patch })) })),

      slaySubscription: (id, todayISO) =>
        set((st) => ({
          subscriptions: patchSub(st.subscriptions, id, (s) => ({
            ...s,
            status: 'slain',
            slainAt: todayISO
          }))
        })),

      restoreSubscription: (id, todayISO) =>
        set((st) => ({
          subscriptions: patchSub(st.subscriptions, id, (s) => ({
            ...s,
            // a still-running trial comes back as a trial, not a paid subscription
            status: s.trialEndDate && s.trialEndDate >= todayISO ? 'trial' : 'active',
            slainAt: undefined
          }))
        })),

      removeSubscription: (id) =>
        set((st) => ({ subscriptions: st.subscriptions.filter((s) => s.id !== id) })),

      recordUsageCheck: (id, used, todayISO) =>
        set((st) => ({
          subscriptions: patchSub(st.subscriptions, id, (s) => ({
            ...s,
            usageChecks: [
              ...s.usageChecks.filter((c) => c.date !== todayISO),
              { date: todayISO, used }
            ]
          }))
        })),

      setCurrency: (currency) => set((st) => ({ settings: { ...st.settings, currency } }))
    }),
    { name: 'zenny-store' }
  )
);
