# Week 05 — Lab report

**Name:**  Anzara Nurbek
**Group:**  SE-Monday, 16:00-19:00
**Date:**  2026-10-11

---

## 1. Setup

| | |
| --- | --- |
| Assistant (tool) | Claude |
| **Exact** model name | Claude Opus 5.5 |
| Language and version | Python 3.12.10 |
| Path | A |
| My Week 04 declaration for touching bookings | allowed |

---

## 2. Task 1 — the plan

**The assistant's plan, pasted unedited:**

```text
Implementation plan for can_book
Checks in order

The function returns False at the first failed check and returns True only if every check passes.

AC1, time window: 0 <= start < end <= 1440. Reject reversed, zero-length, or out-of-day intervals.
AC1, future start: start > now, a strict comparison.
AC2, duration: end - start <= 120. Step 1 already guarantees the duration is at least 1.
AC3, room status: blocked must be False.
AC4, conflicts: for each (s, e) in existing, a conflict exists when start < e and s < end. With half-open intervals, this rule lets touching endpoints pass.
AC5: return True. The function only reads existing. It never sorts, appends to, or removes from it.

All criteria must hold, so the order doesn’t change the result. Putting the cheap scalar checks before the loop is just efficient.

Assumptions
start and end are integers, but their values may be invalid. Only now, blocked, and existing are guaranteed valid, and catching bad times is AC1’s job.
end == 1440 is allowed, so a booking can end at midnight.
existing may be empty. Its entries may be unsorted and may overlap each other. The overlap test doesn’t care about either.
Each booking is checked against all existing bookings. Order and adjacency don’t matter.
Because now >= 0, start = 0 can never satisfy start > now. A request starting at 0 is therefore always False, which is consistent with the rules.
Boundary cases worth testing

Unless stated otherwise, these use now = 500, blocked = False, and existing = [].

Case	Input (start, end)	Expected	Bug it exposes
Starts exactly now	(500, 560)	False	>= used instead of >
Starts one minute after now	(501, 560)	True	Over-strict check
Zero length	(600, 600)	False	<= used instead of <
Reversed	(660, 600)	False	Missing order check, or negative duration passing AC2
Ends at midnight	(1380, 1440)	True	end < 1440 used
Past midnight	(1380, 1441)	False	Missing upper bound
Negative start	(-10, 60) with now = 0	False	Missing lower bound, though AC1’s start > now also catches it
Exactly 120 min	(600, 720)	True	< 120 used
121 min	(600, 721)	False	Missing or loose duration check
Blocked, otherwise valid	(600, 660), blocked = True	False	AC3 ignored

These cases use existing = [(600, 660)]:

Case	Input	Expected	Bug it exposes
Touches the end	(660, 720)	True	<= in the overlap test
Touches the start	(540, 600)	True	Same
Overlaps by one minute at the end	(659, 700)	False	Off-by-one
Overlaps by one minute at the start	(540, 601)	False	Off-by-one
Identical interval	(600, 660)	False	Equality not treated as overlap
Contains the existing booking	(590, 670)	False	Test only checks endpoints falling inside
Inside the existing booking	(610, 620)	False	Same

These cases use more than one existing booking:

Case	Input	Expected	Bug it exposes
Exact gap between two bookings	existing = [(600, 660), (720, 780)], (660, 720)	True	Over-strict overlap test
Conflicts only with a later booking	existing = [(800, 860), (600, 660)], (630, 690)	False	Returning True after checking only the first booking, or assuming the list is sorted
Inputs unchanged	Any call	existing equal to a copy taken before the call, same order	In-place sort() or other mutation, which violates AC5

When you’re ready, the next step can be the code, the tests, or both.
```

**What the plan invented or changed.** One row for every rule in the plan that is not in the
contract or in AC1–AC5, or that says something different from them. If you found none, write one
row saying which lines of the plan you checked against which AC.

| # | What the plan said | What the contract or the AC says | What I did |
| --- | --- | --- | --- |
| 1 | Checks 1–5: `0 <= start < end <= 1440`, `start > now`, `end - start <= 120`, `blocked` is False, overlap `start < e and s < end`, return True | Each step maps to AC1 (1, 2), AC2 (3), AC3 (4), AC4 (5), AC5 (6). No gap between bookings, no sorting, no saving, no validation of `now`/`blocked`/`existing` | Checked every step against AC1–AC5: no invented rule found, nothing to drop |
| 2 | Assumption: "existing may overlap each other" | The contract only says existing holds valid (start, end) tuples of active bookings; it says nothing about overlaps between them | Kept: it is an assumption, not a rule, and does not change the result — every booking is checked anyway |
| 3 | Assumption: only `now`, `blocked`, `existing` are guaranteed valid; `start`/`end` may be out of range | Contract: "now is valid (0-1439)", "existing contains valid tuples"; nothing guarantees start/end | Agree — this is why AC1 must check start/end. Not an invention |

**Boundary cases the assistant suggested that I kept as tests:**

- Zero length (600, 600) → False (AC1)
- Reversed (660, 600) → False (AC1)
- Ends at midnight (1380, 1440) → True (AC1)
- Past midnight (1380, 1441) → False (AC1)
- Touches the start of the existing booking (540, 600) → True (AC4)
- Contains the existing booking (590, 670) → False (AC4)
- Inside the existing booking (610, 620) → False (AC4)
- Exact gap between two bookings → True (AC4)
- Conflicts only with a later, unsorted booking → False (AC4)
- Inputs unchanged after the call (AC5)
---

## 3. Task 2 — the first version (v1), read before it was run

v1 is saved as `code/original/booking_v1.<ext>`, exactly as the assistant returned it: yes / no

**AC map.** One row per condition in v1. Quote the line.

| # | Line in v1 | AC it implements | Correct as written? If not, why |
| --- | --- | --- | --- |
| 1 | `if not (0 <= start < end <= 1440): return False` | AC1 (day bounds, start < end) | Yes — strict `<` rejects zero-length and reversed; `<= 1440` lets a booking end at midnight |
| 2 | `if start <= now: return False` | AC1 (start > now) | Yes — exact negation of `start > now`; a booking starting at `now` is rejected |
| 3 | `if end - start > 120: return False` | AC2 | Yes — 120 passes, 121 fails; duration is already ≥ 1 after row 1 |
| 4 | `if blocked: return False` | AC3 | Yes |
| 5 | `for booked_start, booked_end in existing:` / `if start < booked_end and booked_start < end: return False` | AC4 | Yes — strict `<` on both sides lets touching endpoints through; the loop checks every booking before True |
| 6 | `return True` | AC5 | Yes — reached only after AC1–AC4; returns a bool literal; `existing` is only iterated, never changed |

**Anything in v1 that no AC asks for** (extra validation, a buffer between bookings, logging,
saving the booking, a different return type):

- Nothing. No buffer, no sorting, no saving, no input validation, no exceptions — only docstrings and comments.

---

## 4. Task 3 — my tests

Base input for every row unless the row says otherwise: `now=540, blocked=False, existing=[(600, 660)]`.

| # | Test name | Request (start, end) | What differs from the base input | Expected | AC | Result on v1 | Result on final |
| 1 | test_touching_end_is_allowed | (660, 720) | — | True | AC4 | pass | pass |
| 2 | test_partial_overlap_is_rejected | (630, 690) | — | False | AC4 | pass | pass |
| 3 | test_blocked_room_is_rejected | (660, 720) | blocked=True | False | AC3 | pass | pass |
| 4 | test_exactly_two_hours_is_allowed | (720, 840) | — | True | AC2 | pass | pass |
| 5 | test_over_two_hours_is_rejected | (720, 841) | — | False | AC2 | pass | pass |
| 6 | test_starting_now_is_rejected | (540, 570) | — | False | AC1 start > now | pass | pass |
| 7 | test_zero_length_is_rejected | (700, 700) | — | False | AC1 start < end | pass | pass |
| 8 | test_reversed_times_are_rejected | (720, 700) | — | False | AC1 start < end | pass | pass |
| 9 | test_one_minute_after_now_is_allowed | (541, 570) | — | True | AC1 start > now | pass | pass |
| 10 | test_ending_at_midnight_is_allowed | (1380, 1440) | — | True | AC1 end <= 1440 | pass | pass |
| 11 | test_ending_after_midnight_is_rejected | (1380, 1441) | — | False | AC1 end <= 1440 | pass | pass |
| 12 | test_empty_existing_is_allowed | (630, 690) | existing=[] | True | AC4 | pass | pass |
| 13 | test_exact_gap_between_two_bookings_is_allowed | (660, 720) | existing=[(600,660),(720,780)] | True | AC4 | pass | pass |
| 14 | test_conflict_with_a_later_booking_is_rejected | (830, 880) | existing=[(600,660),(800,860)] | False | AC4 | pass | pass |
| 15 | test_touching_start_is_allowed | (570, 600) | — | True | AC4 | pass | pass |
| 16 | test_inside_existing_is_rejected | (615, 645) | — | False | AC4 | pass | pass |
| 17 | test_containing_existing_is_rejected | (570, 690) | — | False | AC4 | pass | pass |
| 18 | test_identical_interval_is_rejected | (600, 660) | — | False | AC4 | pass | pass |
| 19 | test_existing_unchanged_after_accepted_request | (700, 760) | existing=[(800,860),(600,660)] | True, list unchanged | AC5 | pass | pass |
| 20 | test_existing_unchanged_after_rejected_request | (630, 690) | existing=[(800,860),(600,660)] | False, list unchanged | AC5 | pass | pass |
| 21 | test_last_minute_of_the_day_is_allowed | (1439, 1440) | — | True | AC1 end <= 1440 | pass | pass |
---

## 5. Task 4 — debugging with evidence

One row per defect you found — in v1, in a later version, or in your own tests. If v1 passed
everything, the row is the **new edge case you added**, with expected and actual equal, and the
cause column says why no change was needed.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `can_book(1439, 1440, 540, False, [(600, 660)])` — new edge case, the last minute of the day | True | True | No defect: `if not (0 <= start < end <= 1440)` lets end = 1440 through and the duration 1 passes `end - start > 120`; no other line rejects it | None needed | — |

**The debug prompt I sent, and the assistant's answer** (leave the block empty if you did not use it):

```text
```

---

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

```text
I found no defects against the contract or AC1–AC5. Inventing issues to reach five would mislead you, so here is how each line holds up instead.

Line	Criterion	Verdict
if not (0 <= start < end <= 1440):	AC1 range and order	Correct. Zero-length, reversed and out-of-day intervals are rejected, and end = 1440 is allowed.
if start <= now:	AC1 “start > now”	Correct. It is the exact negation of the strict rule.
if end - start > 120:	AC2 “at most 120 minutes”	Correct. A duration of 120 passes and 121 fails.
if blocked:	AC3	Correct. The contract guarantees blocked is a Boolean.
if start < booked_end and booked_start < end:	AC4 and the half-open interval rule	Correct. It catches partial, identical and containing overlaps, while touching endpoints pass.
for booked_start, booked_end in existing:	AC5 “never alter existing” and “keep all inputs unchanged”	Correct. It only reads existing and never sorts or mutates it.
return True	AC5 “True only when AC1–AC4 hold”	Correct. It is reached only after every check passes.

Two points are worth knowing, though neither is a defect:

for booked_start, booked_end in existing: depends on the contract line “existing contains valid (start, end) tuples”. A malformed entry would raise an error instead of returning False. The contract rules that input out, so no check is needed.
if not (0 <= start < end <= 1440): depends on “Times are integer minutes”. Floats or strings aren’t validated. That is also outside the contract, and adding type checks would go beyond the stated scope.

A test suite built from the boundary cases in the plan would confirm this review in practice, and I can write it if you’d like.
```

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | No defects against AC1–AC5; every line verified (table in the critique) | accept | Matches my own evidence: 21 tests OK and F1–F10 PASS; each row agrees with my AC map in §3 | No change — 21 tests OK |
| 2 | `for booked_start, booked_end in existing:` would raise on a malformed entry; no check needed | reject (no change) | Contract: "existing contains valid (start, end) tuples for this room's active bookings only" — malformed entries cannot occur, so a check would add a rule the contract does not ask for | No change — 21 tests OK |
| 3 | `if not (0 <= start < end <= 1440):` does not validate floats or strings; adding type checks would go beyond scope | reject (no change) | Contract: "Times are integer minutes"; AC5 asks for True/False only — raising an exception or adding validation is outside the stated scope. My decision for non-integers is in §9.2 | No change — 21 tests OK |

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | No change: `code/booking.py` is identical to `code/original/booking_v1.py` | v1 passed all 21 tests and F1–F10; every condition maps to AC1–AC5 (§3) | Checker: "v1 passes F1 … F10 - fails nothing - identical to your final: yes"; suite 21 tests OK |

---

## 8. Evidence — real output

### 8.1 My suite, final run

Paste the **complete** terminal output. For Python: everything `python -m unittest -v` printed.

```text
$ python -m unittest -v
test_blocked_room_is_rejected (test_booking.BookingTests.test_blocked_room_is_rejected) ... ok
test_conflict_with_a_later_booking_is_rejected (test_booking.BookingTests.test_conflict_with_a_later_booking_is_rejected) ... ok
test_containing_existing_is_rejected (test_booking.BookingTests.test_containing_existing_is_rejected) ... ok
test_empty_existing_is_allowed (test_booking.BookingTests.test_empty_existing_is_allowed) ... ok
test_ending_after_midnight_is_rejected (test_booking.BookingTests.test_ending_after_midnight_is_rejected) ... ok
test_ending_at_midnight_is_allowed (test_booking.BookingTests.test_ending_at_midnight_is_allowed) ... ok
test_exact_gap_between_two_bookings_is_allowed (test_booking.BookingTests.test_exact_gap_between_two_bookings_is_allowed) ... ok
test_exactly_two_hours_is_allowed (test_booking.BookingTests.test_exactly_two_hours_is_allowed) ... ok
test_existing_unchanged_after_accepted_request (test_booking.BookingTests.test_existing_unchanged_after_accepted_request) ... ok
test_existing_unchanged_after_rejected_request (test_booking.BookingTests.test_existing_unchanged_after_rejected_request) ... ok
test_identical_interval_is_rejected (test_booking.BookingTests.test_identical_interval_is_rejected) ... ok
test_inside_existing_is_rejected (test_booking.BookingTests.test_inside_existing_is_rejected) ... ok
test_last_minute_of_the_day_is_allowed (test_booking.BookingTests.test_last_minute_of_the_day_is_allowed) ... ok
test_one_minute_after_now_is_allowed (test_booking.BookingTests.test_one_minute_after_now_is_allowed) ... ok
test_over_two_hours_is_rejected (test_booking.BookingTests.test_over_two_hours_is_rejected) ... ok
test_partial_overlap_is_rejected (test_booking.BookingTests.test_partial_overlap_is_rejected) ... ok
test_reversed_times_are_rejected (test_booking.BookingTests.test_reversed_times_are_rejected) ... ok
test_starting_now_is_rejected (test_booking.BookingTests.test_starting_now_is_rejected) ... ok
test_touching_end_is_allowed (test_booking.BookingTests.test_touching_end_is_allowed) ... ok
test_touching_start_is_allowed (test_booking.BookingTests.test_touching_start_is_allowed) ... ok
test_zero_length_is_rejected (test_booking.BookingTests.test_zero_length_is_rejected) ... ok

----------------------------------------------------------------------
Ran 21 tests in 0.002s

OK
```

### 8.2 The checker, final run

Paste the **complete** output of `python tests/check_booking.py`. Paste it **last**: if you edit
this file afterwards, run the checker again and paste again.

```text
python tests/check_booking.py
Week 05 - can_book: the function, your tests, the evidence   (Path A)

PASS   F1   the six cases from the task table           6 of 6 cases
PASS   F2   AC1 time order and day bounds               5 of 5 cases
PASS   F3   AC1 the start is in the future              5 of 5 cases
PASS   F4   AC2 at most 120 minutes                     3 of 3 cases
PASS   F5   AC3 a blocked room accepts nothing          2 of 2 cases
PASS   F6   AC4 every kind of overlap is rejected       5 of 5 cases
PASS   F7   AC4 touching endpoints are allowed          3 of 3 cases
PASS   F8   AC4 every existing booking is checked       4 of 4 cases
PASS   F9   AC5 the result is a real Boolean            3 of 3 cases
PASS   F10  AC5 the inputs are left unchanged           2 of 2 cases
PASS   O1   the assistant's first version is kept       v1 kept (32 lines)
PASS   S1   your suite has at least 11 tests            21 tests
PASS   S2   your suite is green on your own code        21 tests, OK
PASS   M1   your tests catch a fault in AC1             caught by test_starting_now_is_rejected
PASS   M2   your tests catch a fault in AC1             caught by test_ending_after_midnight_is_rejected
PASS   M3   your tests catch a fault in AC1             caught by test_zero_length_is_rejected
PASS   M4   your tests catch a fault in AC2             caught by test_exactly_two_hours_is_allowed
PASS   M5   your tests catch a fault in AC3             caught by test_blocked_room_is_rejected
PASS   M6   your tests catch a fault in AC4             caught by test_exact_gap_between_two_bookings_is_allowed, test_touching_end_is_allowed, test_touching_start_is_allowed
PASS   M7   your tests catch a fault in AC4             caught by test_conflict_with_a_later_booking_is_rejected, test_existing_unchanged_after_rejected_request
PASS   M8   your tests catch a fault in AC4             caught by test_containing_existing_is_rejected
PASS   M9   your tests catch a fault in AC5             caught by test_existing_unchanged_after_accepted_request
PASS   M10  your tests catch a fault in AC5             caught by test_existing_unchanged_after_accepted_request, test_existing_unchanged_after_rejected_request
PASS   L1   report 1: tool, model and language          tool, model and language recorded
PASS   L2   report 2: the plan, and what you corrected  plan pasted, 3 row(s) on what you corrected or verified
PASS   L3   report 3: v1 mapped to AC1-AC4              6 conditions mapped, AC1-AC4 all present
PASS   L4   report 4: at least 11 of your tests listed  22 tests listed
PASS   L5   report 5: debugging evidence                1 row(s) of input / expected / actual
PASS   L6   report 6: the critique, each point judged   critique pasted, 3 points judged
PASS   L7   report 7: change log                        1 change-log row(s)
PASS   L8   report 8.1: real output of your suite       suite output pasted
PASS   L9   report 10: conclusion of 120-180 words      157 words
------------------------------------------------------------------------------
v1 (code/original/booking_v1.py): passes F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 - fails nothing - identical to your final: yes
SUMMARY pass=32 fail=0 error=0   (32 checks)
Behaviour and shape are clean. This says nothing about the quality of your review.

```

### 8.3 Path B only — three faults I planted myself

Break your own function on purpose, one line at a time, run your suite, restore the line.

| # | Line I changed (before → after) | AC it breaks | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

The three failing runs (Path A students leave this block empty):

```text
```

---

## 9. What still fails, and what the contract does not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | The final checker run is clean: 32 PASS |

### 9.2 Outside the contract

The contract says times are integers. It does not say what `can_book` does when one is not —
`600.5`, or the string `"600"`. What does **your** function do, and why is that the right call?

- can_book(600.5, 630, 540, False, []) returns True: Python compares a float with an int without complaint, so 600.5 passes every check like any other time. can_book('600', 630, 540, False, []) raises TypeError at line 13, on 0 <= start. I did not add a type check: the contract promises integers, and a loud crash on a string is safer than a silent guess.

### 9.3 A bound that never decides

One of the bounds written in AC1 can never be the *only* reason a request is rejected. Which one,
and why?

- 0 <= start never rejects a request on its own. now is itself a valid time, so now >= 0, and any start < 0 already fails start <= now.

---

## 10. Conclusion (120–180 words)
(a) The final code rejects a request when `start < booked_end and booked_start < end`. Intervals are half-open, so both comparisons are strict. If the request starts exactly where a booking ends, `start < booked_end` is false; if it ends where one begins, `booked_start < end` is false, so the request passes.

(b) No fault slipped through: the assistant's v1 passed F1–F10, is identical to my final code, and my suite caught all ten mutants in every recorded run. My last added test, test_last_minute_of_the_day_is_allowed, probes the day's upper bound, like test_ending_at_midnight_is_allowed.

(c) The contract does not say what happens to non-integer times. can_book(600.5, ...) returns True; can_book('600', ...) raises TypeError at line 13. I added no type check: the contract promises integers, and a crash is safer than a silent guess. I also kept v1 unchanged, since it met every criterion.