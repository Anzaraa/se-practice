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
export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start <= b.end && end >= b.start) return false;
  }
  // keep the room's list current with the slot that was just found free
  bookings.push({ start, end });
  return true;
}
