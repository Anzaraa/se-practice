# Week 07 — Lab report

**Name:** Anzara Nurbek
**Group:** SE-Monday, 16:00-19:00
**Date:** 04-11-2026
---

## 1. Setup

| | |
| --- | --- |
| Project I continue (`week-06` = my Week 06 Bolt project, `starter` = the provided starter) |  week-06 |
| Bolt project link (or `not shared`, and why) | https://bolt.new/~/sb1-andhqeqd |
| Assistant that generated the tests (tool) | Claude |
| Exact model (with its version, or `not displayed`) | Claude Opus 5.5 |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer |
| Vitest version (the `RUN  v…` line of a run) | 3.2.7 |
| Test command | npx vitest run |

---

## 2. Task 1 — baseline and the booking function

**Before editing:** where did the booking decision live in the project you started from?

| | |
| --- | --- |
| File and function (or "inside the page component") | src/availability.ts, checkAvailability() |
| Its inputs | roomId, start, end, currentTime, rooms, bookings |
| What it returned | { kind: "available" } or { kind: "unavailable", reasons: [...] } |
| How the page used it | App.tsx called it inside useMemo on every input change and passed the result to VerdictPanel, which showed Available or Unavailable with the reasons |

**What I changed to extract `canBook`.** Say which file it now lives in, what you moved, and why
the behaviour did not change. Also say which file of the page now calls it. 40 words or more.

The booking decision now lives in a separate function, canBook(), in src/booking.ts. It takes one object, { start, end, now, blocked, bookings }. The page finds the room itself, passes room.blocked and only that room’s bookings, and passes currentTime as now. If the room does not exist, App.tsx decides on its own (if (!room) return details;), so canBook() does not check for that.

I moved these conditions:

start and end must be numbers.
start must be before end.
start must not be in the past relative to now.
end must be no later than 1440 (AC1).
The duration must be at most 120 minutes (AC2).
The room must not be blocked (AC3).
The interval must not overlap an existing booking.

In the original, the overlap check ran only when start >= 0. That condition looks suspicious, but I kept it exactly as it was, because the task is to copy the logic without fixing it.

Behaviour did not change because I moved the conditions without rewriting them. canBook() returns true in exactly the cases where checkAvailability() used to return { kind: "available" }. I checked this in the browser with the same intervals as before: 11:00–12:00 is still Available, and 10:30–11:30 and 11:00–13:30 are still Unavailable.

App.tsx now imports canBook() and uses its result to decide between Available and Unavailable. The user-facing messages still come from checkAvailability(), which builds the list of reasons that VerdictPanel displays, so the text the user sees is the same as before.
---

## 3. Task 2 — the test plan

Default fixture: `now = 540`, `blocked = false`, `bookings = [{ start: 600, end: 660 }]`, fresh
for every test. **The Expected column comes from AC1–AC4, never from the code.** Write the
**reason** for each expected result **before** you send the generation prompt.

| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 | 660 is excluded from 600–660, so the intervals only touch; start 660 > now 540; duration 60 |
| T02 | 540–570 (starts now) | false | AC1 | start 540 is not later than now 540; a booking that starts at the current minute is already too late |
| T03 | 720–720 (zero duration) | false | AC1 | start 720 is not before end 720, so the duration is 720 − 720 = 0 minutes |
| T04 | 750–720 (reversed) | false | AC1 | start 750 > end 720, so the duration is 720 − 750 = −30 minutes |
| T05 | 1380–1441 (past day end) | false | AC1 | end 1441 > 1440, so the booking runs one minute past midnight |
| T06 | 720–840 (120 minutes) | true | AC2 | duration 840 − 720 = 120 ≤ 120, so it is exactly at the limit; 720 ≥ 660, so no overlap |
| T07 | 720–841 (121 minutes) | false | AC2 | duration 841 − 720 = 121 > 120, one minute over the limit |
| T08 | 570–600 (touching before) | true | AC4 | end 600 is excluded from 570–600, so it only touches the booking that starts at 600; start 570 > now 540 |
| T09 | 630–690 (partial overlap) | false | AC4 | 630 < 660 and 690 > 600, so 630–660 is shared with the booking |
| T10 | 570–690 (contains booking) | false | AC4 | 570 < 660 and 690 > 600; the whole booking 600–660 lies inside the request |
| T11 | 615–645 (inside booking) | false | AC4 | 615 < 660 and 645 > 600; the whole request lies inside the booking 600–660 |
| T12 | 600–660 (identical interval) | false | AC4 | 600 < 660 and 660 > 600; all 60 minutes are already booked |
| T13 | 660–720, blocked = true | false | AC3 | the times are the same as in T01, which is true, so the only difference is blocked = true, and a blocked room must reject every request, even a valid one |
| T14 | 630–690, bookings = [] | true | AC4 | the same interval as T09 is false with booking 600–660, but with no bookings there is nothing to overlap; start 630 > now 540; duration 60 |
| AC5 | an Available request — the bookings after the call equal the bookings before | true, data unchanged | AC5 | bookings still hold exactly one entry, 600–660, after the call; canBook only returns a decision and does not add the requested interval |
| X1 | 1320–1440 (ends at midnight, 120 minutes) | true | AC1, AC2 | end 1440 ≤ 1440, so ending exactly at midnight is allowed; duration 1440 − 1320 = 120 ≤ 120; 1320 ≥ 660, so no overlap |
| X2 | 690–750, bookings = [600–660, 720–780] | false | AC4 | 690 ≥ 660, so no overlap with the first booking; 690 < 780 and 750 > 720, so it overlaps the second one. The result is false only if every booking is checked |

X1 and X2 are **your own two cases**: a boundary or a state that T01–T14 do not reach. Fill all
five columns.

---

## 4. Task 3 — the generation prompt and the first suite

**The prompt exactly as I sent it.** Use the deck's prompt with `[our test framework]` replaced by
`Vitest`, followed by the case table from section 3:

```text
Generate tests for the existing booking function using Vitest. Use AC1–AC6 and the reviewed case table below.

Import the real function used by the page. Keep its code unchanged. Use fixed time and fresh fixtures. Assert exact decisions and unchanged booking data.

Return the test file, run command, and AC mapping. Flag unclear requirements. We will run the tests ourselves.

Acceptance criteria:
AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time.
AC2: Reject a booking longer than 120 minutes.
AC3: Reject the request when the selected room is blocked.
AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback.

Default fixture: now = 540, blocked = false, bookings = [{ start: 600, end: 660 }], fresh for every test.

| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 | 660 is excluded from 600–660, so the intervals only touch; start 660 > now 540; duration 60 |
| T02 | 540–570 (starts now) | false | AC1 | start 540 is not later than now 540; a booking that starts at the current minute is already too late |
| T03 | 720–720 (zero duration) | false | AC1 | start 720 is not before end 720, so the duration is 720 − 720 = 0 minutes |
| T04 | 750–720 (reversed) | false | AC1 | start 750 > end 720, so the duration is 720 − 750 = −30 minutes |
| T05 | 1380–1441 (past day end) | false | AC1 | end 1441 > 1440, so the booking runs one minute past midnight |
| T06 | 720–840 (120 minutes) | true | AC2 | duration 840 − 720 = 120 ≤ 120, so it is exactly at the limit; 720 ≥ 660, so no overlap |
| T07 | 720–841 (121 minutes) | false | AC2 | duration 841 − 720 = 121 > 120, one minute over the limit |
| T08 | 570–600 (touching before) | true | AC4 | end 600 is excluded from 570–600, so it only touches the booking that starts at 600; start 570 > now 540 |
| T09 | 630–690 (partial overlap) | false | AC4 | 630 < 660 and 690 > 600, so 630–660 is shared with the booking |
| T10 | 570–690 (contains booking) | false | AC4 | 570 < 660 and 690 > 600; the whole booking 600–660 lies inside the request |
| T11 | 615–645 (inside booking) | false | AC4 | 615 < 660 and 645 > 600; the whole request lies inside the booking 600–660 |
| T12 | 600–660 (identical interval) | false | AC4 | 600 < 660 and 660 > 600; all 60 minutes are already booked |
| T13 | 660–720, blocked = true | false | AC3 | the times are the same as in T01, which is true, so the only difference is blocked = true, and a blocked room must reject every request, even a valid one |
| T14 | 630–690, bookings = [] | true | AC4 | the same interval as T09 is false with booking 600–660, but with no bookings there is nothing to overlap; start 630 > now 540; duration 60 |
| AC5 | an Available request — the bookings after the call equal the bookings before | true, data unchanged | AC5 | bookings still hold exactly one entry, 600–660, after the call; canBook only returns a decision and does not add the requested interval |
| X1 | 1320–1440 (ends at midnight, 120 minutes) | true | AC1, AC2 | end 1440 ≤ 1440, so ending exactly at midnight is allowed; duration 1440 − 1320 = 120 ≤ 120; 1320 ≥ 660, so no overlap |
| X2 | 690–750, bookings = [600–660, 720–780] | false | AC4 | 690 ≥ 660, so no overlap with the first booking; 690 < 780 and 750 > 720, so it overlaps the second one. The result is false only if every booking is checked |

The function is in src/booking.ts and the page imports it with: import { canBook } from "./booking";


```typescript
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
``````

**The assistant's answer: run command, AC mapping and any unclear requirements it flagged,
pasted unedited.** Its test file goes to `suites/first/` and is not pasted here:

```text
Run command

bash
npm i -D vitest          # only if Vitest isn't installed yet
npx vitest run src/booking.test.ts

It needs Node 17+ for structuredClone.

How the requirements are met

Fixed time: now = 540 is passed to every call. The system clock is also pinned with vi.setSystemTime, so the run stays deterministic.
Fresh fixtures: makeInput() builds new bookings for each test and deep-freezes them. If canBook tried to mutate the bookings, the test would throw.
Exact decisions: every assertion uses toBe(true) or toBe(false).
Unchanged data: every call goes through decide(). It checks that the bookings are the same array and that the contents still strictly equal a snapshot taken before the call.

AC mapping

AC	Tests
AC1	T02, T03, T04, T05, X1
AC2	T06, T07, X1
AC3	T13
AC4	T01, T08, T09, T10, T11, T12, T14, X2
AC5	The two AC5 tests, plus the unchanged-data check on all 16 table cases
AC6	Not covered (see below)

Unclear requirements (these are kept as it.todo in the file, so they show up in the test report)

0 ≤ start is not checked directly. AC1 requires 0 ≤ start, but the code only enforces start > now. The rule holds only if now is always ≥ 0.
If now can be negative, a negative start would be accepted.
A negative start also skips the overlap check, because the loop only runs when start >= 0.
Please confirm that now ≥ 0 is guaranteed.
Non-finite values. The code rejects NaN and Infinity for start and end, but no acceptance criterion says it should. Should this become a stated rule?
Fractional minutes. It isn’t specified whether a value like 600.5 is valid input.
AC5 is only partly testable here. These unit tests prove that canBook returns a boolean and leaves the bookings unchanged. Whether the page shows a clear “Available” or “Unavailable” label needs a component test.
AC6 is UI-only. Responsive layout and validation messages can’t be tested through canBook. They need component or e2e tests, for example Testing Library, or Playwright at a desktop width and a mobile width.
```

The first suite was saved to `suites/first/` **before** I changed anything in it: yes

---

## 5. Task 4 — review of the first suite

Review it **before** you run it. Look at the imports, the expected values, isolation, duplicates
and skipped tests. Make one row per decision. At least **two** rows, and each one names the kind of
weakness (the deck's table: *no exception occurred* · *expected = current output* · *only valid
requests* · *mocked booking function*, or your own) and the AC that decides it.

| # | Test or part of the suite | What is weak or wrong | Decision: accept / revise / reject | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | `it.each(cases)` — T01–T14, X1, X2 in one table-driven test | Own weakness: table-driven. All 16 cases share one test body, so no case has its own named test with its ID in the title; the lab forbids `test.each` | revise — split into one `test('T05 AC1: …')` per case, same inputs and expected values | AC1–AC4; lab rule "one test per case, no test.each" |
| 2 | `beforeEach` with `vi.useFakeTimers()` and `vi.setSystemTime(new Date(...))` | Own weakness: reads the clock. `canBook` never reads the clock, `now` is passed as the number 540, so the fake clock tests nothing and adds `new Date()` that the rules forbid | reject — remove the timer setup, keep `now = 540` as a plain number | AC1 (`now` is supplied); lab rule "fixed time, no Date" |
| 3 | Four `it.todo(...)` tests | Own weakness: skipped tests. They assert nothing, but show up in the report and look like coverage | reject — remove; move the open questions (0 ≤ start, NaN, fractions, AC6) to the report §9 | AC1, AC6; lab rule "no skipped tests" |
| 4 | Expected values of all 16 table cases | Checked against my plan §3: every expected value matches AC1–AC4. None is "expected = current output" | accept | AC1–AC4 |
| 5 | `decide()` helper — snapshot + frozen bookings checked in every case; AC5 test on 660–720 | Strong, not weak: an Available request is checked against a copy taken before the call, and freezing makes any mutation throw | accept | AC5 |
| 6 | Flagged requirement "0 ≤ start is not checked directly" | Correct finding: `canBook` has no `start >= 0` check; it holds only while `now ≥ 0` | accept as a finding — add a test X-style later if needed, discuss in §9 | AC1 |

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited. Include the
`RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass"
is not a run.

```text
 RUN  v3.2.7 C:/Users/Huawei/se-practice/week-07/app

 ✓ src/booking.test.ts (22 tests | 4 skipped) 6ms
   ✓ canBook — reviewed case table (now = 540) > 'T02' ['AC1'] '540–570 starts exactly at now' → false 3ms
   ✓ canBook — reviewed case table (now = 540) > 'T03' ['AC1'] '720–720 zero duration' → false 0ms
   ✓ canBook — reviewed case table (now = 540) > 'T04' ['AC1'] '750–720 reversed interval' → false 0ms
   ✓ canBook — reviewed case table (now = 540) > 'T05' ['AC1'] '1380–1441 ends past day end' → false 0ms
   ✓ canBook — reviewed case table (now = 540) > 'X1' ['AC1, AC2'] '1320–1440 ends at midnight, 120 min' → true 0ms
   ✓ canBook — reviewed case table (now = 540) > 'T06' ['AC2'] '720–840 exactly 120 min' → true 0ms
   ✓ canBook — reviewed case table (now = 540) > 'T07' ['AC2'] '720–841 is 121 min' → false 0ms
   ✓ canBook — reviewed case table (now = 540) > 'T13' ['AC3'] '660–720 (valid as in T01) but room bl…' → false 0ms
   ✓ canBook — reviewed case table (now = 540) > 'T01' ['AC4'] '660–720 touches booking end' → true 0ms
   ✓ canBook — reviewed case table (now = 540) > 'T08' ['AC4'] '570–600 touches booking start' → true 0ms
   ✓ canBook — reviewed case table (now = 540) > 'T09' ['AC4'] '630–690 partial overlap' → false 0ms
   ✓ canBook — reviewed case table (now = 540) > 'T10' ['AC4'] '570–690 contains booking' → false 0ms
   ✓ canBook — reviewed case table (now = 540) > 'T11' ['AC4'] '615–645 inside booking' → false 0ms
   ✓ canBook — reviewed case table (now = 540) > 'T12' ['AC4'] '600–660 identical to booking' → false 0ms
   ✓ canBook — reviewed case table (now = 540) > 'T14' ['AC4'] '630–690 with no bookings' → true 0ms
   ✓ canBook — reviewed case table (now = 540) > 'X2' ['AC4'] '690–750 clear of 1st booking, overlap…' → false 0ms
   ✓ canBook — AC5: returns a decision without changing booking data > AC5: Available request (660–720) returns true and leaves bookings as exactly [600–660] 0ms
   ✓ canBook — AC5: returns a decision without changing booking data > AC5: repeated calls give the same decision (no hidden state) 0ms
   ↓ canBook — pending clarification > AC1: start < 0 with a negative `now` — is `now` guaranteed ≥ 0? (code has no explicit 0 ≤ start check)
   ↓ canBook — pending clarification > AC1: non-integer minutes (e.g. 600.5) — allowed or rejected?
   ↓ canBook — pending clarification > AC1: NaN / Infinity start or end — code rejects them, but no AC states it
   ↓ canBook — pending clarification > AC6: layout at desktop and narrow/mobile width + validation messages — needs a component/e2e test, not canBook

 Test Files  1 passed (1)
      Tests  18 passed | 4 todo (22)
   Start at  16:29:52
   Duration  729ms (transform 26ms, setup 0ms, collect 55ms, tests 6ms, environment 0ms, prepare 341ms)
   ```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| none | no test failed: 18 passed, 4 todo | — | — | — |
| 4 × it.todo (pending clarification) | not a failure: reported as todo, they assert nothing | test file: it.todo instead of real tests | test repair | removed in the final suite, open questions moved to §9 (see §5 rows 3 and 6) |

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

```text
Review this test suite against AC1–AC6 and our case table. Identify incorrect expectations, weak assertions, duplicated cases, and missing boundaries.

For each proposed change, explain the requirement and the defect it could detect. Improve the tests without changing correct expectations to match buggy behavior.

Use the actual failure output below. Separate test repairs from implementation fixes.

 RUN  v3.2.7 C:/Users/Huawei/se-practice/week-07/app

 ✓ src/booking.test.ts (22 tests | 4 skipped) 6ms
   ✓ canBook — reviewed case table (now = 540) > 'T02' ['AC1'] '540–570 starts exactly at now' → false 3ms
   ✓ canBook — reviewed case table (now = 540) > 'T03' ['AC1'] '720–720 zero duration' → false 0ms
   ✓ canBook — reviewed case table (now = 540) > 'T04' ['AC1'] '750–720 reversed interval' → false 0ms
   ✓ canBook — reviewed case table (now = 540) > 'T05' ['AC1'] '1380–1441 ends past day end' → false 0ms
   ✓ canBook — reviewed case table (now = 540) > 'X1' ['AC1, AC2'] '1320–1440 ends at midnight, 120 min' → true 0ms
   ✓ canBook — reviewed case table (now = 540) > 'T06' ['AC2'] '720–840 exactly 120 min' → true 0ms
   ✓ canBook — reviewed case table (now = 540) > 'T07' ['AC2'] '720–841 is 121 min' → false 0ms
   ✓ canBook — reviewed case table (now = 540) > 'T13' ['AC3'] '660–720 (valid as in T01) but room bl…' → false 0ms
   ✓ canBook — reviewed case table (now = 540) > 'T01' ['AC4'] '660–720 touches booking end' → true 0ms
   ✓ canBook — reviewed case table (now = 540) > 'T08' ['AC4'] '570–600 touches booking start' → true 0ms
   ✓ canBook — reviewed case table (now = 540) > 'T09' ['AC4'] '630–690 partial overlap' → false 0ms
   ✓ canBook — reviewed case table (now = 540) > 'T10' ['AC4'] '570–690 contains booking' → false 0ms
   ✓ canBook — reviewed case table (now = 540) > 'T11' ['AC4'] '615–645 inside booking' → false 0ms
   ✓ canBook — reviewed case table (now = 540) > 'T12' ['AC4'] '600–660 identical to booking' → false 0ms
   ✓ canBook — reviewed case table (now = 540) > 'T14' ['AC4'] '630–690 with no bookings' → true 0ms
   ✓ canBook — reviewed case table (now = 540) > 'X2' ['AC4'] '690–750 clear of 1st booking, overlap…' → false 0ms
   ✓ canBook — AC5: returns a decision without changing booking data > AC5: Available request (660–720) returns true and leaves bookings as exactly [600–660] 0ms
   ✓ canBook — AC5: returns a decision without changing booking data > AC5: repeated calls give the same decision (no hidden state) 0ms
   ↓ canBook — pending clarification > AC1: start < 0 with a negative `now` — is `now` guaranteed ≥ 0? (code has no explicit 0 ≤ start check)
   ↓ canBook — pending clarification > AC1: non-integer minutes (e.g. 600.5) — allowed or rejected?
   ↓ canBook — pending clarification > AC1: NaN / Infinity start or end — code rejects them, but no AC states it
   ↓ canBook — pending clarification > AC6: layout at desktop and narrow/mobile width + validation messages — needs a component/e2e test, not canBook

 Test Files  1 passed (1)
      Tests  18 passed | 4 todo (22)
```

Assistant's answer (unedited; its new test file is not pasted here):

```text
I'll review the suite against the ACs and the case table, then update the test file. Implementation fixes are kept separate below.

The output you pasted contains no failures: 18 tests passed and 4 are todo. A green run is not evidence that every AC holds, though. No case in the old suite could reach AC1's `0 ≤ start` rule, so it would pass even if that check were missing. The revised **booking.test.ts** fixes the problems below.

## Review findings

**Incorrect expectations: none.** I rechecked every T and X case against AC1–AC4. Each expected value follows from the criteria, and each negative case breaks exactly one rule. None of them were changed.

**Weak assertions**

| Issue | Requirement | Defect the repair detects |
|---|---|---|
| Bookings were frozen before the snapshot check, so `toStrictEqual(snapshot)` could never fail | AC5 | Now `decide()` uses unfrozen data (as the page does) and compares the whole input. This catches a bug that edits `bookings`, `now` or `blocked`. |
| AC5 was tested only on the Available path | AC5 | A new Unavailable test catches code that removes or "fixes" the conflicting booking when it rejects. |
| No test caught a temporary in-place change | AC5 | A frozen, unsorted fixture catches in-place `sort()` or push-then-pop on either outcome. |
| `typeof result === "boolean"` was redundant | — | Removed, since `toBe(true)` already proves it. |
| Nothing proved the supplied `now` is used | AC1 | **B9** (now = 660) catches a hard-coded 540. The pinned clock at 23:30 catches use of `Date.now()`. |
| Test titles printed quoted values (`'T02' ['AC1']`) | — | Titles are now plain strings, which only improves readability. |

**Duplicated cases**
- The "repeated calls give the same decision" test added nothing beyond T01 and was removed.
- T13/T01 and T14/T09 share intervals on purpose. Each pair differs in one input, so I kept them as pairs, not duplicates.
- X1 tests two boundaries at once. If it failed, you couldn't tell whether the `end ≤ 1440` check or the 120-minute check was off by one. **B3** isolates the day-end boundary, T06 already isolates the 120-minute one, and X1 stays as the combined case.

**Missing boundaries**

| ID | Case → expected | Requirement | Defect it detects |
|---|---|---|---|
| B1 | 541–570 → true | AC1 | Over-strict check such as `start <= now + 1` (pairs with T02) |
| B2 | 720–721 → true | AC1 | Rejecting a 1-minute booking (pairs with T03) |
| B3 | 1380–1440 → true | AC1 | `end >= 1440` instead of `>` |
| B4 | now = −30, −10–30 → false | AC1 (0 ≤ start) | No lower-bound check; **fails on the current code** |
| B5 | now = −1, 0–60 → true | AC1 | Over-strict fix such as `start <= 0` |
| B10, B11 | NaN start, Infinity end → false | AC1 ("accept *only* when…") | Loss of the finiteness guard. These were todos before; the "only when" wording settles them. |
| B7 | 660–720 between two bookings → true | AC4 | `<=` on either side when there are several bookings (pairs with X2) |
| B8 | 630–690, unsorted bookings → false | AC4 | Early exit that assumes bookings are sorted |

## Implementation fixes

These are separate from the test repairs. The tests were not adjusted to match the current code.

**Expected next run:** 28 pass, 1 fails, 3 todo. The failure is **B4** with `expected true to be false`. With `now = −30`, a start of −10 counts as "after now", so nothing rejects it. Then the `if (start >= 0)` guard skips the overlap check entirely.

Suggested change to `src/booking.ts`:

```diff
   if (!Number.isFinite(start) || !Number.isFinite(end)) return false;
+  if (start < 0) return false;
   if (end > DAY_END) return false;
   ...
-  if (start >= 0) {
-    for (const b of bookings) {
-      if (start < b.end && end > b.start) return false;
-    }
-  }
+  for (const b of bookings) {
+    if (start < b.end && end > b.start) return false;
+  }
```

The comment in `booking.ts` says these conditions were copied from `checkAvailability()` in `availability.ts`. That function probably has the same gap, so fix both, or make one call the other.

## Still unclear
- **Is `now` guaranteed to be ≥ 0?** Even if it is, B4 and B5 are worth keeping: AC1 states the `0 ≤ start` rule for `canBook` itself.
- **Are fractional minutes such as 600.5 valid input?** The ACs don't say, so this stays a todo.
- **The UI half of AC5 and all of AC6 can't be tested through `canBook`.** These are the "Available" / "Unavailable" label, layout at desktop and mobile width, and validation messages. They need component or e2e tests.
```
Run of the improved suite before the implementation fix:

```text
  RUN  v3.2.7 C:/Users/Huawei/se-practice/week-07/app

 ❯ src/booking.test.ts (29 tests | 1 failed) 8ms
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
   × B1-B11: boundaries added in the review > B4 AC1: -10 to 30 with now = -30 starts before 0 4ms
     → expected true to be false // Object.is equality
   ✓ B1-B11: boundaries added in the review > B5 AC1: 0-60 with now = -1 starts exactly at 0 0ms
   ✓ B1-B11: boundaries added in the review > B7 AC4: 660-720 fills the gap and touches two bookings 0ms
   ✓ B1-B11: boundaries added in the review > B8 AC4: 630-690 overlaps the second of two unsorted bookings 0ms
   ✓ B1-B11: boundaries added in the review > B9 AC1: 660-720 with now = 660 uses the supplied now 0ms
   ✓ B1-B11: boundaries added in the review > B10 AC1: a NaN start is not a valid interval 0ms
   ✓ B1-B11: boundaries added in the review > B11 AC1: an Infinity end is past 1440 0ms

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > B1-B11: boundaries added in the review > B4 AC1: -10 to 30 with now = -30 starts before 0
AssertionError: expected true to be false // Object.is equality

- Expected
+ Received

- false
+ true

 ❯ src/booking.test.ts:151:50
    149| 
    150|   test('B4 AC1: -10 to 30 with now = -30 st…
    151|     expect(decide(input(-10, 30, { now: -30…
       |                                                  ^
    152|   });
    153| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 28 passed (29)
```

### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real defect
is still open, leave its test failing and explain it in 9.1.

```text
RUN  v3.2.7 C:/Users/Huawei/se-practice/week-07/app

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
      ```
---

## 7. Task 6 — deliberate defects

You need a reviewed, passing suite first. Then introduce **one** defect at a time in your booking
module, leave the tests unchanged, run, record, and **restore** the code. A syntax or import
error does not count as detection.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected | T06, X1 | — |
| M2 | Treat touching endpoints as an overlap | Detected | T01, T08, AC5 | also failed: B7 and the second AC5 test (frozen bookings) |
| M3 | Remove the blocked-room rejection | Detected | T13 | — |

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test
names at least:
```text
M1 — duration >= 120
RUN  v3.2.7 C:/Users/Huawei/se-practice/week-07/app

 ❯ src/booking.test.ts (29 tests | 2 failed) 8ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T01 AC4: 660-720 only touches the end of the booking 1ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T02 AC1: 540-570 starts exactly at now 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T03 AC1: 720-720 has zero duration 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T04 AC1: 750-720 is reversed 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T05 AC1: 1380-1441 ends past the end of the day 0ms
   × T01-T14: the reviewed case table (now = 540, booking 600-660) > T06 AC2: 720-840 is exactly 120 minutes 4ms
     → expected false to be true // Object.is equality
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
   × X1, X2: my own cases from the plan > X1 AC1 AC2: 1320-1440 ends exactly at 24:00 and lasts exactly 120 minutes 0ms
     → expected false to be true // Object.is equality
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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > T01-T14: the reviewed case table (now = 540, booking 600-660) > T06 AC2: 720-840 is exactly 120 minutes
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:53:37
     51| 
     52|   test('T06 AC2: 720-840 is exactly 120 minutes', () => {
     53|     expect(decide(input(720, 840))).toBe(true);
       |                                     ^
     54|   });
     55| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  src/booking.test.ts > X1, X2: my own cases from the plan > X1 AC1 AC2: 1320-1440 ends exactly at 24:00 and lasts exactly 120 minutes
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:125:39
    123| describe('X1, X2: my own cases from the plan', () => {
    124|   test('X1 AC1 AC2: 1320-1440 ends exactly at 24:00 and lasts exactly 120 minutes', (…
    125|     expect(decide(input(1320, 1440))).toBe(true);
       |                                       ^
    126|   });
    127| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  1 failed (1)
      Tests  2 failed | 27 passed (29)

M2 — touching endpoints as overlap
 RUN  v3.2.7 C:/Users/Huawei/se-practice/week-07/app

 ❯ src/booking.test.ts (29 tests | 5 failed) 9ms
   × T01-T14: the reviewed case table (now = 540, booking 600-660) > T01 AC4: 660-720 only touches the end of the booking 5ms
     → expected false to be true // Object.is equality
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T02 AC1: 540-570 starts exactly at now 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T03 AC1: 720-720 has zero duration 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T04 AC1: 750-720 is reversed 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T05 AC1: 1380-1441 ends past the end of the day 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T06 AC2: 720-840 is exactly 120 minutes 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T07 AC2: 720-841 is 121 minutes 0ms
   × T01-T14: the reviewed case table (now = 540, booking 600-660) > T08 AC4: 570-600 only touches the start of the booking 0ms
     → expected false to be true // Object.is equality
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T09 AC4: 630-690 partly overlaps the booking 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T10 AC4: 570-690 contains the whole booking 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T11 AC4: 615-645 lies inside the booking 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T12 AC4: 600-660 is identical to the booking 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T13 AC3: 660-720 in a blocked room 0ms
   ✓ T01-T14: the reviewed case table (now = 540, booking 600-660) > T14 AC4: 630-690 with no existing bookings 0ms
   × AC5: a decision without changing the booking data > AC5: an Available request (660-720) leaves the bookings exactly as before 0ms
     → expected false to be true // Object.is equality
   ✓ AC5: a decision without changing the booking data > AC5: an Unavailable request (630-690) does not remove or edit the conflicting booking 0ms
   × AC5: a decision without changing the booking data > AC5: frozen, unsorted bookings are never changed in place, on either outcome 0ms
     → expected false to be true // Object.is equality
   ✓ X1, X2: my own cases from the plan > X1 AC1 AC2: 1320-1440 ends exactly at 24:00 and lasts exactly 120 minutes 0ms
   ✓ X1, X2: my own cases from the plan > X2 AC4: 690-750 is clear of 600-660 but overlaps the second booking 720-780 0ms
   ✓ B1-B11: boundaries added in the review > B1 AC1: 541-570 starts one minute after now 0ms
   ✓ B1-B11: boundaries added in the review > B2 AC1: 720-721 is a one-minute booking 0ms
   ✓ B1-B11: boundaries added in the review > B3 AC1: 1380-1440 ends exactly at 24:00 (60 minutes) 0ms
   ✓ B1-B11: boundaries added in the review > B4 AC1: -10 to 30 with now = -30 starts before 0 0ms
   ✓ B1-B11: boundaries added in the review > B5 AC1: 0-60 with now = -1 starts exactly at 0 0ms
   × B1-B11: boundaries added in the review > B7 AC4: 660-720 fills the gap and touches two bookings 0ms
     → expected false to be true // Object.is equality
   ✓ B1-B11: boundaries added in the review > B8 AC4: 630-690 overlaps the second of two unsorted bookings 0ms
   ✓ B1-B11: boundaries added in the review > B9 AC1: 660-720 with now = 660 uses the supplied now 0ms
   ✓ B1-B11: boundaries added in the review > B10 AC1: a NaN start is not a valid interval 0ms
   ✓ B1-B11: boundaries added in the review > B11 AC1: an Infinity end is past 1440 0ms

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 5 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > T01-T14: the reviewed case table (now = 540, booking 600-660) > T01 AC4: 660-720 only touches the end of the booking
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:33:37
     31| describe('T01-T14: the reviewed case table (now = 540, booking 600-660)', () => {
     32|   test('T01 AC4: 660-720 only touches the end of the booking', () => {
     33|     expect(decide(input(660, 720))).toBe(true);
       |                                     ^
     34|   });
     35| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/5]⎯

 FAIL  src/booking.test.ts > T01-T14: the reviewed case table (now = 540, booking 600-660) > T08 AC4: 570-600 only touches the start of the booking
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:61:37
     59| 
     60|   test('T08 AC4: 570-600 only touches the start of the booking', () => {
     61|     expect(decide(input(570, 600))).toBe(true);
       |                                     ^
     62|   });
     63| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/5]⎯

 FAIL  src/booking.test.ts > AC5: a decision without changing the booking data > AC5: an Available request (660-720) leaves the bookings exactly as before
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:96:20
     94|     const result = canBook({ start: 660, end: 720, now: 540, blocked: false, bookings…
     95| 
     96|     expect(result).toBe(true);
       |                    ^
     97|     expect(bookings).toEqual(before);
     98|     expect(JSON.stringify(bookings)).toBe(JSON.stringify(before));

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/5]⎯

 FAIL  src/booking.test.ts > AC5: a decision without changing the booking data > AC5: frozen, unsorted bookings are never changed in place, on either outcome
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:118:62
    116|       ]) as Interval[];
    117| 
    118|     expect(canBook(input(660, 720, { bookings: frozen() }))).toBe(true);
       |                                                              ^
    119|     expect(canBook(input(630, 690, { bookings: frozen() }))).toBe(false);
    120|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/5]⎯

 FAIL  src/booking.test.ts > B1-B11: boundaries added in the review > B7 AC4: 660-720 fills the gap and touches two bookings
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:163:51
    161|       { start: 720, end: 780 },
    162|     ];
    163|     expect(decide(input(660, 720, { bookings }))).toBe(true);
       |                                                   ^
    164|   });
    165| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/5]⎯


 Test Files  1 failed (1)
      Tests  5 failed | 24 passed (29)


M3 — no blocked-room rejection
RUN  v3.2.7 C:/Users/Huawei/se-practice/week-07/app

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
```

All three changes reverted, and the full suite run again (section 6.3): yes 

---

## 8. Task 7 — manual UI checks

Use `now = 09:00` and an existing `10:00–11:00` booking. Do them in the page in a browser. Save a
screenshot of each as `evidence/ui-1.png` … `evidence/ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | Drew Hall 105, now 09:00: green "Available"; schedule shows Morning Lecture 10:00–11:00 | Pass |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | after clicking "20 seats" the card shows Blocked; result changed to "Unavailable — Drew Hall 105 is currently blocked and cannot be booked" | Pass |
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | Start cleared: "Unavailable — Start and end times are required." Note: in 12-hour format, 12:00 AM (midnight) was easy to confuse with noon and gave "Start time must be earlier than end time" | Pass |
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | narrow portrait window: room cards in two columns, inputs and result stacked and readable | Pass |
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | after several checks the schedule still shows only Morning Lecture 10:00–11:00 | Pass |

---

### 9.1 Checks I am keeping as FAIL or ERROR

| Check | Why it stays |
| --- | --- |
| none | |

### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | 22 collected: 18 passed, 0 failed, 4 todo (not executed) | 29 executed: 29 passed, 0 failed (before the start < 0 fix: 28 passed, 1 failed — B4) |
| Requirements with meaningful tests (AC IDs and gaps) | AC1–AC4 via one it.each table, AC5 on an Available call; gaps: no 0 ≤ start case, no one-minute or "start just after now" boundaries, AC6 not testable | AC1 (T02–T05, X1, B1–B5, B9–B11), AC2 (T06, T07, X1), AC3 (T13), AC4 (T01, T08–T12, T14, X2, B7, B8), AC5 (three tests, Available and Unavailable); gap: AC6 and the visible part of AC5 only by hand (section 8) |
| Selected mutants detected | not run on the first suite | 3 of 3: M1 by T06, X1; M2 by T01, T08, AC5, B7; M3 by T13 |
| Accepted / revised / rejected tests | — | accepted: all 16 expected values, the AC5 snapshot idea, B1–B5, B7–B11; revised: it.each split into one test per ID; rejected: fake timers with new Date, 4 it.todo, "repeated calls" test |
| Remaining limitations | uses the clock, table-driven, todo tests | AC6 and the on-screen labels are not unit-tested; fractional minutes undecided; the generating assistant (Claude) is the same family as the assistant that helped me, so its review is not fully independent |

### 9.3 What no AC decides

- With bookings = [{ start: 700, end: 650 }] and a request 660–720, canBook returns **true**. The overlap test `660 < 650 && 720 > 700` is false, so the reversed booking is treated as if it blocks nothing.
- No AC says what to do with an invalid existing booking: AC4 only talks about overlaps with existing bookings and assumes they are valid. I keep `returns-true` and note that the page's sample data never contains a reversed booking.

-

---

## 10. Conclusion (120–180 words)

<!-- Answer all three in your own words, without the assistant:
     (a) Which mistake in the FIRST suite would have let a wrong canBook pass, and how did you find it?
     (b) What does your final green run prove, and what does it NOT prove? Use a mutant or a UI check.
     (c) One testing limitation that remains.
     Worthless: "The AI wrote good tests and they all passed."
     Worth everything: "The first suite expected T06 (exactly 120 minutes) to be rejected. That
     contradicts AC2, and it failed on a correct canBook. If I had changed the code to make it
     pass, M1 would have become the real behaviour." -->

<!-- Write your conclusion below this line -->
