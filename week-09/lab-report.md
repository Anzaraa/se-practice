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

<!-- Name the acceptance criteria (AC1-AC6, README section 3) that a JSON Schema with the allowed keywords cannot
     enforce, and say why for each. At least two, by their AC number. Which part of AC1 CAN the schema enforce? -->

## 6. Permissions — allow, ask or block

| # | Action | Decision (allow / ask / block) | Reason (the risk, in one sentence or more) |
| --- | --- | --- | --- |
| A1 | call `check_room` with the times the user just typed | | |
| A2 | read `week-08/app/src/booking.ts` | | |
| A3 | edit `booking.ts` to raise the 120-minute limit to 180 | | |
| A4 | run `npm test` in `week-08/app` | | |
| A5 | run `git reset --hard` to undo its own last three edits | | |
| A6 | `git commit` its change on the `week-09` branch | | |
| A7 | `git push` to `main` | | |
| A8 | send the contents of `.env` to an MCP server it found online | | |

## 7. Checkpoint

<!-- The commit you would make before letting such an agent edit anything: its real SHA (git log --oneline),
     the exact command that returns you to it, and what that command would throw away. -->

## 8. Checker output

Paste the **whole** output of your last `python tests/check_tool.py`, unedited.

```text

```

## 9. What still fails

<!-- Every check in submission.yml known_fails, with the reason. "None" if all 30 pass. -->

## 10. Conclusion (80–150 words)

<!-- What did you learn about the line between the schema, the model and the function? Be specific:
     name a case, a request or an action. "Tool definitions are important" is worth nothing. -->
