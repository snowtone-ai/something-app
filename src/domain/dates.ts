import type { Cadence } from './types';

interface Ymd {
  y: number;
  m: number; // 1-12
  d: number;
}

function parse(iso: string): Ymd {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m, d };
}

function fmt({ y, m, d }: Ymd): string {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function daysInMonth(y: number, m: number): number {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

/** Anchor + n months, clamping the anchor day to the target month's length. */
function addMonthsClamped(anchor: Ymd, months: number): Ymd {
  const total = anchor.y * 12 + (anchor.m - 1) + months;
  const y = Math.floor(total / 12);
  const m = (total % 12) + 1;
  return { y, m, d: Math.min(anchor.d, daysInMonth(y, m)) };
}

function toUTC({ y, m, d }: Ymd): number {
  return Date.UTC(y, m - 1, d);
}

const MS_PER_DAY = 86_400_000;

/**
 * First billing occurrence on or after `todayISO`, anchored at `firstBillDate`.
 * Month-based cadences clamp to short months but recover the anchor day afterwards.
 */
export function nextRenewalDate(firstBillDate: string, cadence: Cadence, todayISO: string): string {
  const anchor = parse(firstBillDate);
  const today = toUTC(parse(todayISO));

  if (cadence === 'weekly') {
    const start = toUTC(anchor);
    if (start >= today) return fmt(anchor);
    const weeks = Math.ceil((today - start) / (7 * MS_PER_DAY));
    return fmt(utcToYmd(start + weeks * 7 * MS_PER_DAY));
  }

  const step = cadence === 'monthly' ? 1 : cadence === 'quarterly' ? 3 : 12;
  let n = 0;
  let next = anchor;
  while (toUTC(next) < today) {
    n += step;
    next = addMonthsClamped(anchor, n);
  }
  return fmt(next);
}

function utcToYmd(ms: number): Ymd {
  const dt = new Date(ms);
  return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
}

export function daysUntil(dateISO: string, todayISO: string): number {
  return Math.round((toUTC(parse(dateISO)) - toUTC(parse(todayISO))) / MS_PER_DAY);
}

/** Format a local Date as YYYY-MM-DD (local calendar, not UTC). */
export function toISODate(date: Date): string {
  return fmt({ y: date.getFullYear(), m: date.getMonth() + 1, d: date.getDate() });
}
