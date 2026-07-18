import { describe, it, expect } from 'vitest';
import { nextRenewalDate, daysUntil, toISODate } from './dates';

describe('nextRenewalDate', () => {
  it('returns the anchor date itself when it is in the future', () => {
    expect(nextRenewalDate('2026-09-15', 'monthly', '2026-07-19')).toBe('2026-09-15');
  });

  it('returns today when today is a billing day', () => {
    expect(nextRenewalDate('2026-01-19', 'monthly', '2026-07-19')).toBe('2026-07-19');
  });

  it('advances monthly cycles', () => {
    expect(nextRenewalDate('2026-01-15', 'monthly', '2026-07-19')).toBe('2026-08-15');
  });

  it('clamps month-end anchors to shorter months', () => {
    expect(nextRenewalDate('2026-01-31', 'monthly', '2026-02-10')).toBe('2026-02-28');
  });

  it('recovers the original anchor day after a clamped month', () => {
    expect(nextRenewalDate('2026-01-31', 'monthly', '2026-03-01')).toBe('2026-03-31');
  });

  it('clamps Feb 29 yearly anchors in non-leap years', () => {
    expect(nextRenewalDate('2024-02-29', 'yearly', '2026-01-01')).toBe('2026-02-28');
  });

  it('keeps Feb 29 in leap years', () => {
    expect(nextRenewalDate('2024-02-29', 'yearly', '2028-01-01')).toBe('2028-02-29');
  });

  it('advances weekly cycles by exact 7-day steps', () => {
    // 2026-07-13 is a Monday; today Wed 2026-07-15 → next Monday
    expect(nextRenewalDate('2026-07-13', 'weekly', '2026-07-15')).toBe('2026-07-20');
  });

  it('advances quarterly cycles with clamping', () => {
    expect(nextRenewalDate('2025-11-30', 'quarterly', '2026-01-15')).toBe('2026-02-28');
  });
});

describe('daysUntil', () => {
  it('computes whole-day differences', () => {
    expect(daysUntil('2026-07-22', '2026-07-19')).toBe(3);
    expect(daysUntil('2026-07-19', '2026-07-19')).toBe(0);
    expect(daysUntil('2026-08-01', '2026-07-19')).toBe(13);
  });

  it('crosses month and year boundaries', () => {
    expect(daysUntil('2027-01-01', '2026-12-31')).toBe(1);
  });
});

describe('toISODate', () => {
  it('formats a local Date as YYYY-MM-DD', () => {
    expect(toISODate(new Date(2026, 6, 19))).toBe('2026-07-19');
    expect(toISODate(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});
