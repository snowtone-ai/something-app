import { describe, it, expect } from 'vitest';
import { petState } from './pet';
import type { Subscription } from './types';

const TODAY = '2026-07-19';

const sub = (over: Partial<Subscription>): Subscription => ({
  id: Math.random().toString(36).slice(2),
  name: 'X',
  priceCents: 1000,
  cadence: 'monthly',
  firstBillDate: '2026-01-01',
  status: 'active',
  usageChecks: [],
  ...over
});

/** slain sub rescuing `cents` per year */
const slain = (centsYearly: number): Subscription =>
  sub({ status: 'slain', slainAt: '2026-06-01', cadence: 'yearly', priceCents: centsYearly });

const zombie = (): Subscription =>
  sub({
    usageChecks: [
      { date: '2026-07-01', used: false },
      { date: '2026-07-10', used: false }
    ]
  });

describe('petState — leveling', () => {
  it('starts as a level-1 egg with nothing rescued', () => {
    const p = petState([], TODAY);
    expect(p.level).toBe(1);
    expect(p.stage).toBe('egg');
    expect(p.rescuedYearlyCents).toBe(0);
    expect(p.toNextLevelCents).toBe(5000);
  });

  it('hatches at $50/yr rescued', () => {
    const p = petState([slain(5000)], TODAY);
    expect(p.level).toBe(2);
    expect(p.stage).toBe('hatchling');
  });

  it('progresses through stages by rescued amount', () => {
    expect(petState([slain(15_000)], TODAY).stage).toBe('kid');
    expect(petState([slain(30_000)], TODAY).stage).toBe('guardian');
    expect(petState([slain(60_000)], TODAY).stage).toBe('dragon');
  });

  it('reaches max stage elder at $1200/yr with no further target', () => {
    const p = petState([slain(120_000)], TODAY);
    expect(p.level).toBe(6);
    expect(p.stage).toBe('elder');
    expect(p.toNextLevelCents).toBe(0);
  });

  it('reports remaining cents to the next level', () => {
    const p = petState([slain(4000)], TODAY);
    expect(p.level).toBe(1);
    expect(p.toNextLevelCents).toBe(1000);
  });
});

describe('petState — mood', () => {
  it('is happy with no zombie subscriptions', () => {
    expect(petState([sub({})], TODAY).mood).toBe('happy');
  });

  it('is worried with a zombie around', () => {
    expect(petState([sub({}), sub({}), zombie()], TODAY).mood).toBe('worried');
  });

  it('is sick when half or more of tracked subs are zombies', () => {
    expect(petState([zombie(), zombie(), sub({}), sub({})], TODAY).mood).toBe('sick');
  });

  it('is sick with three or more zombies regardless of ratio', () => {
    const subs = [zombie(), zombie(), zombie(), ...Array.from({ length: 7 }, () => sub({}))];
    expect(petState(subs, TODAY).mood).toBe('sick');
  });
});
