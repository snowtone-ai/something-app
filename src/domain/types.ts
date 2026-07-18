export type Cadence = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export type SubscriptionStatus = 'active' | 'trial' | 'slain';

export interface UsageCheck {
  /** ISO date (YYYY-MM-DD) the check-in was answered */
  date: string;
  used: boolean;
}

export interface Subscription {
  id: string;
  name: string;
  /** Integer minor units (cents, yen, ...) — never floats */
  priceCents: number;
  cadence: Cadence;
  /** ISO date (YYYY-MM-DD) of the first/anchor billing date */
  firstBillDate: string;
  status: SubscriptionStatus;
  /** ISO date the trial converts to paid (status === 'trial') */
  trialEndDate?: string;
  /** ISO date the subscription was slain (status === 'slain') */
  slainAt?: string;
  usageChecks: UsageCheck[];
  category?: string;
}

export type ZombieLevel = 'unknown' | 'healthy' | 'watch' | 'zombie';

export type PetMood = 'happy' | 'worried' | 'sick';

export interface PetState {
  level: number;
  stage: 'egg' | 'hatchling' | 'kid' | 'guardian' | 'dragon' | 'elder';
  mood: PetMood;
  /** Minor units rescued per year by slaying subscriptions */
  rescuedYearlyCents: number;
  /** Minor units still needed to reach the next level (0 at max level) */
  toNextLevelCents: number;
}
