// src/booking.test.ts
// Unit tests for canBook() — the same function the page imports via `import { canBook } from "./booking"`.
// The function under test is NOT modified. All inputs are fresh per test; time is fixed.

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { canBook, type CanBookInput, type Interval } from "./booking";

// ---------------------------------------------------------------------------
// Fixed time & fresh fixtures
// ---------------------------------------------------------------------------

/** Supplied current time for every test: 540 = 09:00. */
const FIXED_NOW = 540;

/** Default existing booking 600–660 (10:00–11:00). Returned as a NEW array every call. */
function defaultBookings(): Interval[] {
  return [{ start: 600, end: 660 }];
}

/** Deep-freeze bookings so any mutation inside canBook throws (ESM test files run in strict mode). */
function freezeBookings(bookings: Interval[]): Interval[] {
  bookings.forEach((b) => Object.freeze(b));
  return Object.freeze(bookings) as Interval[];
}

/**
 * Builds a fresh CanBookInput from the default fixture:
 * now = 540, blocked = false, bookings = [{ start: 600, end: 660 }].
 */
function makeInput(
  start: number,
  end: number,
  overrides: Partial<Omit<CanBookInput, "start" | "end">> = {},
): CanBookInput {
  const bookings = overrides.bookings
    ? structuredClone(overrides.bookings) // never share a table literal between runs
    : defaultBookings();
  return {
    start,
    end,
    now: overrides.now ?? FIXED_NOW,
    blocked: overrides.blocked ?? false,
    bookings: freezeBookings(bookings),
  };
}

/** Calls canBook and asserts that the booking data is exactly unchanged (AC5). */
function decide(input: CanBookInput): boolean {
  const bookingsRef = input.bookings;
  const snapshot = structuredClone(input.bookings);

  const result = canBook(input);

  expect(input.bookings).toBe(bookingsRef); // same array, not replaced
  expect(input.bookings).toStrictEqual(snapshot); // same content, same length
  return result;
}

// Fixed wall clock: canBook must rely only on the supplied `now`,
// so pinning the system clock keeps every run deterministic.
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-04T23:30:00+05:00")); // deliberately far from now = 540 (09:00)
});

afterEach(() => {
  vi.useRealTimers();
});

// ---------------------------------------------------------------------------
// Reviewed case table
// ---------------------------------------------------------------------------

interface Case {
  id: string;
  ac: string;
  desc: string;
  start: number;
  end: number;
  blocked?: boolean;
  bookings?: Interval[];
  expected: boolean;
}

const cases: Case[] = [
  // AC1 — interval validity and "after now"
  { id: "T02", ac: "AC1", desc: "540–570 starts exactly at now", start: 540, end: 570, expected: false },
  { id: "T03", ac: "AC1", desc: "720–720 zero duration", start: 720, end: 720, expected: false },
  { id: "T04", ac: "AC1", desc: "750–720 reversed interval", start: 750, end: 720, expected: false },
  { id: "T05", ac: "AC1", desc: "1380–1441 ends past day end", start: 1380, end: 1441, expected: false },

  // AC1 + AC2 — boundary at day end and max duration together
  { id: "X1", ac: "AC1, AC2", desc: "1320–1440 ends at midnight, 120 min", start: 1320, end: 1440, expected: true },

  // AC2 — max duration 120
  { id: "T06", ac: "AC2", desc: "720–840 exactly 120 min", start: 720, end: 840, expected: true },
  { id: "T07", ac: "AC2", desc: "720–841 is 121 min", start: 720, end: 841, expected: false },

  // AC3 — blocked room
  { id: "T13", ac: "AC3", desc: "660–720 (valid as in T01) but room blocked", start: 660, end: 720, blocked: true, expected: false },

  // AC4 — overlap; touching endpoints allowed
  { id: "T01", ac: "AC4", desc: "660–720 touches booking end", start: 660, end: 720, expected: true },
  { id: "T08", ac: "AC4", desc: "570–600 touches booking start", start: 570, end: 600, expected: true },
  { id: "T09", ac: "AC4", desc: "630–690 partial overlap", start: 630, end: 690, expected: false },
  { id: "T10", ac: "AC4", desc: "570–690 contains booking", start: 570, end: 690, expected: false },
  { id: "T11", ac: "AC4", desc: "615–645 inside booking", start: 615, end: 645, expected: false },
  { id: "T12", ac: "AC4", desc: "600–660 identical to booking", start: 600, end: 660, expected: false },
  { id: "T14", ac: "AC4", desc: "630–690 with no bookings", start: 630, end: 690, bookings: [], expected: true },
  {
    id: "X2",
    ac: "AC4",
    desc: "690–750 clear of 1st booking, overlaps 2nd",
    start: 690,
    end: 750,
    bookings: [
      { start: 600, end: 660 },
      { start: 720, end: 780 },
    ],
    expected: false,
  },
];

describe("canBook — reviewed case table (now = 540)", () => {
  it.each(cases)("$id [$ac] $desc → $expected", ({ start, end, blocked, bookings, expected }) => {
    const input = makeInput(start, end, { blocked, bookings });
    expect(decide(input)).toBe(expected);
  });
});

// ---------------------------------------------------------------------------
// AC5 — decision only, booking data unchanged
// ---------------------------------------------------------------------------

describe("canBook — AC5: returns a decision without changing booking data", () => {
  it("AC5: Available request (660–720) returns true and leaves bookings as exactly [600–660]", () => {
    const input = makeInput(660, 720);
    const bookingsRef = input.bookings;

    const result = canBook(input);

    expect(result).toBe(true);
    expect(typeof result).toBe("boolean"); // a clear Available / Unavailable decision
    expect(input.bookings).toBe(bookingsRef);
    expect(input.bookings).toHaveLength(1);
    expect(input.bookings).toStrictEqual([{ start: 600, end: 660 }]);
    expect(input.bookings).not.toContainEqual({ start: 660, end: 720 }); // requested interval not added
  });

  it("AC5: repeated calls give the same decision (no hidden state)", () => {
    const input = makeInput(660, 720);
    expect(decide(input)).toBe(true);
    expect(decide(input)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Open questions — see the "unclear requirements" notes; not asserted yet
// ---------------------------------------------------------------------------

describe("canBook — pending clarification", () => {
  it.todo("AC1: start < 0 with a negative `now` — is `now` guaranteed ≥ 0? (code has no explicit 0 ≤ start check)");
  it.todo("AC1: non-integer minutes (e.g. 600.5) — allowed or rejected?");
  it.todo("AC1: NaN / Infinity start or end — code rejects them, but no AC states it");
  it.todo("AC6: layout at desktop and narrow/mobile width + validation messages — needs a component/e2e test, not canBook");
});
