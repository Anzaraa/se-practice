# AI Usage Disclosure — SIS #03

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched | Reused from |
| --- | --- | --- | --- | --- |
| Claude (claude.ai) | Claude Opus 5.5 | the plan (stage A) | report.md §11 B1 | week-05 |
| Claude (claude.ai) | Claude Opus 5.5 | Python v1 (stage B) | `code/original/booking_v1.py` | week-05 |
| Bolt.new | not displayed | web prototype v1 (stage B) | `web/original/` | week-06 |
| Claude (claude.ai) | Claude Opus 5.5 | critique (stage C) | report.md §8, §11 B5 | this SIS |
| Bolt.new | not displayed | repair (stage D) | `web/final/` (src/data.ts, src/App.tsx) | this SIS |
| Claude (separate helper chat) | Claude Opus 5.5 | process help: git commands, two new tests (T10, T11), formatting my §2 into tables, drafting §3, §6, §13 tables, checking against the checker | `code/test_booking.py` | this SIS |

**The assistant wrote, or helped write, my tests in `code/`:** yes
The 21 week-05 tests were written with a helper chat in week 05; in this SIS the helper added test_overlap_with_second_booking_is_rejected (T10) and test_same_check_twice_gives_same_answer (T11). I checked their expected values against AC4, AC5 and the T10/T11 rows of the brief, not against what the code returns.

**`code/original/` and `web/original/` hold the AI's first versions exactly as returned:** yes

**Every result in report.md section 5 was actually run or seen, not assumed:** yes

**Everything I submitted, I can explain and defend in class — including the overlap condition and what the agent did in section 9:** yes

**Anything I accepted from the AI without fully understanding it:** Nothing

Signed: Anzara Nurbek
Date: 2026-11-01