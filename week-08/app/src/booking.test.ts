// Final suite for canBook (Practice #07).
// Started from the assistant's first suite (suites/first/) and its improvement answer, then
// reviewed against AC1-AC6 and the plan in lab-report.md section 3.
// Rules: one test per case with its ID in the title, exact .toBe(true/false), the real module,
// now passed as a number, a fresh fixture in every test, no mocks, no clock, no test.each.

import { describe, test, expect } from 'vitest';
import { canBook, type CanBookInput, type Interval } from './booking';

// Default fixture: now = 540 (09:00), blocked = false, one booking 600-660 (10:00-11:00).
// Built fresh on every call, so no test can see another test's data.
function input(start: number, end: number, changes: Partial<CanBookInput> = {}): CanBookInput {
  return {
    start,
    end,
    now: 540,
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
    ...changes,
  };
}

// Calls canBook and checks that the booking data is exactly as before the call (AC5).
function decide(req: CanBookInput): boolean {
  const before = structuredClone(req.bookings);
  const result = canBook(req);
  expect(req.bookings).toEqual(before);
  return result;
}

describe('T01-T14: the reviewed case table (now = 540, booking 600-660)', () => {
  test('T01 AC4: 660-720 only touches the end of the booking', () => {
    expect(decide(input(660, 720))).toBe(true);
  });

  test('T02 AC1: 540-570 starts exactly at now', () => {
    expect(decide(input(540, 570))).toBe(false);
  });

  test('T03 AC1: 720-720 has zero duration', () => {
    expect(decide(input(720, 720))).toBe(false);
  });

  test('T04 AC1: 750-720 is reversed', () => {
    expect(decide(input(750, 720))).toBe(false);
  });

  test('T05 AC1: 1380-1441 ends past the end of the day', () => {
    expect(decide(input(1380, 1441))).toBe(false);
  });

  test('T06 AC2: 720-840 is exactly 120 minutes', () => {
    expect(decide(input(720, 840))).toBe(true);
  });

  test('T07 AC2: 720-841 is 121 minutes', () => {
    expect(decide(input(720, 841))).toBe(false);
  });

  test('T08 AC4: 570-600 only touches the start of the booking', () => {
    expect(decide(input(570, 600))).toBe(true);
  });

  test('T09 AC4: 630-690 partly overlaps the booking', () => {
    expect(decide(input(630, 690))).toBe(false);
  });

  test('T10 AC4: 570-690 contains the whole booking', () => {
    expect(decide(input(570, 690))).toBe(false);
  });

  test('T11 AC4: 615-645 lies inside the booking', () => {
    expect(decide(input(615, 645))).toBe(false);
  });

  test('T12 AC4: 600-660 is identical to the booking', () => {
    expect(decide(input(600, 660))).toBe(false);
  });

  test('T13 AC3: 660-720 in a blocked room', () => {
    expect(decide(input(660, 720, { blocked: true }))).toBe(false);
  });

  test('T14 AC4: 630-690 with no existing bookings', () => {
    expect(decide(input(630, 690, { bookings: [] }))).toBe(true);
  });
});

describe('AC5: a decision without changing the booking data', () => {
  test('AC5: an Available request (660-720) leaves the bookings exactly as before', () => {
    const bookings: Interval[] = [{ start: 600, end: 660 }];
    const before = structuredClone(bookings);

    const result = canBook({ start: 660, end: 720, now: 540, blocked: false, bookings });

    expect(result).toBe(true);
    expect(bookings).toEqual(before);
    expect(JSON.stringify(bookings)).toBe(JSON.stringify(before));
  });

  test('AC5: an Unavailable request (630-690) does not remove or edit the conflicting booking', () => {
    const bookings: Interval[] = [{ start: 600, end: 660 }];
    const before = structuredClone(bookings);

    const result = canBook({ start: 630, end: 690, now: 540, blocked: false, bookings });

    expect(result).toBe(false);
    expect(bookings).toEqual(before);
  });

  test('AC5: frozen, unsorted bookings are never changed in place, on either outcome', () => {
    const frozen = (): Interval[] =>
      Object.freeze([
        Object.freeze({ start: 720, end: 780 }),
        Object.freeze({ start: 600, end: 660 }),
      ]) as Interval[];

    expect(canBook(input(660, 720, { bookings: frozen() }))).toBe(true);
    expect(canBook(input(630, 690, { bookings: frozen() }))).toBe(false);
  });
});

describe('X1, X2: my own cases from the plan', () => {
  test('X1 AC1 AC2: 1320-1440 ends exactly at 24:00 and lasts exactly 120 minutes', () => {
    expect(decide(input(1320, 1440))).toBe(true);
  });

  test('X2 AC4: 690-750 is clear of 600-660 but overlaps the second booking 720-780', () => {
    const bookings = [
      { start: 600, end: 660 },
      { start: 720, end: 780 },
    ];
    expect(decide(input(690, 750, { bookings }))).toBe(false);
  });
});

describe('B1-B11: boundaries added in the review', () => {
  test('B1 AC1: 541-570 starts one minute after now', () => {
    expect(decide(input(541, 570))).toBe(true);
  });

  test('B2 AC1: 720-721 is a one-minute booking', () => {
    expect(decide(input(720, 721))).toBe(true);
  });

  test('B3 AC1: 1380-1440 ends exactly at 24:00 (60 minutes)', () => {
    expect(decide(input(1380, 1440))).toBe(true);
  });

  test('B4 AC1: -10 to 30 with now = -30 starts before 0', () => {
    expect(decide(input(-10, 30, { now: -30 }))).toBe(false);
  });

  test('B5 AC1: 0-60 with now = -1 starts exactly at 0', () => {
    expect(decide(input(0, 60, { now: -1 }))).toBe(true);
  });

  test('B7 AC4: 660-720 fills the gap and touches two bookings', () => {
    const bookings = [
      { start: 600, end: 660 },
      { start: 720, end: 780 },
    ];
    expect(decide(input(660, 720, { bookings }))).toBe(true);
  });

  test('B8 AC4: 630-690 overlaps the second of two unsorted bookings', () => {
    const bookings = [
      { start: 720, end: 780 },
      { start: 600, end: 660 },
    ];
    expect(decide(input(630, 690, { bookings }))).toBe(false);
  });

  test('B9 AC1: 660-720 with now = 660 uses the supplied now', () => {
    expect(decide(input(660, 720, { now: 660 }))).toBe(false);
  });

  test('B10 AC1: a NaN start is not a valid interval', () => {
    expect(decide(input(Number.NaN, 720))).toBe(false);
  });

  test('B11 AC1: an Infinity end is past 1440', () => {
    expect(decide(input(720, Number.POSITIVE_INFINITY))).toBe(false);
  });
});

describe('BUG-A, BUG-B: regression tests for the provided canBook', () => {
  test('BUG-A AC4: 660-690 touches 600-660 and 690-750 on both sides and is Available', () => {
    const bookings: Interval[] = [
      { start: 600, end: 660 },
      { start: 690, end: 750 },
    ];
    expect(canBook(input(660, 690, { bookings }))).toBe(true);
  });

  test('BUG-B AC5: 720-780 touches nothing, is Available and leaves the bookings unchanged', () => {
    const bookings: Interval[] = [{ start: 600, end: 660 }];
    const before = structuredClone(bookings);
    const result = canBook(input(720, 780, { bookings }));
    expect(result).toBe(true);
    expect(bookings).toEqual(before);
  });
});