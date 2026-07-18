import type { Cadence, Subscription } from './types';

const OCCURRENCES_PER_YEAR: Record<Cadence, number> = {
  weekly: 52,
  monthly: 12,
  quarterly: 4,
  yearly: 1
};

export function yearlyCostCents(priceCents: number, cadence: Cadence): number {
  return priceCents * OCCURRENCES_PER_YEAR[cadence];
}

export function monthlyCostCents(priceCents: number, cadence: Cadence): number {
  return Math.round(yearlyCostCents(priceCents, cadence) / 12);
}

const isPaying = (s: Subscription) => s.status === 'active' || s.status === 'trial';

export function totalMonthlyBurnCents(subs: Subscription[]): number {
  return subs.filter(isPaying).reduce((t, s) => t + monthlyCostCents(s.priceCents, s.cadence), 0);
}

export function totalYearlyBurnCents(subs: Subscription[]): number {
  return subs.filter(isPaying).reduce((t, s) => t + yearlyCostCents(s.priceCents, s.cadence), 0);
}

export function rescuedYearlyCents(subs: Subscription[]): number {
  return subs
    .filter((s) => s.status === 'slain')
    .reduce((t, s) => t + yearlyCostCents(s.priceCents, s.cadence), 0);
}

/** Parse a user-typed amount ("9.99") into integer minor units for the currency. */
export function parseToCents(text: string, currency: string): number | null {
  const value = Number(text.replace(/[,\s]/g, ''));
  if (!Number.isFinite(value) || value < 0) return null;
  const digits =
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).resolvedOptions()
      .maximumFractionDigits ?? 2;
  return Math.round(value * 10 ** digits);
}

export function formatCents(cents: number, currency: string): string {
  const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency });
  const digits = fmt.resolvedOptions().maximumFractionDigits ?? 2;
  return fmt.format(cents / 10 ** digits);
}
