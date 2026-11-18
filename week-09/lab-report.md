# Week 09 — Lab Report: canBook as a Tool

**Name:** Anzara Nurbek
**Student ID:** 24B031941
**GitHub:** Anzaraa

---

## 1. Setup

| | |
| --- | --- |
| Assistant (frozen for the whole lab) | Claude |
| Exact model (or "not displayed") | Claude Opus 5.5 |
| Three fresh chats for R1, R2, R3? (yes / no) | yes |
| Python version (`python --version`) | Python 3.12.10 |

## 2. Your tool definition — a reason for every constraint

Paste your final `tool/check_room.json`, then fill the table: one row per constraint you wrote.

```json
{
  "name": "check_room",
  "description": "Checks whether one room can be booked for a requested time slot on the same day and answers Available or Unavailable. Every time is a whole number of minutes since midnight, from 0 to 1440 (10:00 = 600, 24:00 = 1440). This tool does not save, create or change a booking: it only checks.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "start": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested start, in minutes since midnight (10:00 = 600)."
      },
      "end": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested end, in minutes since midnight (24:00 = 1440)."
      },
      "now": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "The current time, in minutes since midnight."
      },
      "blocked": {
        "type": "boolean",
        "description": "true if the room is blocked (for example for maintenance), otherwise false."
      },
      "bookings": {
        "type": "array",
        "description": "Existing bookings of the room today. Use an empty list if there are none.",
        "items": {
          "type": "object",
          "properties": {
            "start": { "type": "integer", "minimum": 0, "maximum": 1440 },
            "end": { "type": "integer", "minimum": 0, "maximum": 1440 }
          },
          "required": ["start", "end"],
          "additionalProperties": false
        }
      }
    },
    "required": ["start", "end", "now", "blocked", "bookings"],
    "additionalProperties": false  }
}
```

| Field | Constraint (e.g. `"type": "integer"`, `"maximum": 1440`) | What goes wrong without it |
| --- | --- | --- |
| (root) | `"type": "object"` | The client could get a list or a bare number instead of named arguments. |
| (root) | `"required"`: all five fields | A model could leave out `now` (S04) and canBook would decide AC1 on missing data. |
| (root) | `"additionalProperties": false` | A model could invent `"room": "204"` (S05); it would be silently ignored, so the user thinks room 204 was checked. |
| start, end, now | `"type": "integer"` | `"11:00"` (S03) or `600.5` (S10) would reach canBook; a string compares as text and gives nonsense. |
| start, end, now | `"minimum": 0` | A negative time like `-30` (S06) is not a time on this day. |
| start, end, now | `"maximum": 1440` | `1500` (S07) would pass although a day has 1440 minutes; 1440 itself stays allowed for 24:00 (S11). |
| blocked | `"type": "boolean"` | The string `"false"` (S09) is truthy in JavaScript, so a free room would be treated as blocked. |
| bookings | `"type": "array"` + `items` object | A booking as a pair `[660, 720]` (S12) would have no `.start`/`.end`, so AC4 never sees the overlap. |
| bookings[] | `"required": ["start","end"]` | A booking with no end (S08) compares with `undefined` and counts as "no overlap". |
| bookings[] | `"additionalProperties": false` | Extra keys inside a booking would be ignored silently, same problem as S05. |
| bookings | no `minItems` (on purpose) | An empty list must be valid: "no bookings" (S02, R2). |

## 3. The twelve calls — first run and final run

Your **first** run's S verdicts (before any fix), and your final ones. For every case that changed,
say what you changed.

| Case | First run | Final run | What you changed |
| --- | --- | --- | --- |
| S01 | PASS | PASS | nothing |
| S02 | PASS | PASS | nothing |
| S03 | PASS | PASS | nothing |
| S04 | PASS | PASS | nothing |
| S05 | FAIL | PASS | Added `"additionalProperties": false` at the top level and inside `bookings.items`; the first draft did not forbid extra fields, so `room` was accepted. |
| S06 | PASS | PASS | nothing |
| S07 | PASS | PASS | nothing |
| S08 | PASS | PASS | nothing |
| S09 | PASS | PASS | nothing |
| S10 | PASS | PASS | nothing |
| S11 | PASS | PASS | nothing |
| S12 | PASS | PASS | nothing |

First run (my definition, before any fix):

```text
PASS  D1    tool/check_room.json exists and is valid JSON
PASS  D2    has name, description and inputSchema
PASS  D3    name is exactly "check_room"
PASS  D4    description: 25+ words, says minutes, 1440, and that it does not save
PASS  D5    inputSchema: an object with exactly the five fields, all required
PASS  D6    inputSchema uses only the keywords listed in README section 5
PASS  S01   the R1 call, valid -> accept
PASS  S02   no existing bookings: bookings = [] -> accept
PASS  S03   end as a string: "11:00" -> refuse
PASS  S04   now missing -> refuse
FAIL  S05   an extra field: "room": "204" -> refuse
             -> your schema accepted it
PASS  S06   start below the day: -30 -> refuse
PASS  S07   end beyond the day: 1500 -> refuse
PASS  S08   a booking with no end: {start: 660} -> refuse
PASS  S09   blocked as a string: "false" -> refuse
PASS  S10   start not a whole minute: 600.5 -> refuse
PASS  S11   end at the end of the day: 1440 -> accept
PASS  S12   a booking as a pair: [660, 720] -> refuse
```

First run: 1 S FAIL (S05). Final run: 0.

## 4. Function calling — what the model wrote

For each request, paste the model's reply exactly, then judge it against the request.

### R1

```text
{"name": "check_room", "arguments": {"start": 600, "end": 660, "now": 540, "blocked": false, "bookings": [{"start": 660, "end": 720}]}}
```
Match: yes, F1-F3 PASS. Every time was converted correctly (9:00 = 540, 10:00 = 600, 11:00 = 660, 12:00 = 720).
The existing booking 660-720 touches the request at 660; the model passed it through as it is and did not decide
anything itself. Whether touching is allowed (AC4) is canBook's job, and canBook will answer Available.

### R2

```text
{"name": "check_room", "arguments": {"start": 840, "end": 990, "now": 810, "blocked": true, "bookings": []}}
```

Match: yes, F4-F6 PASS. 16:30 was converted correctly to 990 (not 960). The model **did call** the tool, although
the room is blocked and the request is 150 minutes long. It did not refuse or answer "Unavailable" itself, which
is right: the schema accepts this call because every value is valid, and only canBook rejects it (AC3 blocked,
AC2 more than 120 minutes). It also correctly used an empty list for "no other bookings".

### R3

```text
What exact start and end time do you want tomorrow (for example 14:00-16:00)? Also, is the room blocked, and what bookings does it already have? Note that this tool only checks slots on the same day, so it can't check tomorrow until tomorrow.
```
Result: the model **asked** (saved as calls/r3.txt) and invented no values.
- Missing information: an exact start and end ("afternoon" and "a couple of hours" are not minutes), `now`,
  `blocked`, `bookings`, and the day itself: "tomorrow" cannot be expressed at all, because the schema has no date field.
- What it did well: it did not guess numbers such as 780-900, and it used the description ("on the same day")
  to notice that the tool cannot check tomorrow.
- What it did not follow: the prompt asked for "one short question", but it asked three questions in one message
  and added an explanation. It also did not ask for `now`, which is required too.

## 5. What the schema cannot check

The allowed keywords check each value on its own (type, range, which keys exist). None of them can compare two
fields with each other, and none of them can see what the function does after the call. So these stay in canBook:

- **AC1 (partly)**: `start < end` and "start after `now`" compare two fields. `{"start": 600, "end": 600}` is a valid
  call against my schema. What the schema CAN enforce of AC1 is the per-value part: every time is a whole number
  and 0 <= value <= 1440 (S06, S07, S10, S11).
- **AC2** (at most 120 minutes) needs `end - start`, arithmetic across two fields. R2 (840 -> 990, 150 minutes)
  passed the schema; only canBook says it is too long.
- **AC3** (not when blocked): the schema can only say `blocked` is a boolean. Both true and false are legal inputs;
  deciding that true means Unavailable is the function's logic (R2).
- **AC4** (no overlap, touching allowed) compares the request with every booking. `items` checks each booking
  alone and cannot see the top-level `start`/`end`. In R1 the booking touches at 660; only canBook knows that is allowed.
- **AC5** (does not save anything) is about behaviour, not input. The description can only promise it; canBook and
  its tests must keep the promise.
- **AC6** (the page's feedback) belongs to the UI, which a tool call never reaches.

## 6. Permissions — allow, ask or block

| A1 | call `check_room` with the times the user just typed | allow | It is read-only (AC5: it saves nothing) and the schema refuses malformed arguments, so the worst case is a wrong answer from a mis-converted time, which the user sees. |
| A2 | read `week-08/app/src/booking.ts` | allow | Reading my own source code changes nothing and the file holds no secrets; the only risk is that the code enters the model's context, which is fine for course code. |
| A3 | edit `booking.ts` to raise the 120-minute limit to 180 | block | It silently changes a business rule (AC2) for every user because one user asked for 3 hours; a user's request is not authority to change a requirement. |
| A4 | run `npm test` in `week-08/app` | allow | It runs tests I wrote and reviewed in Week 08 and only prints results; the risk is that `npm test` runs whatever package.json says, so it stays allow only while that file is unchanged. |
| A5 | run `git reset --hard` to undo its own last three edits | ask | `reset --hard` does not undo only the agent's edits: it deletes all uncommitted changes in the working tree, mine too, with no undo, so I must check `git status` first. |
| A6 | `git commit` its change on the `week-09` branch | allow | A commit on my feature branch is local and reversible (back to the checkpoint in section 7); I still review the diff before pushing because it ends up in the graded PR. |
| A7 | `git push` to `main` | block | It skips the pull-request review and publishes to the branch the course grades (the PR must stay open, never merged); a pushed commit cannot be cleanly taken back. |
| A8 | send the contents of `.env` to an MCP server it found online | block | It sends secrets (API keys, passwords) to an unknown third party, which cannot be undone; "to configure it" is a typical prompt-injection excuse. |

## 7. Checkpoint

Before letting the agent edit anything I commit everything on `week-09`. My checkpoint is the commit
with the report sections 1-4: `ab5051f` (from `git log --oneline`).

Command that returns me to it:

```bash
git reset --hard ab5051f
```

What it throws away: every commit on `week-09` made after the checkpoint (they stay reachable only through
`git reflog` for a while), and every uncommitted change to tracked files, mine as well as the agent's, with no undo.
New untracked files the agent created are NOT removed (that needs `git clean -fd`). It also does not undo anything
already pushed to GitHub.

## 8. Checker output

Paste the **whole** output of your last `python tests/check_tool.py`, unedited.

```text
$ python tests/check_tool.py
PASS  D1    tool/check_room.json exists and is valid JSON
PASS  D2    has name, description and inputSchema
PASS  D3    name is exactly "check_room"
PASS  D4    description: 25+ words, says minutes, 1440, and that it does not save
PASS  D5    inputSchema: an object with exactly the five fields, all required
PASS  D6    inputSchema uses only the keywords listed in README section 5
PASS  S01   the R1 call, valid -> accept
PASS  S02   no existing bookings: bookings = [] -> accept
PASS  S03   end as a string: "11:00" -> refuse
PASS  S04   now missing -> refuse
PASS  S05   an extra field: "room": "204" -> refuse
PASS  S06   start below the day: -30 -> refuse
PASS  S07   end beyond the day: 1500 -> refuse
PASS  S08   a booking with no end: {start: 660} -> refuse
PASS  S09   blocked as a string: "false" -> refuse
PASS  S10   start not a whole minute: 600.5 -> refuse
PASS  S11   end at the end of the day: 1440 -> accept
PASS  S12   a booking as a pair: [660, 720] -> refuse
PASS  F1    calls\r1.json: a call to check_room
PASS  F2    calls\r1.json: arguments valid against your schema
PASS  F3    calls\r1.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F4    calls\r2.json: a call to check_room
PASS  F5    calls\r2.json: arguments valid against your schema
PASS  F6    calls\r2.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F7    calls/r3: exactly one of r3.json (it called) or r3.txt (it asked), not empty
PASS  L1    section 5 names at least two acceptance criteria (AC1-AC6) the schema cannot check
PASS  L2    section 6: A1-A8 each have allow / ask / block and a reason of 5+ words
PASS  L3    section 7 names the checkpoint commit (a SHA)
PASS  L4    section 10: a conclusion of 80-150 words
PASS  L5    AI_USAGE.md filled in (a tool row, and signed)

SUMMARY: 30 PASS · 0 FAIL · 0 ERROR  (of 30 checks)
Paste this whole output into lab-report.md section 8, and these three numbers into submission.yml.

```

## 9. What still fails

- None. All 30 checks pass at the last run.

## 10. Conclusion (80–150 words)

The schema catches the shape of a call: types, required fields and ranges. In S05 it refused "room": "204" because additionalProperties is false, and in S03 and S10 it refused "11:00" and 600.5 because times must be whole minutes between 0 and 1440. Only the function catches the booking rules. The R2 call was valid against the schema, but a 150-minute booking of a blocked room is a “no” that only canBook gives (AC2, AC3). The schema also cannot compare start with end or with existing bookings. In R3 the model asked for the missing time instead of inventing numbers. For the agent I chose ask for A5 because git reset --hard deletes all uncommitted changes in the working tree, mine too, not just the agent’s edits, so a wrong guess there would lose my work with no undo.