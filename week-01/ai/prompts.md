# AI Prompts Log - Week 01

## Step 1: Initial prompt

**Exact prompt typed:**
Build a small program that processes a list of student marks and prints:
average, highest, lowest, and pass rate.

## Step 2: Rocket's questions

1. "Who will be using this tool?"
-Just me, solo use(A personal tool only I run to process marks quickly)
-Teachers in a school(Multiple teachers each process their own class marks)
-Admin staff manages it(One admin processes marks on behalf of all teachers)
-Teachers and a supervisor(Teachers enter marks, a supervisor reviews the results)

## Step 3: My answers
1. Just me, solo use(A personal tool only I run to process marks quickly)

## Step 4: Rocket's rewritten/enhanced prompt
**Rocket Enhanced prompt (word for word):**
1. A personal web-based student marks processor where you can input a list of student marks and instantly see the computed statistics — average score, highest mark, lowest mark, and pass rate. The tool is designed for solo use with a clean, focused interface built around efficient data entry and clear results display.

Building with Next.js and TypeScript.

---

**What Rocket added on its own (never asked for in the original one-line prompt):**
- Chose a tech stack: Next.js + TypeScript (I never specified any language/framework)
- Built a full web UI instead of a simple console/script program
- Added an **adjustable pass threshold slider** (default 50) — the original
  prompt never mentioned a configurable threshold
- Added a **grade histogram chart** — not requested
- Added a **per-mark results table** — not requested
- Added **invalid-entry detection** — not requested (though useful, aligns
  loosely with Part 1's validation requirement, but I never mentioned it)
- Added a **sample data loader** button ("Load Sample Data", 20 sample marks)
- Added a **clipboard copy button** for results
- Restricted input to "Values must be 0–100" — Rocket assumed the same
  validation range as Part 1, even though I never stated this range anywhere
  in the one-line prompt
- Labeled the tool "Personal Tool" (tied to the earlier "Just me, solo use" answer)

---

## Step 4: App preview (Screenshot #3)

The built app shows:
- A text area to paste marks (comma, newline, or space separated)
- A "Pass Threshold" slider (0–100, default 50)
- A "Load Sample Data" button (20 sample marks)
- Live-updating result cards (average, highest, lowest, pass rate)


## Step 5: Testing with 4 test cases from Part 1

### Test case A
**Input:** 85, 23, 45, 90, 92
**Expected:** valid=5, avg=67.00, highest=92, lowest=23, pass rate=60.0%
**What Rocket's app printed:** valid=5, avg=67.0 (only 1 decimal, spec requires 2),
highest=92, lowest=23, pass rate=60.0%
**Match?** Mostly — all values correct, but average is displayed with only 1
decimal place instead of the required 2 (67.0 vs 67.00)

### Test case B
**Input:** 88, 47, -5, 101, abc, 73, 50, , 100
**Expected:** valid=5, avg=71.60, highest=100, lowest=47, pass rate=80.0%
**What Rocket's app printed:** valid=5 (3 invalid correctly skipped: -5, 101, abc),
avg=71.6 (only 1 decimal, spec requires 2), highest=100, lowest=47, pass rate=80.0%
**Match?** Mostly — validation logic is correct (correctly rejected -5, 101, and "abc"),
but average is displayed with only 1 decimal place instead of the required 2

### Test case C
**Input:** 10, 20, 30
**Expected:** valid=3, avg=20.00, highest=30, lowest=10, pass rate=0.0%
**What Rocket's app printed:** valid=3, avg=20.0 (only 1 decimal, spec requires 2),
highest=30, lowest=10, pass rate=0.0%
**Match?** Mostly — same recurring formatting bug: average always shows 1 decimal
instead of 2

### Test case D
**Input:** abc, , xyz
**Expected:** no valid marks — clear message, no crash
**What Rocket's app printed:** "No valid marks found" with a helpful hint message.
No crash, no NaN, no division-by-zero error.
**Match?** Yes — fully correct


## Step 6: Follow-up prompt (bug fix)

**Defect I chose to fix:**
Class average was displayed with only 1 decimal place (e.g. 67.0) instead of
the required 2 decimal places (e.g. 67.00), consistently across all test cases
with valid data (A, B, C).

**Follow-up prompt typed:**
The class average should be displayed with 2 decimal places (e.g. 67.00),
not 1 decimal place (e.g. 67.0). Please fix this.

**Rocket's response:**
"On it — updating the average to display with 2 decimal places now."
Rocket reported: "Fixed Class Average display to show 2 decimal places
(e.g. 67.00) instead of 1 (e.g. 67.0) in StatCards component."
\
**Result after fix:** Re-tested all three cases with valid data:
- Test A (85,23,45,90,92): average now shows 67.00 
- Test B (88,47,-5,101,abc,73,50,,100): average now shows 71.60 
- Test C (10,20,30): average now shows 20.00
Fix worked correctly.

**Did it break anything else?** No — re-checked total marks, highest, lowest,
passed/failed counts and pass rate for all three cases; all remained correct
after the fix. The fix was isolated to the display formatting only.