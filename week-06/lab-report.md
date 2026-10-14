# Week 06 — Lab report

**Name:** Anzara Nurbek
**Group:** SE-Monday, 16:00-19:00
**Date:** 2026-10-14

---

## 1. Setup

| | |
| --- | --- |
| Tool | Bolt.new |
| Exact model (as Bolt shows it, or `not displayed`) | not displayed (Bolt Agent: Standard) |
| Bolt project link (or `not shared`, and why) | https://bolt.new/~/sb1-andhqeqd?classId=b821ca27-77bc-49a8-8d38-127b962fe5c9&assignmentId=88814bc6-47f1-4ee7-9e88-e3d039bf07ea&submissionId=51bb44d4-906d-eeb1-de1f-517f65f74577 |
| Browser and version | Google Chrome 155.0.8059.39 (64-bit) |
| If you could not use Bolt.new: the tool you used instead, and why | none — Bolt.new was used |

---

## 2. Task 1 — define before generating

**Two predictions, written BEFORE you send the first prompt.** Where do you expect v1 to go wrong?
Fill the first three columns now; fill the last one after Task 3.

| # | What I expect to go wrong | AC it concerns | Was I right? (after Task 3) |
| --- | --- | --- | --- |
| 1 | The page will have no input for the current time and will use the real clock, so T6 cannot be tested | AC1 | |
| 2 | Pressing Check will add the request to the bookings, so the same check a second time says Unavailable (T8) | AC5 | |

**The initial prompt exactly as I sent it** — the deck's prompt with AC1–AC6 pasted in place of
`[paste AC1–AC6]`, nothing else changed:

```text
Build a small responsive Smart Campus Room Availability Checker. Requirements: AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time. AC2: Reject a booking longer than 120 minutes. AC3: Reject the request when the selected room is blocked. AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed. AC5: Show a clear Available / Unavailable decision without changing the existing booking data. AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback. Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.```

---

## 3. Task 2 — prototype v1

v1 export saved in `original/` and screenshot saved as `evidence/v1.png` **before** any cleanup
prompt: yes / no

**Bolt's list of the files/components it created, pasted unedited:**

```text
Build and typecheck both pass. Here's what I created:

Main files:

src/types.ts — TypeScript interfaces for rooms, bookings, and the availability verdict.
src/data.ts — Six fictional campus rooms (two blocked) with seven pre-existing bookings using minutes-from-midnight.
src/availability.ts — The availability logic implementing all five acceptance criteria: interval validity (AC1), 120-minute max (AC2), blocked-room rejection (AC3), overlap detection with touching endpoints allowed (AC4), and a pure check that never mutates existing bookings (AC5).
src/App.tsx — The one-page UI with room selection cards, start/end time inputs, a live Available/Unavailable result panel, and a schedule list for the selected room.
How it works: Pick a room, set start and end times, and the page shows a green "Available" or red "Unavailable" result with specific reasons (blocked room, past start time, exceeding 120 min, or overlapping an existing booking). The layout uses a two-column grid on desktop that collapses to a single column on mobile. Touching endpoints (e.g., one booking ends 10:00, next starts 10:00) are allowed, and checking never changes the existing booking data.```

**What v1 does — one line per thing that works, or visibly does not:**

- Six fictional rooms as cards; two of them (Allen Hall 102, Cass Library Quiet Room) are permanently blocked in `src/data.ts` — there is no way to block or unblock a room in the page.
- No room has exactly one booking 10:00–11:00, so the base setup of the nine cases cannot be built.
- "Current time" is the real device clock (`new Date()` in `src/App.tsx`), fixed when the page loads; there is no input to supply it.
- The verdict is live (no Check button): it recomputes when the room or times change and shows reasons when Unavailable.
- The check in `src/availability.ts` is a pure function and does not change the bookings list (AC5 looks fine).
- Time inputs are HH:MM and `parseTime` rejects 24:00, so an interval ending at 24:00 cannot be entered.

**Repair prompt** (only if the first build did not run — the deck allows one, then the result is
v1). Leave empty if you did not need it:

```text
```

---

## 4. Task 3 — the nine cases

Base for every case unless the row says otherwise: **current time 09:00**, room **not blocked**,
the room's **only booking 10:00–11:00**. The Expected column comes from AC1–AC6 — do not change it.
Write each result exactly as **Available**, **Unavailable** or **Not testable** (the page gives you
no way to set up the case). Save each final run as `evidence/final-T<n>.png`.

| # | Case | What you set up and request | Expected | AC | Result on v1 | Result on final | Final screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 11:00–12:00 | Available | AC4 | Available / Unavailable / Not testable | Available / Unavailable / Not testable | final-T1.png |
| T2 | Overlap | 10:30–11:30 | Unavailable | AC4 | Available / Unavailable / Not testable | Available / Unavailable / Not testable | final-T2.png |
| T3 | Blocked | 11:00–12:00, room blocked | Unavailable | AC3 | Available / Unavailable / Not testable | Available / Unavailable / Not testable | final-T3.png |
| T4 | Exactly 2 hours | 12:00–14:00 | Available | AC2 | Available / Unavailable / Not testable | Available / Unavailable / Not testable | final-T4.png |
| T5 | Over 2 hours | 12:00–14:01 | Unavailable | AC2 | Available / Unavailable / Not testable | Available / Unavailable / Not testable | final-T5.png |
| T6 | Starts now | 09:00–09:30 (current time 09:00) | Unavailable | AC1 | Available / Unavailable / Not testable | Available / Unavailable / Not testable | final-T6.png |
| T7 | Reversed times | 12:00–11:00, and the page says why | Unavailable | AC1, AC6 | Available / Unavailable / Not testable | Available / Unavailable / Not testable | final-T7.png |
| T8 | Same check twice | T1, then T1 again without reloading | Available | AC5 | Available / Unavailable / Not testable | Available / Unavailable / Not testable | final-T8.png |
| T9 | Narrow screen | T1 at about 375 px wide | Available | AC6 | Available / Unavailable / Not testable | Available / Unavailable / Not testable | final-T9.png |

---

## 5. Issue log — cleanup targets

One row per issue you chose to act on (or deliberately not act on). At least **two**: one
functional and one usability or code-quality issue when you have them. If v1 passed every case,
log a justified cleanup that preserves behaviour. Save a screenshot of each as
`evidence/issue-<n>.png`.

| # | Issue | Evidence: steps → expected → observed | Priority | Decision |
| --- | --- | --- | --- | --- |
| 1 | | | High / Medium / Low | Fix / Reject / Defer |
| 2 | | | High / Medium / Low | Fix / Reject / Defer |

---

## 6. Task 4 — cleanup with focused prompts

One issue per prompt. Paste every prompt **as sent** (every `[bracketed field]` and `AC#` filled
in) and Bolt's answer, unedited.

**Functional fix prompt, as sent, and Bolt's answer:**

```text
(paste here)
```

**Cleanup prompt, as sent, and Bolt's answer:**

```text
(paste here)
```

Add further blocks for further prompts.

**Every change or suggestion Bolt made, judged.** Accepting is a decision; so is rejecting. Cite
the AC (or the scope) that justifies it.

| # | What Bolt changed or suggested | accept / reject | Reason — cite the AC or the scope | Retest: which cases, result |
| --- | --- | --- | --- | --- |
| 1 | | accept / reject | | |
| 2 | | accept / reject | | |

---

## 7. Change log — v1 to final

Two to four concrete changes, each one retested.

| # | Issue | Decision | Change (file or component) | Result after retest |
| --- | --- | --- | --- | --- |
| 1 | | | | |
| 2 | | | | |

---

## 8. One generated component, in my own words

Pick one file or component Bolt generated that matters for AC1–AC5 — the one that decides
availability is the best choice. Name its path in backticks, then explain in your own words, without
the assistant, what it does and how it decides. 60 words or more.

**File:** `(write here, e.g. src/App.tsx)`

<!-- Write your explanation below this line -->

---

## 9. What still fails, and what the criteria do not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 The end of the day

AC1 allows `end ≤ 1440` — a booking may end at 24:00. Can a user of your final page ask for
23:00–24:00? How — and if not, why is that acceptable or not? (This is the value you declare in
`submission.yml` under `assumptions.end_of_day`.)

-

### 9.3 Which "now"?

AC1 says "after the supplied current time". What did **v1** use as the current time, and what did
that mean for testing case T6?

-

---

## 10. Conclusion (120–180 words)

<!-- Answer all three, in your own words, without the assistant:
     (a) Which of your two predictions in section 2 was right, and what did v1 actually get wrong?
     (b) Which AI suggestion did you reject, or would have been wrong to accept, and why?
     (c) What is the difference between "the prototype looks finished" and "the prototype meets
         AC1-AC6" - shown with one case from section 4?
     Worthless: "Bolt made some mistakes and I fixed them."
     Worth everything: "T8 failed on v1: the Check button also added the booking to the list, so
     checking 11:00-12:00 a second time said Unavailable. AC5 says the check must not change the
     booking data." -->

<!-- Write your conclusion below this line -->
