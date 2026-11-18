# AI Usage Disclosure — Week 09

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude | Claude Opus 5.5 | Part 2 — writing the calls for R1, R2, R3 | calls/ (saved by me, unedited) |
| Claude | Claude Opus 5.5 | Drafted tool/check_room.json, explained the checks | tool/check_room.json, submission.yml |

**I wrote `tool/check_room.json` myself:** no
Claude wrote the first draft. I pasted it and ran the checker myself: the first run failed S05, recorded in lab-report.md section 3. I added the fix in two places and re-ran until S01-S12 passed. I checked every constraint against README section 3. 

**I used an AI to explain a JSON Schema keyword or a check:** yes
`additionalProperties` (why S05 was accepted without it), and why `items` cannot compare a booking with the top-level start/end 

**Every reply in `calls/` and in lab-report.md section 4 is exactly what the model returned:** yes

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes

**Anything I accepted from the AI without fully understanding it:**
- the git reflog part of section 7

Signed: Anzara Nurbek
Date: 2026-11-18
