import { daysUntil } from './dates';
import type { Subscription, UsageCheck, ZombieLevel } from './types';

const WINDOW_DAYS = 60;
const CHECK_IN_INTERVAL_DAYS = 7;

function recentChecks(checks: UsageCheck[], todayISO: string): UsageCheck[] {
  return checks.filter((c) => {
    const age = -daysUntil(c.date, todayISO);
    return age >= 0 && age <= WINDOW_DAYS;
  });
}

export function zombieLevel(sub: Subscription, todayISO: string): ZombieLevel {
  if (sub.status === 'slain') return 'unknown';
  const recent = recentChecks(sub.usageChecks, todayISO);
  if (recent.length === 0) return 'unknown';
  const used = recent.filter((c) => c.used).length;
  if (used === 0) return 'zombie';
  return used / recent.length < 0.5 ? 'watch' : 'healthy';
}

export function shouldPromptCheckIn(sub: Subscription, todayISO: string): boolean {
  if (sub.status === 'slain') return false;
  return !sub.usageChecks.some((c) => {
    const age = -daysUntil(c.date, todayISO);
    return age >= 0 && age < CHECK_IN_INTERVAL_DAYS;
  });
}
