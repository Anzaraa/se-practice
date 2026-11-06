# AI Usage Disclosure — Week 07

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude | Claude Opus 5.5 | the first test suite (Task 3) | suites/first/booking.test.ts |
| Claude | Claude Opus 5.5 | the improvement prompt (Task 5) | answer in lab-report.md 6.2 |
| Claude (claude.ai, separate helper chat) | Claude Opus 5.5 | step-by-step guidance, canBook extraction code, review rows in §5, final suite, drafts for §8 and §9 | app/src/booking.ts, app/src/App.tsx, app/src/booking.test.ts, lab-report.md |

**I used an assistant to extract `canBook` (Task 1), or to fix a defect in it:** yes
Claude (helper chat) wrote the code of src/booking.ts and the change in App.tsx (canBook gives the decision, checkAvailability still gives the messages). I checked in the browser that 11:00–12:00 stayed Available and 10:30–11:30 and 11:00–13:30 stayed Unavailable for Drew Hall 105. The later fix `if (start < 0) return false;` in src/booking.ts came from the improvement answer (B4); after it all 29 tests passed and the page behaved the same.

**I used another assistant as well (to explain a failure, to draft text in lab-report.md, …):** yes
Claude Opus 5.5 in a separate helper chat: step-by-step instructions, review rows in section 5, assembling the final suite app/src/booking.test.ts by the checker rules, and drafts for sections 8 and 9. I checked and edited them; section 3 reasons and section 10 are my own.

**`suites/first/` holds the assistant's first test file exactly as it generated it:** yes

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes

**I can explain every test in my final suite — its input, its expected result and the AC behind
it — without the assistant:** yes

**Anything I accepted from the AI without fully understanding it:**
app/src/booking.test.ts, the AC5 test with Object.freeze on unsorted bookings: I understand that it fails if canBook changes the array, but I did not write such a mutation myself to see it fail.

Signed: Anzara Nurbek
Date: 04-11-2026
