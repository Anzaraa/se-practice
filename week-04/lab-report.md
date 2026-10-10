# Week 04 — Lab report: Modeling the System with UML

> The single worksheet for this lab. Fill in every section. **Do not delete, rename or renumber
> the headings** — the checker and the grader find your work by them. Replace every `<...>`
> placeholder; a row that still contains `<...>` counts as empty.

---

## 1. Setup

| Field | Value |
| --- | --- |
| Name | Anzara Nurbek |
| Group | SE-Monday, 16:00-19:00  |
| AI assistant | Claude |
| Exact model | claude-sonnet-5 |
| Renderer | <PlantUML web server / VS Code extension / IntelliJ plugin / local jar> |
| Behaviour diagram | <sequence / activity / both> |
| Stories used | <my week-03 stories, revised / the reference set from README §3> |

---

## 2. Prompts as sent

Paste every prompt **exactly as you sent it**, in the order you sent it, one code block each. The
AI's first replies are saved as files in `models/original/` — do not paste them here.

### 2.1 Task 1 — use-case prompt

```text
<paste>
```

### 2.2 Task 2 — class prompt

```text
<paste>
```

### 2.3 Task 3 — behaviour prompt (3A sequence or 3B activity)

```text
<paste>
```

### 2.4 Focused correction prompts (if you sent any)

```text
<paste, or write "none">
```

### 2.5 Critique prompt

```text
<paste>
```

---

## 3. Task 1 — use-case review

**Assumptions the AI listed:** 

1) Student and Administrator are separate actors, no generalization; 
2) users are already identified, Login not modelled; 
3) "own" means the system knows who made each booking; 
4) confirmation is shown by the system, no external notification actor; 
5) Time is not an actor; 
6) Review usage is read-only; 
7) what happens to existing bookings on a blocked room is left unspecified.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | UC_Book "Book study room" | Name differs from the scenario and the Task 3 prompts, which call it "Book room"; the same goal would get two names across diagrams | Scenario sentence "book a room"; Task 3 "Book room" | Renamed to "Book room" (also "Study Room" removed from title and boundary) |
| 2 | Note on UC_Book, R2 line | Does not say whether touching bookings (12:00 end, 12:00 start) overlap; the scenario leaves this undecided and it must be declared | R2 | Added A1: end time is exclusive, touching bookings do not overlap |
| 3 | Assumption 7 / note on UC_Block | Leaves existing bookings on a blocked room "unspecified" instead of declaring a decision | R3, US-04 | Added A2 to the note: existing bookings are kept; R3 only stops new bookings |

---

## 4. Task 2 — class diagram review

### 4.1 Relationships, read both ways

One row per association in your **revised** class diagram.

| Association | Read left → right | Read right → left | Multiplicities |
| --- | --- | --- | --- |
| Student — Booking | one student makes 0..* bookings | each booking belongs to exactly 1 student | 1 / 0..* |
| Room — Booking | one room has 0..* bookings over time | each booking reserves exactly 1 room | 1 / 0..* |


### 4.2 Constraints the multiplicities cannot show

- R2: stated in `note right of Booking` — no two ACTIVE bookings of the same Room overlap in time; touching bookings do not overlap (A1).
- R1: also in the Booking note — startTime is in the future at creation and 0 < duration <= 2 h; a multiplicity cannot express a time range.
- R3: in the note on Room — if isBlocked is true, book() is rejected; this depends on an attribute value, not on how many links exist.


### 4.3 Assumptions

- A1: touching bookings (one ends at 12:00, the next starts at 12:00) do not overlap; the end time is exclusive, so two bookings overlap only when start1 < end2 and start2 < end1.
- A2: blocking a room keeps its existing bookings; R3 only stops new bookings, and nothing in the scenario says existing ones are cancelled.

### 4.4 Findings

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | `note left of Room` holding R2 | R2 was written on Room, but R2 is a constraint between Booking objects (active bookings of the same room must not overlap); the lab convention puts it on Booking | R2; README §4 convention | Moved the R2 lines into `note right of Booking` and added A1 there |
| 2 | `Booking.confirmationCode : String [0..1]` | [0..1] says a booking may exist without a confirmation, but a Booking exists only after successful creation and R4 says every successful booking produces a confirmation; it also contradicts the AI's own assumption | R4 | Removed [0..1]: `confirmationCode : String` |
| 3 | Diagram title "Study Room Booking" | Same system named differently from the revised use-case diagram ("Room Booking"); inconsistent names across diagrams | Scenario wording "book a room" | Changed the title to "Smart Campus - Room Booking" |

---

## 5. Task 3 — behaviour diagram review

**Option chosen and why:** <3A sequence / 3B activity — one sentence on why>

**Design components added beyond the domain model:** <name each one, e.g. `BookingService` —
what it does in one line; write "none" for an activity diagram>

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | <element> | <problem> | <rule or story> | <fix> |

---

## 6. AI critique

Run the critique prompt once, on all your revised diagrams together. At least **three** rows. A
critique is another claim to evaluate, not a verdict: reject what is wrong and say why.

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | <issue> | <element> | <accept / reject> | <your reason> |
| 2 | <issue> | <element> | <accept / reject> | <your reason> |
| 3 | <issue> | <element> | <accept / reject> | <your reason> |

---

## 7. Consistency table

One row for each of **R1–R4**, then one row for **every use case in your revised use-case
diagram**, spelled exactly as in the diagram, with the story ID it traces to.

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | <use case> | <classes and attributes> | <message, guard or decision> |
| R2 | <use case> | <classes, note> | <message, guard or decision> |
| R3 | <use case> | <classes and attributes> | <message, guard or decision> |
| R4 | <use case> | <classes> | <message or action> |
| <US-01> | <Book room> | <Student, Booking, Room> | <message or action> |

---

## 8. Change log

At least **three** rows, and at least one for each required diagram (use case, class, your
behaviour diagram). "Before" is what the AI produced; "After" is what you submitted.

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | <use case> | <before> | <after> | <rule, story or notation reason> |
| 2 | <class> | <before> | <after> | <reason> |
| 3 | <sequence / activity> | <before> | <after> | <reason> |

---

## 9. Checker output

Paste the complete output of `python tests/check_models.py`, then explain **every FAIL you are
keeping**. The same IDs go in `submission.yml` under `checker.kept_fails`. A FAIL you report and explain costs you nothing. One you hide costs the whole criterion.

```text
<paste the full output>
```

**FAILs I am keeping, and why:** <one line per check ID, or "none">

---

## 10. Conclusion (120–180 words)

<Which diagram did the AI get most wrong, and what exactly was wrong? Which error would have
reached the code if nobody had reviewed it? What did the critique find that you missed — and what
did it claim that was false? Be specific: "the AI got the multiplicities wrong" is worth nothing;
"the AI put 1..* on the Booking end, which says every room must already have a booking" is worth
everything.>
