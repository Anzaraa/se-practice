# Week 08 — Lab report

**Name:** Anzara Nurbek
**Group:** SE-Monday, 16:00-19:00
**Date:** 2026-11-11

---

## 1. Setup

| | |
| --- | --- |
| Assistant I debugged with (tool) | Claude |
| Exact model (with its version, or `not displayed`) | Claude Opus 5.5 |
| Where the skill was installed (ChatGPT / Claude web / Claude Code / prompt-only simulation) | |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer |
| Vitest version (the `RUN  v…` line of a run) | v3.2.7 |
| Language of my booking module (`ts` or `js`) — the file I copied from `buggy/` | ts |

---

## 2. Task 1 — baseline, buggy code, failing tests

### 2.1 My Week 07 suite on my own code

The **real** output of your Week 07 suite, run in `week-08/app/` **before** you replace
anything. It should be green. If it is not, say why under the block.

```text
 RUN  v3.2.7 C:/Users/Huawei/se-practice/week-08/app

 ✓ src/booking.test.ts (29 tests) 3ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T01 AC4: 660-720 only touches the end of the booking 1ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T02 AC1: 540-570 starts exactly at now 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T03 AC1: 720-720 has zero duration 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T04 AC1: 750-720 is reversed 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T05 AC1: 1380-1441 ends past the end of the day 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T06 AC2: 720-840 is exactly 120 minutes 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T07 AC2: 720-841 is 121 minutes 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T08 AC4: 570-600 only touches the start of the booking 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T09 AC4: 630-690 partly overlaps the booking 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T10 AC4: 570-690 contains the whole booking 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T11 AC4: 615-645 lies inside the booking 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T12 AC4: 600-660 is identical to the booking 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T13 AC3: 660-720 in a blocked room 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T14 AC4: 630-690 with no existing bookings 0ms
   ✓ AC5: a decision without changing the booking data > AC5: an Available request (660-720) leaves the bookings exactly as before 0ms
   ✓ AC5: a decision without changing the booking data > AC5: an Unavailable request (630-690) does not remove or edit the conflicting booking 0ms
   ✓ AC5: a decision without changing the booking data > AC5: frozen, unsorted bookings are never changed in place, on either outcome 0ms
   ✓ X1, X2: my own cases from the plan > X1 AC1 AC2: 1320-1440 ends exactly at 24:00 and lasts exactly 120 minutes 0ms
   ✓ X1, X2: my own cases from the plan > X2 AC4: 690-750 is clear of 600-660 but overlaps the second booking 720-780 0ms
   ✓ B1-B11: boundaries added in the review > B1 AC1: 541-570 starts one minute after now 0ms
   ✓ B1-B11: boundaries added in the review > B2 AC1: 720-721 is a one-minute booking 0ms
   ✓ B1-B11: boundaries added in the review > B3 AC1: 1380-1440 ends exactly at 24:00 (60 minutes) 0ms
   ✓ B1-B11: boundaries added in the review > B4 AC1: -10 to 30 with now = -30 starts before 0 0ms
   ✓ B1-B11: boundaries added in the review > B5 AC1: 0-60 with now = -1 starts exactly at 0 0ms
   ✓ B1-B11: boundaries added in the review > B7 AC4: 660-720 fills the gap and touches two bookings 0ms
   ✓ B1-B11: boundaries added in the review > B8 AC4: 630-690 overlaps the second of two unsorted bookings 0ms
   ✓ B1-B11: boundaries added in the review > B9 AC1: 660-720 with now = 660 uses the supplied now 0ms
   ✓ B1-B11: boundaries added in the review > B10 AC1: a NaN start is not a valid interval 0ms
   ✓ B1-B11: boundaries added in the review > B11 AC1: an Infinity end is past 1440 0ms

 Test Files  1 passed (1)
      Tests  29 passed (29)
   Start at  14:25:46
   Duration  732ms (transform 47ms, setup 0ms, collect 68ms, tests 3ms, environment 0ms, prepare 141ms)
   ```

### 2.2 The same suite on the provided canBook

You copied the whole `canBook` function from `buggy/booking.ts` (or `.js`) over yours and changed
nothing else. This is the real output:

```text
 RUN  v3.2.7 C:/Users/Huawei/se-practice/week-08/app

 ❯ src/booking.test.ts (29 tests | 12 failed) 11ms
   × T01-T14: the reviewed case table (now = 540, booking 600-660) > T01 AC4: 660-720 only touches the end of the booking 4ms
     → expected false to be true // Object.is equality
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T02 AC1: 540-570 starts exactly at now 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T03 AC1: 720-720 has zero duration 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T04 AC1: 750-720 is reversed 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T05 AC1: 1380-1441 ends past the end of the day 0ms
   × T01-T14: the reviewed case table (now = 540, booking 600-660) > T06 AC2: 720-840 is exactly 120 minutes 1ms
     → expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T07 AC2: 720-841 is 121 minutes 0ms
   × T01-T14: the reviewed case table (now = 540, booking 600-660) > T08 AC4: 570-600 only touches the start of the booking 0ms
     → expected false to be true // Object.is equality
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T09 AC4: 630-690 partly overlaps the booking 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T10 AC4: 570-690 contains the whole booking 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T11 AC4: 615-645 lies inside the booking 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T12 AC4: 600-660 is identical to the booking 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T13 AC3: 660-720 in a blocked room 0ms
   × T01-T14: the reviewed case table (now = 540, booking 600-660) > T14 AC4: 630-690 with no existing bookings 0ms
     → expected [ { start: 630, end: 690 } ] to deeply equal []
   × AC5: a decision without changing the booking data > AC5: an Available request (660-720) leaves the bookings exactly as before 0ms
     → expected false to be true // Object.is equality
   ✓ AC5: a decision without changing the booking data > AC5: an Unavailable request (630-690) does not remove or edit the conflicting booking 0ms
   × AC5: a decision without changing the booking data > AC5: frozen, unsorted bookings are never changed in place, on either outcome 0ms
     → expected false to be true // Object.is equality
   × X1, X2: my own cases from the plan > X1 AC1 AC2: 1320-1440 ends exactly at 24:00 and lasts exactly 120 minutes 0ms
     → expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]
   ✓ X1, X2: my own cases from the plan > X2 AC4: 690-750 is clear of 600-660 but overlaps the second booking 720-780 0ms
   × B1-B11: boundaries added in the review > B1 AC1: 541-570 starts one minute after now 0ms
     → expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]
   × B1-B11: boundaries added in the review > B2 AC1: 720-721 is a one-minute booking 0ms
     → expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]
   × B1-B11: boundaries added in the review > B3 AC1: 1380-1440 ends exactly at 24:00 (60 minutes) 0ms
     → expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]
   ✓ B1-B11: boundaries added in the review > B4 AC1: -10 to 30 with now = -30 starts before 0 0ms
   × B1-B11: boundaries added in the review > B5 AC1: 0-60 with now = -1 starts exactly at 0 0ms
     → expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]
   × B1-B11: boundaries added in the review > B7 AC4: 660-720 fills the gap and touches two bookings 0ms
     → expected false to be true // Object.is equality
   ✓ B1-B11: boundaries added in the review > B8 AC4: 630-690 overlaps the second of two unsorted bookings 0ms
   ✓ B1-B11: boundaries added in the review > B9 AC1: 660-720 with now = 660 uses the supplied now 0ms
   ✓ B1-B11: boundaries added in the review > B10 AC1: a NaN start is not a valid interval 0ms
   ✓ B1-B11: boundaries added in the review > B11 AC1: an Infinity end is past 1440 0ms

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 12 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > T01-T14: the reviewed case table (now = 540, booking 600-660) > T01 AC4: 660-720 only touches the end of the booking
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:33:37
     31| describe('T01-T14: the reviewed case table…
     32|   test('T01 AC4: 660-720 only touches the …
     33|     expect(decide(input(660, 720))).toBe(t…
       |                                     ^
     34|   });
     35| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/12]⎯

 FAIL  src/booking.test.ts > T01-T14: the reviewed case table (now = 540, booking 600-660) > T06 AC2: 720-840 is exactly 120 minutes
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  [
    {
      "end": 660,
      "start": 600,
    },
+   {
+     "end": 840,
+     "start": 720,
+   },
  ]

 ❯ decide src/booking.test.ts:27:24
     25|   const before = structuredClone(req.booki…
     26|   const result = canBook(req);
     27|   expect(req.bookings).toEqual(before);
       |                        ^
     28|   return result;
     29| }
 ❯ src/booking.test.ts:53:12

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/12]⎯

 FAIL  src/booking.test.ts > T01-T14: the reviewed case table (now = 540, booking 600-660) > T08 AC4: 570-600 only touches the start of the booking
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:61:37
     59| 
     60|   test('T08 AC4: 570-600 only touches the …
     61|     expect(decide(input(570, 600))).toBe(t…
       |                                     ^
     62|   });
     63| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/12]⎯

 FAIL  src/booking.test.ts > T01-T14: the reviewed case table (now = 540, booking 600-660) > T14 AC4: 630-690 with no existing bookings
AssertionError: expected [ { start: 630, end: 690 } ] to deeply equal []

- Expected
+ Received

- []
+ [
+   {
+     "end": 690,
+     "start": 630,
+   },
+ ]

 ❯ decide src/booking.test.ts:27:24
     25|   const before = structuredClone(req.booki…
     26|   const result = canBook(req);
     27|   expect(req.bookings).toEqual(before);
       |                        ^
     28|   return result;
     29| }
 ❯ src/booking.test.ts:85:12

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/12]⎯

 FAIL  src/booking.test.ts > AC5: a decision without changing the booking data > AC5: an Available request (660-720) leaves the bookings exactly as before
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:96:20
     94|     const result = canBook({ start: 660, e…
     95| 
     96|     expect(result).toBe(true);
       |                    ^
     97|     expect(bookings).toEqual(before);
     98|     expect(JSON.stringify(bookings)).toBe(…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/12]⎯

 FAIL  src/booking.test.ts > AC5: a decision without changing the booking data > AC5: frozen, unsorted bookings are never changed in place, on either outcome
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:118:62
    116|       ]) as Interval[];
    117| 
    118|     expect(canBook(input(660, 720, { booki…
       |                                                              ^
    119|     expect(canBook(input(630, 690, { booki…
    120|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/12]⎯

 FAIL  src/booking.test.ts > X1, X2: my own cases from the plan > X1 AC1 AC2: 1320-1440 ends exactly at 24:00 and lasts exactly 120 minutes
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  [
    {
      "end": 660,
      "start": 600,
    },
+   {
+     "end": 1440,
+     "start": 1320,
+   },
  ]

 ❯ decide src/booking.test.ts:27:24
     25|   const before = structuredClone(req.booki…
     26|   const result = canBook(req);
     27|   expect(req.bookings).toEqual(before);
       |                        ^
     28|   return result;
     29| }
 ❯ src/booking.test.ts:125:12

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/12]⎯

 FAIL  src/booking.test.ts > B1-B11: boundaries added in the review > B1 AC1: 541-570 starts one minute after now
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  [
    {
      "end": 660,
      "start": 600,
    },
+   {
+     "end": 570,
+     "start": 541,
+   },
  ]

 ❯ decide src/booking.test.ts:27:24
     25|   const before = structuredClone(req.booki…
     26|   const result = canBook(req);
     27|   expect(req.bookings).toEqual(before);
       |                        ^
     28|   return result;
     29| }
 ❯ src/booking.test.ts:139:12

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/12]⎯

 FAIL  src/booking.test.ts > B1-B11: boundaries added in the review > B2 AC1: 720-721 is a one-minute booking
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  [
    {
      "end": 660,
      "start": 600,
    },
+   {
+     "end": 721,
+     "start": 720,
+   },
  ]

 ❯ decide src/booking.test.ts:27:24
     25|   const before = structuredClone(req.booki…
     26|   const result = canBook(req);
     27|   expect(req.bookings).toEqual(before);
       |                        ^
     28|   return result;
     29| }
 ❯ src/booking.test.ts:143:12

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/12]⎯

 FAIL  src/booking.test.ts > B1-B11: boundaries added in the review > B3 AC1: 1380-1440 ends exactly at 24:00 (60 minutes)
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  [
    {
      "end": 660,
      "start": 600,
    },
+   {
+     "end": 1440,
+     "start": 1380,
+   },
  ]

 ❯ decide src/booking.test.ts:27:24
     25|   const before = structuredClone(req.booki…
     26|   const result = canBook(req);
     27|   expect(req.bookings).toEqual(before);
       |                        ^
     28|   return result;
     29| }
 ❯ src/booking.test.ts:147:12

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/12]⎯

 FAIL  src/booking.test.ts > B1-B11: boundaries added in the review > B5 AC1: 0-60 with now = -1 starts exactly at 0
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  [
    {
      "end": 660,
      "start": 600,
    },
+   {
+     "end": 60,
+     "start": 0,
+   },
  ]

 ❯ decide src/booking.test.ts:27:24
     25|   const before = structuredClone(req.booki…
     26|   const result = canBook(req);
     27|   expect(req.bookings).toEqual(before);
       |                        ^
     28|   return result;
     29| }
 ❯ src/booking.test.ts:155:12

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/12]⎯

 FAIL  src/booking.test.ts > B1-B11: boundaries added in the review > B7 AC4: 660-720 fills the gap and touches two bookings
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:163:51
    161|       { start: 720, end: 780 },
    162|     ];
    163|     expect(decide(input(660, 720, { bookin…
       |                                                   ^
    164|   });
    165| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[12/12]⎯


 Test Files  1 failed (1)
      Tests  12 failed | 17 passed (29)
   Start at  14:33:27
   ```

### 2.3 One failing test per bug

Add the two regression tests from README Part 1, step 5: one named `BUG-A` and one named `BUG-B`.
Run them **on the buggy code**. Both must fail here. That is the evidence that each test can see
its bug.

```text
(paste here)
```

---

## 3. Defect log

One row per defect. At least **BUG-A and BUG-B**. "Suspected cause" is your hypothesis
**before** you ask any assistant: the line and why.

| Defect | Test ID | Input | Expected | Actual | Suspected cause (line and why) |
| --- | --- | --- | --- | --- | --- |
| BUG-A | | | | | |
| BUG-B | | | | | |

---

## 4. Tasks 2–3 — the skill

**The checks from the deck, before you zip it.** Answer each one yes / no:

| Check | yes / no |
| --- | --- |
| The file is plain UTF-8 text, named exactly `SKILL.md` (not `SKILL.md.txt`) | yes / no |
| The first and the closing YAML delimiter are exactly three hyphens: `---` | yes / no |
| `name` is lowercase with hyphens, and `description` says WHEN to use it | yes / no |
| I read the whole file once: no passwords, API keys or private student data | yes / no |

**The contents of `skills/bug-detector.zip`.** Paste the listing (Windows: open the ZIP and copy
the paths; macOS/Linux: `unzip -l skills/bug-detector.zip`):

```text
(paste here)
```

**Installation.** Where you uploaded it, what the upload said, and whether a new chat showed the
skill as enabled. If upload was not available, write `prompt-only simulation` and say why.
Screenshot of the result: `evidence/install.png`.

<!-- Write below this line -->

---

## 5. Task 4 — without the skill

A **fresh chat, with no skill enabled**. Paste exactly what you sent: the deck's question, then
the same input you will use in section 6 (AC1–AC6, the failing test output, the code of
`canBook`):

```text
(paste here)
```

**The assistant's answer, pasted unedited:**

```text
(paste here)
```

---

## 6. Task 5 — with the skill

**Another fresh chat, with `bug-detector` enabled.** Send exactly the same input as in section 5.
Only the question changes, to the deck's skill question:

```text
(paste here)
```

**The assistant's answer, pasted unedited:**

```text
(paste here)
```

Did the environment show that the skill was invoked? yes / no / not shown

---

## 7. Comparison — judged against the actual code

Do not assume the skill did better. Judge both answers against the code and against what your
tests showed. Write a short verdict in each cell, and give a reason where they differ.

| Criterion | No skill | With skill |
| --- | --- | --- |
| Correct root cause | | |
| Reproducible test | | |
| Minimal proposed patch | | |
| Unsupported claims | | |
| Clarity of explanation | | |

**Which bugs did each answer find?** (BUG-A, BUG-B, both, neither)

-

---

## 8. Task 6 — repair and regression

Review the proposed patch yourself, then make **one minimal change per bug**, one commit each.
Rerun the test that was failing, then the full suite.

### 8.1 The BUG-A patch

The change as a diff (`git diff`, or the old and the new line), then the real run:

```text
(paste here)
```

### 8.2 The BUG-B patch and the final run

The change as a diff, then the real output of the **full** suite. Every test must pass.

```text
(paste here)
```

---

## 9. What still fails, and what AI-assisted debugging cannot do

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 One limitation of AI-assisted debugging

<!-- Use something that actually happened in sections 5-8. 20 words or more. -->
-

---

## 10. Conclusion (80–150 words)

<!-- Answer both, in your own words, without the assistant (3-5 sentences, as the deck asks):
     (a) Did the skill help? Show it with one row of section 7.
     (b) What did your tests actually prove - and what did they not?
     Worthless: "The skill made the AI much better at debugging."
     Worth everything: "Both answers found BUG-A from the T01 failure. Only the skill answer
     separated BUG-B as a hypothesis instead of a fact, because step 4 told it to. BUG-B was only
     visible after the BUG-A patch: the AC5 test had been failing for the wrong reason." -->

<!-- Write your conclusion below this line -->
