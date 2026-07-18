import { rescuedYearlyCents } from './money';
import { zombieLevel } from './zombie';
import type { PetMood, PetState, Subscription } from './types';

/** Rescued cents/year required to reach each level (index 0 = level 1). */
const LEVEL_THRESHOLDS = [0, 5000, 15_000, 30_000, 60_000, 120_000] as const;

const STAGES = ['egg', 'hatchling', 'kid', 'guardian', 'dragon', 'elder'] as const;

function mood(zombieCount: number, trackedCount: number): PetMood {
  if (zombieCount === 0) return 'happy';
  if (zombieCount >= 3 || zombieCount / trackedCount >= 0.5) return 'sick';
  return 'worried';
}

export function petState(subs: Subscription[], todayISO: string): PetState {
  const rescued = rescuedYearlyCents(subs);

  let level = 1;
  while (level < LEVEL_THRESHOLDS.length && rescued >= LEVEL_THRESHOLDS[level]) level++;

  const tracked = subs.filter((s) => s.status !== 'slain');
  const zombies = tracked.filter((s) => zombieLevel(s, todayISO) === 'zombie');

  return {
    level,
    stage: STAGES[level - 1],
    mood: mood(zombies.length, tracked.length),
    rescuedYearlyCents: rescued,
    toNextLevelCents: level < LEVEL_THRESHOLDS.length ? LEVEL_THRESHOLDS[level] - rescued : 0
  };
}
