import { describe, it, expect, beforeEach } from 'vitest';
import { useZenny } from './store';

const reset = () =>
  useZenny.setState({ subscriptions: [], settings: { currency: 'USD' } });

beforeEach(reset);

const add = () =>
  useZenny.getState().addSubscription({
    name: 'Netflix',
    priceCents: 1549,
    cadence: 'monthly',
    firstBillDate: '2026-01-15'
  });

describe('store', () => {
  it('adds a subscription with a generated id and active status', () => {
    add();
    const subs = useZenny.getState().subscriptions;
    expect(subs).toHaveLength(1);
    expect(subs[0].id).toBeTruthy();
    expect(subs[0].status).toBe('active');
    expect(subs[0].usageChecks).toEqual([]);
  });

  it('slays a subscription, stamping slainAt', () => {
    add();
    const id = useZenny.getState().subscriptions[0].id;
    useZenny.getState().slaySubscription(id, '2026-07-19');
    const s = useZenny.getState().subscriptions[0];
    expect(s.status).toBe('slain');
    expect(s.slainAt).toBe('2026-07-19');
  });

  it('restores a slain subscription back to active', () => {
    add();
    const id = useZenny.getState().subscriptions[0].id;
    useZenny.getState().slaySubscription(id, '2026-07-19');
    useZenny.getState().restoreSubscription(id, '2026-07-19');
    const s = useZenny.getState().subscriptions[0];
    expect(s.status).toBe('active');
    expect(s.slainAt).toBeUndefined();
  });

  it('restores a slain sub with a live trial back to trial status', () => {
    useZenny.getState().addSubscription({
      name: 'Trial svc',
      priceCents: 999,
      cadence: 'monthly',
      firstBillDate: '2026-07-01',
      status: 'trial',
      trialEndDate: '2026-08-01'
    });
    const id = useZenny.getState().subscriptions[0].id;
    useZenny.getState().slaySubscription(id, '2026-07-19');
    useZenny.getState().restoreSubscription(id, '2026-07-19');
    expect(useZenny.getState().subscriptions[0].status).toBe('trial');
  });

  it('records usage check-ins, replacing same-day answers', () => {
    add();
    const id = useZenny.getState().subscriptions[0].id;
    useZenny.getState().recordUsageCheck(id, false, '2026-07-19');
    useZenny.getState().recordUsageCheck(id, true, '2026-07-19');
    expect(useZenny.getState().subscriptions[0].usageChecks).toEqual([
      { date: '2026-07-19', used: true }
    ]);
  });

  it('updates fields and removes subscriptions', () => {
    add();
    const id = useZenny.getState().subscriptions[0].id;
    useZenny.getState().updateSubscription(id, { priceCents: 1999 });
    expect(useZenny.getState().subscriptions[0].priceCents).toBe(1999);
    useZenny.getState().removeSubscription(id);
    expect(useZenny.getState().subscriptions).toHaveLength(0);
  });

  it('persists to localStorage under the zenny-store key', () => {
    add();
    expect(localStorage.getItem('zenny-store')).toContain('Netflix');
  });
});
