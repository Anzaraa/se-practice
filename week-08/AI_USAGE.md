# AI Usage Disclosure — Week 08

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude (claude.ai), bug-detector switched off | <model> | diagnosis without the skill (Task 4) | none — "Do not edit code" |
| Claude (claude.ai), bug-detector enabled | <model> | diagnosis with bug-detector (Task 5) | none — "Do not edit code" |
| Claude (separate chat) | Claude Opus 5.5 | step-by-step guidance through Parts 0–8; wrote the code of the BUG-A and BUG-B regression tests; checked my §3 hypotheses and both chat answers against the code; drafted the wording of §3 and §7, and suggested factual corrections to §9.2 and §10 | app/src/booking.test.ts (the two regression tests, pasted and run by me); lab-report.md §3, §6 |

**`skills/bug-detector/SKILL.md` was typed by me from the deck's text, not generated:** yes

**I applied the patches myself, one minimal change per bug, after reviewing what the assistant
proposed:** yes
Both one-line changes in app/src/booking.ts were made by me in VS Code and checked with git diff before each commit. No assistant edited app/ directly.

**I used another assistant as well (to explain a failure, to draft text in lab-report.md, …):** yes
Claude Opus 5.5 in a separate chat: guidance through the lab, review of both diagnoses, drafts of §3 and §6, corrections to §9.2.

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes

**I can explain both bugs and both fixes — which line, why it was wrong, which test proves the
fix — without the assistant:** yes

**Anything I accepted from the AI without fully understanding it:**
none


Signed: Anzara Nurbek
Date: 2026-11-14
