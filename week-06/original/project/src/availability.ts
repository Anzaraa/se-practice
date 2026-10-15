import type { Booking, Room, Verdict } from "./types";

const MAX_BOOKING_MINUTES = 120;
const DAY_END = 1440;

/**
 * AC1: 0 ≤ start < end ≤ 1440 and start must be after current time.
 * AC2: No booking longer than 120 minutes.
 * AC3: Reject when the selected room is blocked.
 * AC4: Reject overlap with existing bookings; touching endpoints are allowed.
 * AC5: Pure check — never mutates bookings.
 */
export function checkAvailability(
  roomId: string,
  start: number,
  end: number,
  currentTime: number,
  rooms: Room[],
  bookings: Booking[]
): Verdict {
  const reasons: string[] = [];

  // AC1 — interval validity
  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    reasons.push("Start and end times are required.");
  } else {
    if (start < 0 || start >= end || end > DAY_END) {
      reasons.push(
        "Interval must satisfy 0 ≤ start < end ≤ 1440 minutes (00:00 to 24:00)."
      );
    }
    if (start <= currentTime && start < end) {
      reasons.push("Start time must be after the current time.");
    }
  }

  // AC2 — max duration
  if (Number.isFinite(start) && Number.isFinite(end) && end - start > MAX_BOOKING_MINUTES) {
    reasons.push("Bookings may not exceed 120 minutes.");
  }

  // AC3 — blocked room
  const room = rooms.find((r) => r.id === roomId);
  if (!room) {
    reasons.push("Please select a room.");
  } else if (room.blocked) {
    reasons.push(`"${room.name}" is currently blocked and cannot be booked.`);
  }

  // AC4 — overlap (touching endpoints allowed)
  if (room && !room.blocked && start < end && start >= 0 && end <= DAY_END) {
    const conflicts = bookings.filter(
      (b) => b.roomId === roomId && start < b.end && end > b.start
    );
    for (const c of conflicts) {
      reasons.push(
        `Overlaps existing booking by ${c.bookedBy} (${fmt(c.start)}–${fmt(c.end)}).`
      );
    }
  }

  return reasons.length === 0 ? { kind: "available" } : { kind: "unavailable", reasons };
}

/** minutes-from-midnight -> "HH:MM" */
export function fmt(min: number): string {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** "HH:MM" -> minutes-from-midnight, or NaN when unparseable */
export function parseTime(value: string): number {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return NaN;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h < 0 || h > 23 || m < 0 || m > 59) return NaN;
  return h * 60 + m;
}
