import { describe, it, expect } from 'vitest';
import { zombieLevel, shouldPromptCheckIn } from './zombie';
import type { Subscription, UsageCheck } from './types';

const TODAY = '2026-07-19';

const sub = (checks: UsageCheck[], over: Partial<Subscription> = {}): Subscription => ({
  id: 'x',
  name: 'X',
  priceCents: 999,
  cadence: 'monthly',
  firstBillDate: '2026-01-01',
  status: 'active',
  usageChecks: checks,
  ...over
});

describe('zombieLevel', () => {
  it('is unknown with no check-ins', () => {
    expect(zombieLevel(sub([]), TODAY)).toBe('unknown');
  });

  it('ignores check-ins older than 60 days', () => {
    expect(zombieLevel(sub([{ date: '2026-01-01', used: false }]), TODAY)).toBe('unknown');
  });

  it('is zombie when nothing was used recently', () => {
    const checks = [
      { date: '2026-07-01', used: false },
      { date: '2026-07-10', used: false }
    ];
    expect(zombieLevel(sub(checks), TODAY)).toBe('zombie');
  });

  it('is watch when used less than half the time', () => {
    const checks = [
      { date: '2026-06-25', used: false },
      { date: '2026-07-05', used: false },
      { date: '2026-07-12', used: true }
    ];
    expect(zombieLevel(sub(checks), TODAY)).toBe('watch');
  });

  it('is healthy when used at least half the time', () => {
    const checks = [
      { date: '2026-07-05', used: true },
      { date: '2026-07-12', used: false },
      { date: '2026-07-15', used: true }
    ];
    expect(zombieLevel(sub(checks), TODAY)).toBe('healthy');
  });

  it('is unknown for slain subscriptions regardless of history', () => {
    const checks = [{ date: '2026-07-10', used: false }];
    expect(zombieLevel(sub(checks, { status: 'slain' }), TODAY)).toBe('unknown');
  });
});

describe('shouldPromptCheckIn', () => {
  it('prompts when there is no check-in within 7 days', () => {
    expect(shouldPromptCheckIn(sub([]), TODAY)).toBe(true);
    expect(shouldPromptCheckIn(sub([{ date: '2026-07-11', used: true }]), TODAY)).toBe(true);
  });

  it('does not prompt when checked in recently', () => {
    expect(shouldPromptCheckIn(sub([{ date: '2026-07-13', used: true }]), TODAY)).toBe(false);
  });

  it('never prompts for slain subscriptions', () => {
    expect(shouldPromptCheckIn(sub([], { status: 'slain' }), TODAY)).toBe(false);
  });
});
