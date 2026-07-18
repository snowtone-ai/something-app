import type { Cadence } from './types';

export interface Preset {
  name: string;
  category: string;
  /** Typical price in USD cents; user-editable after selection */
  priceCents: number;
  cadence: Cadence;
}

export const PRESETS: Preset[] = [
  { name: 'Netflix', category: 'Streaming', priceCents: 1549, cadence: 'monthly' },
  { name: 'Spotify', category: 'Music', priceCents: 1199, cadence: 'monthly' },
  { name: 'YouTube Premium', category: 'Streaming', priceCents: 1399, cadence: 'monthly' },
  { name: 'Disney+', category: 'Streaming', priceCents: 999, cadence: 'monthly' },
  { name: 'Amazon Prime', category: 'Shopping', priceCents: 13_900, cadence: 'yearly' },
  { name: 'Apple Music', category: 'Music', priceCents: 1099, cadence: 'monthly' },
  { name: 'Apple TV+', category: 'Streaming', priceCents: 999, cadence: 'monthly' },
  { name: 'iCloud+', category: 'Cloud', priceCents: 299, cadence: 'monthly' },
  { name: 'Google One', category: 'Cloud', priceCents: 199, cadence: 'monthly' },
  { name: 'Dropbox', category: 'Cloud', priceCents: 1199, cadence: 'monthly' },
  { name: 'ChatGPT Plus', category: 'AI', priceCents: 2000, cadence: 'monthly' },
  { name: 'Claude Pro', category: 'AI', priceCents: 2000, cadence: 'monthly' },
  { name: 'Hulu', category: 'Streaming', priceCents: 999, cadence: 'monthly' },
  { name: 'HBO Max', category: 'Streaming', priceCents: 1699, cadence: 'monthly' },
  { name: 'Crunchyroll', category: 'Streaming', priceCents: 799, cadence: 'monthly' },
  { name: 'Audible', category: 'Books', priceCents: 1495, cadence: 'monthly' },
  { name: 'Kindle Unlimited', category: 'Books', priceCents: 1199, cadence: 'monthly' },
  { name: 'PlayStation Plus', category: 'Gaming', priceCents: 8000, cadence: 'yearly' },
  { name: 'Xbox Game Pass', category: 'Gaming', priceCents: 1999, cadence: 'monthly' },
  { name: 'Nintendo Switch Online', category: 'Gaming', priceCents: 1999, cadence: 'yearly' },
  { name: 'Adobe Creative Cloud', category: 'Tools', priceCents: 5999, cadence: 'monthly' },
  { name: 'Notion', category: 'Tools', priceCents: 1000, cadence: 'monthly' },
  { name: 'Canva Pro', category: 'Tools', priceCents: 1500, cadence: 'monthly' },
  { name: 'Gym membership', category: 'Fitness', priceCents: 4000, cadence: 'monthly' },
  { name: 'NYT / News', category: 'News', priceCents: 1700, cadence: 'monthly' },
  { name: 'Patreon pledges', category: 'Creators', priceCents: 500, cadence: 'monthly' }
];
