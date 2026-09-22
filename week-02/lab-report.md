# Lab report — Practice #02: The Prompt Is an Engineering Input

**Name:** Anzara Nurbek
**Group:** SE-16:00-19:00, Monday
**Date:** 22.09.2026

---

## 1. The frozen experiment

| | |
| --- | --- |
| AI assistant | Claude |
| Exact model name | Claude Sonnet 5 |
| Implementation language | Python |
| Date of the runs | 22.09.2026 |

**Non-Python students only** — paste your substituted Prompt B text here, so the substitution can
be checked: n/a — used Python



**Confirmations:**

- Each prompt was sent in a **fresh chat**: yes
- No follow-up questions were asked before Part 7: yes
- Every output was saved **before** any editing: yes

---

## 2. Prompt A — minimal

**Prompt sent** (should be exactly one sentence):
```
Write Python code to analyze student marks.
```


**Assumptions the AI made that I never gave it** — list them, one per line. A data format, a pass
threshold, a rounding rule, an input method, an invented feature all count.

1. Data format — a dictionary of {student_name: [marks]} instead of a flat list of numbers
2. Pass threshold — hardcoded avg >= 60 instead of a configurable pass_mark
3. Added a letter-grade system (A/B/C/D/F) that was never requested
4. Added standard deviation calculation, not requested
5. Added a full console report / ranking / print formatting — a CLI feature, not requested
6. Hardcoded fake sample data for 5 students instead of a general-purpose function

**Questions it should have asked and did not:**

1. Should this analyze one student or a group?
2. What counts as a passing mark?

**Is the function named `analyze_marks` with the required signature?**  no — it's called `analyze_students(data)`, taking a dict, not `analyze_marks(marks, pass_mark=50)`

**First impression before testing** (one sentence — you will compare this with section 6 later):

- looked like reasonable, well-structured code, but solved a different problem than the one specified.

## 3. Prompt B — structured context

**Prompt sent** (paste it in full, including any substitutions):

```

You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return average, highest, lowest, and pass_rate in a dictionary. Accept marks from 0 to 100; raise ValueError for an empty list, non-numeric values, or out-of-range values. Use no external libraries. Return code plus a short

```



**What B fixed compared to A:**

1. Function is correctly named analyze_marks(marks, pass_mark=50) — exact signature from spec
2. Returns exactly the four required keys (average, highest, lowest, pass_rate) with no extra fields, and includes full validation: an empty list, non-numeric values (explicitly rejecting bool, which is a subclass of int in Python), and out-of-range values all raise ValueError.


**What B still leaves open:**

1. No rounding of pass_rate — returns raw 66.66666666666666 instead of 66.67; only passes because the harness tolerance is 0.01
2. No self-written tests — only a manual usage example under __main__

---

## 4. Prompt C — examples and tests

**What I appended to Prompt B:**
```

Example: analyze_marks([40, 60, 80], 50) → average 60, highest 80, lowest 40,
pass_rate 66.67. Include tests for: one mark, decimals, custom pass_mark, empty list,
text value, and marks below 0 or above 100. State any remaining assumptions before
the code.
```


**Tests the AI wrote for itself** — how many, and which situations do they cover?

| Situation | Covered by the AI's tests? |
| --- | --- |
| one mark | yes |
| decimals | yes |
| custom pass_mark | yes |
| empty list | yes |
| text value | yes |
| below 0 / above 100 | yes(both directions tested separately) |

**Do the AI's own tests pass against the AI's own code?** yes

**Do they agree with the harness in section 6?** yes - same 6/6 PASS result independently confirmed

**Assumptions C stated explicitly before the code:**
- marks must be a list (or other iterable) of int/float; bool is rejected even though bool is technically a subclass of int in Python, since a True/False mark doesn't make sense.
- "Non-numeric" means anything that isn't int/float (e.g., strings, None, lists).
- Marks must satisfy 0 <= mark <= 100; anything outside raises ValueError.
- pass_rate is the percentage (0–100) of marks that are >= pass_mark, rounded to 2 decimal places. average, highest, lowest are also rounded to 2 decimal places for consistent output.
- pass_mark itself is not validated against 0–100 (caller's responsibility) unless you'd like that added.
---

## 5. Prompt D — my combined prompt

**The complete prompt I wrote** (one message, sent to a fresh chat):

```
You are a Python developer. Implement a function `analyze_marks(marks, pass_mark=50)` that analyzes a list of student marks.
Requirements:

* `marks` must be a non-empty list.
* Every mark must be numeric (`int` or `float`) and must be between 0 and 100 inclusive.
* Boolean values must not be accepted as marks.
* Raise `ValueError` for an empty list, a non-numeric value, or a mark below 0 or above 100.
* `pass_mark` is the minimum mark required to pass and should be inclusive (`mark >= pass_mark`).
* Return a dictionary with exactly these four keys: `average`, `highest`, `lowest`, and `pass_rate`.
* `average` is the arithmetic mean of all marks.
* `highest` is the maximum mark.
* `lowest` is the minimum mark.
* `pass_rate` is the percentage of marks that are greater than or equal to `pass_mark`.
* Round `average` and `pass_rate` to 2 decimal places. Do not unnecessarily change the original `highest` and `lowest` values.
* Use only standard Python; do not use external libraries.

The function must satisfy these examples:
`analyze_marks([40, 60, 80], 50)` should return:
`{"average": 60.0, "highest": 80, "lowest": 40, "pass_rate": 66.67}`
Also make sure these cases work:

1. `analyze_marks([100], 50)` → `{"average": 100, "highest": 100, "lowest": 100, "pass_rate": 100.0}`
2. `analyze_marks([49.5, 50], 50)` → `{"average": 49.75, "highest": 50, "lowest": 49.5, "pass_rate": 50.0}`
3. `analyze_marks([30, 45, 60, 90], 60)` → `pass_rate` should be `50.0`
4. `analyze_marks([])` → raise `ValueError`
5. `analyze_marks([40, "60"])` → raise `ValueError`
6. `analyze_marks([-1, 50, 101])` → raise `ValueError`

Include short tests covering a single mark, decimal marks, a custom `pass_mark`, an empty list, a text value, and marks outside the 0–100 range.
Return the complete Python code first, followed by a short explanation of the implementation and any remaining assumptions.

```

**What I deliberately added that A, B and C did not have:**

1. An explicit instruction that average and pass_rate must be rounded to exactly 2 decimal places — this directly targets the rounding ambiguity (raw 66.666...7 vs. the spec's printed 66.67) that Prompt B left unresolved.
2. An explicit rule that boolean values must not be accepted as marks, even though bool is technically a subclass of int in Python — closes a hidden edge case that neither the B nor the C prompt text mentioned.
3. An additional, concrete required test case (analyze_marks([30, 45, 60, 90], 60) → pass_rate must equal 50.0) that verifies custom pass_mark behaviour against an exact expected number.

**The ambiguity I found in the specification, and how I resolved it inside Prompt D:**
The specification does not clearly say how to round the average and pass rate. For example, one test gives a pass rate of 66.67% for 2 out of 3 students, but the exact rounding rule is not explained. To avoid this problem, I added a clear instruction to Prompt D: “Round average and pass_rate to 2 decimal places.” This made the program return 66.67, 100.0, 49.75, and 50.0, which matches the examples in the specification.
---

## 6. Test results — the evidence

Six cases × four prompts. Verdicts are **PASS**, **FAIL** or **ERROR** only.

| # | Call | Required | A | B | C | D |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | ERROR | PASS | PASS | PASS |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | ERROR | PASS | PASS | PASS |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | ERROR | PASS | PASS | PASS |
| 4 | `analyze_marks([], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| | **Totals** | | 0/6 | 6/6 | 6/6 | 6/6 |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt | Case | What actually happened |
| --- | --- | --- |
| A | 1-6 | function analyze_students(data) found instead of analyze_marks — harness cannot even load it, all 6 counted as ERROR |

### Pasted terminal output — all four runs


**Prompt A**

```
ERROR: week-02\code\prompt_a.py defines no callable named 'analyze_marks'.
All six cases count as ERROR. Record that in lab-report.md.
```

**Prompt B**

```
analyze_marks harness — week-02/code/prompt_b.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.66666666666666
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks list cannot be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: non-numeric mark found: '60'
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: mark out of range (0-100): -1
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (week-02/code/prompt_b.py)
```

**Prompt C**

```
analyze_marks harness — week-02/code/prompt_c.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks list cannot be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: non-numeric mark found: '60'
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: mark out of range (0-100): -1
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (week-02/code/prompt_c.py)
```

**Prompt D**

```
analyze_marks harness — week-02/code/prompt_d.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks must be a non-empty list.
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: Invalid mark: '60'. Marks must be int or float.
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: Invalid mark: -1. Marks must be between 0 and 100.
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (week-02/code/prompt_d.py)
```

---

## 7. Scoring

0–2 per criterion, using the rubric in `README.md` Part 7.

| Criterion | A | B | C | D |
| --- | --- | --- | --- | --- |
| Correctness (cases passed) | 0 | 2 | 2 | 2 |
| Requirement coverage | 0 | 2 | 2 | 2 |
| Verifiability (tests) | 0 | 0 | 2 | 2 |
| Assumptions stated | 0 | 1 | 1 | 2 |
| Noise (2 = none) | 0 | 2 | 2 | 1 |
| **Total / 10** | **0** | **7** | **9** | **9** |

**Prompt length, in words:** A = 7 words · B = 44 words · C = 84 words · D = 220 words

**Words added per point gained** — B over A, C over B, D over C. One line on what that ratio says:
B over A: +37 words for +7 points (≈5.3 words/point). C over B: +40 words for +2 points (≈20 words/point). D over C: +136 words for +0 points on the 10-point scale (both already at 9), though D closed a real correctness risk (the rounding ambiguity) that C only happened to fix by its own choice rather than by explicit instruction — B's naming-and-signature fix was by far the highest-leverage change; everything after B bought reliability and reproducibility, not raw PASS count.

---

## 8. Conclusion — 150–200 words

Answer in this order: (1) which prompt scored best, and whether it is the one you would actually
use at work; (2) which single addition bought the most correctness, naming the exact case that
changed verdict; (3) what was pure noise; (4) the ambiguity and your resolution.

Name test cases and real returned values. "More detailed prompts work better" scores zero.

```
(150–200 words)

Prompt B gave the best result for how little it asked for. It scored 7/10 and was the first prompt to pass all six tests, right away. Prompt A just failed completely — the AI wrote a function called analyze_students(data) instead of analyze_marks(marks, pass_mark=50), so my test script couldn't even find the right function to test. That's why A scored 0/6.

The biggest jump in correctness came from Prompt B alone. Just by giving the exact function name, the four keys it had to return, and the validation rules, it went from 0/6 straight to 6/6 in one step. Nothing after that fixed anything new — it just made things more solid.

Prompt C and D both wrote their own tests, and those tests passed — but that's not really proof of anything, since the AI was just checking its own code against itself. My own test script backed them up, so at least they weren't lying, but they didn't add any correctness on top of what B already had.

The real gap I found: the example says pass_rate should show as 66.67, but nothing says to round it. Prompt B returned 66.66666666666666 instead, and it only passed because the testscript allows a small margin of error. I fixed this in Prompt D by directly telling it to round the numbers to 2 decimal places.

If I had to actually use one of these at work, I'd pick D — it's correct because I told it
to be, not because it got lucky.

```

**Word count:** 197

---

## 9. Two questions for the debrief

Written before class, answered in class.

1. Prompt B passed all six tests, but only because the test script allows small rounding differences. If the test script didn't allow that, would B actually still pass, or did it just get lucky?
2. Prompt C and Prompt D both got the same score (9/10). But C only rounded the numbers correctly by accident — I never told it to round anything. D got the same correct result because I specifically told it to round the numbers. Since D did it on purpose and C just got lucky, should D get a higher score than C?
 
