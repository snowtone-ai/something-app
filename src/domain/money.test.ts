import { describe, it, expect } from 'vitest';
import {
  yearlyCostCents,
  monthlyCostCents,
  totalMonthlyBurnCents,
  totalYearlyBurnCents,
  rescuedYearlyCents,
  formatCents,
  parseToCents
} from './money';
import type { Subscription } from './types';

const sub = (over: Partial<Subscription>): Subscription => ({
  id: 'x',
  name: 'X',
  priceCents: 999,
  cadence: 'monthly',
  firstBillDate: '2026-01-01',
  status: 'active',
  usageChecks: [],
  ...over
});

describe('yearlyCostCents', () => {
  it('multiplies by cadence occurrences per year', () => {
    expect(yearlyCostCents(1000, 'weekly')).toBe(52_000);
    expect(yearlyCostCents(1000, 'monthly')).toBe(12_000);
    expect(yearlyCostCents(1000, 'quarterly')).toBe(4_000);
    expect(yearlyCostCents(1000, 'yearly')).toBe(1_000);
  });
});

describe('monthlyCostCents', () => {
  it('normalizes any cadence to a rounded monthly figure', () => {
    expect(monthlyCostCents(1200, 'yearly')).toBe(100);
    expect(monthlyCostCents(999, 'monthly')).toBe(999);
    expect(monthlyCostCents(300, 'quarterly')).toBe(100);
    // 52 * 500 / 12 = 2166.66… → 2167
    expect(monthlyCostCents(500, 'weekly')).toBe(2167);
  });
});

describe('burn totals', () => {
  const subs: Subscription[] = [
    sub({ id: 'a', priceCents: 1000, cadence: 'monthly', status: 'active' }),
    sub({ id: 'b', priceCents: 12_000, cadence: 'yearly', status: 'trial' }),
    sub({ id: 'c', priceCents: 5000, cadence: 'monthly', status: 'slain', slainAt: '2026-06-01' })
  ];

  it('counts active and trial, excludes slain', () => {
    expect(totalMonthlyBurnCents(subs)).toBe(1000 + 1000);
    expect(totalYearlyBurnCents(subs)).toBe(12_000 + 12_000);
  });

  it('sums slain subscriptions into the rescued ledger (yearly)', () => {
    expect(rescuedYearlyCents(subs)).toBe(60_000);
  });

  it('is zero for empty lists', () => {
    expect(totalMonthlyBurnCents([])).toBe(0);
    expect(rescuedYearlyCents([])).toBe(0);
  });
});

describe('formatCents', () => {
  it('formats 2-decimal currencies from minor units', () => {
    expect(formatCents(1999, 'USD')).toBe('$19.99');
    expect(formatCents(0, 'USD')).toBe('$0.00');
  });

  it('formats 0-decimal currencies without dividing', () => {
    expect(formatCents(500, 'JPY')).toBe('¥500');
  });

  it('formats EUR', () => {
    expect(formatCents(12_345, 'EUR')).toBe('€123.45');
  });
});

describe('parseToCents', () => {
  it('parses decimal input into minor units', () => {
    expect(parseToCents('9.99', 'USD')).toBe(999);
    expect(parseToCents('1,299.50', 'USD')).toBe(129_950);
  });

  it('respects 0-decimal currencies', () => {
    expect(parseToCents('500', 'JPY')).toBe(500);
  });

  it('rejects invalid or negative input', () => {
    expect(parseToCents('abc', 'USD')).toBeNull();
    expect(parseToCents('-5', 'USD')).toBeNull();
  });
});
