# AI Usage Disclosure — Week 06

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Bolt.new | Bolt Agent: Standard, free plan | prototype v1 (Task 2) | `original/project/` — all files |
| Bolt.new | Bolt Agent: Standard, free plan | cleanup prompts (Task 4) | `prototype/project/src/App.tsx`, `src/data.ts`, `src/availability.ts`, `package.json` |
| Claude, claude-opus-5-5 | chat assistant | formatting AC1–AC6 into Prompt 1; reading Bolt's code and pointing out issues (device clock, missing 10:00–11:00 room, unused `@supabase/supabase-js`); checking facts in my §8–§10 drafts; | `lab-report.md`, `submission.yml` |

**I used another assistant as well (to explain code, to draft text in lab-report.md, …):** yes
Claude (claude-opus-5-5): guided the steps, the table rows in §5–§7 from my own test runs, and checked the facts in my §8, §9.2, §9.3. It did not run the page and did not make any screenshot — every test result and screenshot is from my own runs in Bolt's preview.

**`original/` holds Bolt's first version exactly as downloaded, and `evidence/v1.png` shows it:** yes / no

**Every screenshot in `evidence/` is an unedited capture of the page as it behaved:** yes

**I can explain the component I chose in lab-report.md section 8 — and how the page decides
availability — without the assistant:** yes

**Anything I accepted from the AI without fully understanding it:**
The Tailwind CSS class names in `src/App.tsx` (layout and colours) and the changes Bolt made to `package-lock.json` when it removed `@supabase/supabase-js` — I did not read them line by line; I checked them only by testing the page (T1–T9, including T9 at phone width). The decision logic in `src/availability.ts` I read and can explain (§8).

Signed: Anzara Nurbek
Date: 2026-10-14
