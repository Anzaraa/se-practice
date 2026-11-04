export interface Interval {
  start: number;
  end: number;
}

export interface CanBookInput {
  start: number; // minutes after midnight
  end: number;
  now: number;
  blocked: boolean;
  bookings: Interval[];
}

const MAX_BOOKING_MINUTES = 120;
const DAY_END = 1440;

// Conditions copied unchanged from checkAvailability() in availability.ts
export function canBook({ start, end, now, blocked, bookings }: CanBookInput): boolean {
  // AC1 — interval validity
  if (!Number.isFinite(start) || !Number.isFinite(end)) return false;
  if (start < 0) return false;
  if (end > DAY_END) return false;
  if (start >= end) return false;
  if (start <= now) return false;

  // AC2 — max duration
  if (end - start > MAX_BOOKING_MINUTES) return false;

  // AC3 — blocked room
  if (blocked) return false;

  // AC4 — overlap, touching endpoints allowed
  // (the original only checked overlap when start >= 0 — kept as is)
  if (start >= 0) {
    for (const b of bookings) {
      if (start < b.end && end > b.start) return false;
    }
  }

  return true;
}