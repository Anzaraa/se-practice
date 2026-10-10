# Week 04 — Lab report: Modeling the System with UML

---

## 1. Setup

| Field | Value |
| --- | --- |
| Name | Anzara Nurbek |
| Group | SE-Monday, 16:00-19:00  |
| AI assistant | Claude |
| Exact model | claude-sonnet-5 |
| Renderer | PlantUML web server |
| Behaviour diagram | activity |
| Stories used | the reference set from README §3> |

---

## 2. Prompts as sent

Paste every prompt **exactly as you sent it**, in the order you sent it, one code block each. The
AI's first replies are saved as files in `models/original/` — do not paste them here.

### 2.1 Task 1 — use-case prompt

```text
Using the supplied scenario and approved stories, generate PlantUML for a use-case diagram. Include Student and Administrator outside a named system boundary. Model their goals, show justified associations, and list assumptions. Use include or extend only with a clear reason.
```

### 2.2 Task 2 — class prompt

```text
Create a UML domain class diagram in PlantUML for Smart Campus. Start with Student, Room, and Booking. Add attributes, appropriate operations, and association multiplicities. Add other classes only when requirements justify them. Explain each relationship and list assumptions. Avoid unjustified inheritance or composition.
```

### 2.3 Task 3 — behaviour prompt (3A sequence or 3B activity)

```text
Generate a UML activity diagram in PlantUML for Book room. Show the initial node, actions, guarded decisions, and final nodes. Check the time range, blocked-room status, and overlapping bookings. Show confirmation after success and rejection after failure. Use branches rather than parallel paths unless concurrency is required.
```

### 2.4 Focused correction prompts (if you sent any)

```text
none
```

### 2.5 Critique prompt

```text
Compare my diagrams with the requirements. Identify missing rules, inconsistent names, and unjustified elements. Cite each issue and propose a specific correction.
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

**Option chosen and why:** 3B activity — the task is one workflow with three sequential rule checks, and an activity diagram shows each check as its own decision with labelled guards.

**Design components added beyond the domain model:** none — the activity diagram uses only the Student and System swimlanes; no service or repository classes.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Decisions "Time range valid?", "Room blocked?", "Overlaps an ACTIVE booking of this room?" | None of the three decisions names the rule it checks; R1–R3 appear only in the rejection actions, so the reader cannot see from the decision which rule is tested | R1, R2, R3; README §4 convention `if (Room blocked? (R3))` | Added (R1), (R3) and (R2) to the three decision conditions |
| 2 | Diagram title "Book study room (US-01)" | Use case is called "Book room" in the revised use-case diagram and in the Task 3 prompt; the same goal had two names | US-01; Task 3 prompt "Book room" | Changed the title to "Book room (US-01)" |
| 3 | R2 decision "Overlaps an ACTIVE booking of this room?" | Does not say whether touching bookings (12:00 end, 12:00 start) count as overlapping; the scenario leaves this undecided | R2 | Added a note with A1: touching bookings do not overlap |

---

## 6. AI critique

Run the critique prompt once, on all your revised diagrams together. At least **three** rows. A
critique is another claim to evaluate, not a verdict: reject what is wrong and say why.

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | Story source is still a placeholder | `approved-stories.md`, "Source of this set" line | accept | It was still `<...>`; set it to "the reference set", matching §1 |
| 2 | Room note names only R3 as a reason for book() to reject | class diagram, Room note "R3: if isBlocked, book() is rejected" | accept | The activity diagram rejects on R1, R3 and R2; the class note now says book() also rejects on R1 and R2, so the two diagrams agree |
| 3 | R2 should move from Booking to Room | class diagram, `note right of Booking` | reject | The lab convention (README §4) requires R2 in a note on Booking; a multiplicity cannot show it and the note is where it was placed on purpose |
| 4 | Use case labels should show story IDs (US-0x) again | use-case diagram, e.g. `usecase "Book room"` | reject | IDs were removed on purpose so §7 can spell each use case exactly as in the diagram; tracing to stories is done in §7 |
| 5 | Stories file has broken encoding | `approved-stories.md` title and Rules column | reject | The file is UTF-8 and shows — and § correctly in the editor; the garbled characters came from copying the text to the clipboard with `clip`, not from the file |

---

## 7. Consistency table

One row for each of **R1–R4**, then one row for **every use case in your revised use-case
diagram**, spelled exactly as in the diagram, with the story ID it traces to.

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | Book room | Booking.startTime, Booking.endTime, /duration; note on Booking | decision "Time range valid? (R1)" → [no] "invalid time range" (R1) |
| R2 | Book room | Booking.status (ACTIVE), Booking.overlaps(); R2 note on Booking with A1 | decision "Overlaps an ACTIVE booking of this room? (R2)" → [yes] "slot already booked" (R2) |
| R3 | Book room | Room.isBlocked, Room.book(); note on Room | decision "Room blocked? (R3)" → [yes] "room is blocked" (R3) |
| R4 | Book room | Booking.confirmationCode | actions "Generate confirmation code" → "Receive booking confirmation" |
| US-01 | Book room | Student, Room, Booking; Room.book() | the whole activity diagram: three checks, then "Create booking (status = ACTIVE)" |
| US-02 | View room availability | Room.isAvailable(start, end), Room.isBlocked, Booking.status | not modelled in the activity diagram (only Book room is) |
| US-03 | Cancel own booking | Booking.cancel(requester : Student), BookingStatus.CANCELLED | not modelled in the activity diagram (only Book room is) |
| US-04 | Block room | Room.block(), Room.isBlocked; A2 in note on Room | not modelled in the activity diagram (only Book room is) |
| US-05 | Unblock room | Room.unblock(), Room.isBlocked | not modelled in the activity diagram (only Book room is) |
| US-06 | Review room usage | Room.getBookings(from, to), Booking | not modelled in the activity diagram (only Book room is) |

---

## 8. Change log

At least **three** rows, and at least one for each required diagram (use case, class, your
behaviour diagram). "Before" is what the AI produced; "After" is what you submitted.
| 1 | use case | "Book study room", title and boundary "Study Room Booking" | "Book room", "Room Booking" | Scenario and Task 3 call it "Book room"; one name across all diagrams |
| 2 | use case | Use case labels with "\n(US-0x)"; R2 note silent on touching bookings; existing bookings on a blocked room "unspecified" | Plain labels; A1 added to the Book room note, A2 added to the Block room note | §7 must spell use cases exactly; A1 and A2 declared instead of left open (R2, R3) |
| 3 | class | R2 in `note left of Room` | R2 with A1 in `note right of Booking` | README §4 convention: R2 is a note on Booking |
| 4 | class | `confirmationCode : String [0..1]` | `confirmationCode : String` | R4: every successful booking has a confirmation, and a Booking exists only after success |
| 5 | class | Room note named only R3 as a reason for book() to reject | Room note also names R1 and R2 | Accepted critique issue 2 (§6): class and activity diagrams must agree |
| 6 | activity | Decisions "Time range valid?", "Room blocked?", "Overlaps an ACTIVE booking of this room?" with no rule IDs | (R1), (R3), (R2) added to the decisions; A1 note added; title "Book room" | Each decision traces to its rule; A1 declared; consistent naming |
---

## 9. Checker output

Paste the complete output of `python tests/check_models.py`, then explain **every FAIL you are
keeping**. The same IDs go in `submission.yml` under `checker.kept_fails`. A FAIL you report and explain costs you nothing. One you hide costs the whole criterion.

```text
Week 04 structural check - shape only, never quality

UC1  PASS  Student and Administrator declared
UC2  PASS  named system boundary: "Smart Campus Room Booking System"
UC3  PASS  all actors declared outside the boundary
UC4  PASS  all scenario goals present (6 use cases)
UC5  PASS  no actor is associated with a confirmation use case
UC6  PASS  actor responsibilities match the scenario
UC7  PASS  use cases are goals, not screens or components
UC8  PASS  every include / extend / generalization carries a ' why: comment (or there are none)
UC9  PASS  revised diagram differs from the AI's original
CL1  PASS  Student, Room and Booking present
CL2  PASS  Booking is associated with Student and with Room
CL3  PASS  every association has multiplicities at both ends
CL4  PASS  1 student / 1 room per booking, 0..* bookings per student and per room
CL5  PASS  every inheritance / composition / aggregation carries a ' why: comment (or there are none)
CL6  PASS  only domain concepts in the class diagram
CL7  PASS  attributes needed by R1-R3 are present
CL8  PASS  a note states R2 (no overlapping active bookings)
AC1  PASS  initial and final nodes present
AC2  PASS  separate decisions check R1, R3 and R2 (3 decisions)
AC3  PASS  every branch has a labelled guard
AC4  PASS  no parallel paths
AC5  PASS  confirmation on success, rejection on failure
AC6  PASS  creation comes after all rule checks
FI1  PASS  the AI's original output is kept for every diagram
FI2  PASS  a rendered image for every diagram
LR1  PASS  §1 setup filled (tool and model recorded)
LR2  PASS  5 prompts pasted in §2
LR3  PASS  3 use-case findings in §3
LR4  PASS  §4 relationships read both ways, 2 assumption(s) declared
LR5  PASS  3 behaviour-diagram findings in §5
LR6  PASS  4 critique issues with a verdict
LR7  PASS  5 change-log rows covering all three diagrams
CS1  PASS  6 approved stories
CS2  PASS  §7 traces R1-R4 into the diagrams
CS3  PASS  every use case traces to an approved story

SUMMARY pass=35 fail=0 error=0
A FAIL you report and explain in lab-report.md §9 costs you nothing. One you hide costs the criterion.
```

**FAILs I am keeping, and why:** none

---

## 10. Conclusion (120–180 words)

The class diagram had the most serious mistakes. The AI put rule R2 in a note on Room, but it belongs on Booking. It also gave Booking.confirmationCode the multiplicity [0..1]. This means a booking can exist without a confirmation code. That is wrong: R4 says every successful booking must have one, and the AI's own assumption said the same thing. If this [0..1] had gone into the code, it would have become a nullable field, and the system could save a booking with no confirmation code.

The activity diagram had the three checks in the right places. However, the decision points did not say which rule they were checking, so R1–R3 only appeared on the rejection actions. The AI was also inconsistent with names: it called the same goal "Book study room" in one place and "Book room" in another.

The AI's critique was partly correct. It rightly noticed that the story source was still a placeholder, and that the note on Room listed only R3 for book(). But it made two mistakes. First, it suggested moving R2 back to Room, which goes against the lab convention. Second, it claimed the file encoding was broken. In fact, the file is UTF-8; the strange characters appeared only because the text was copied to the clipboard.
