# Lab report — Practice #03, Requirements Engineering with AI

Name: Anzara Nurbek
Student ID: 24B031941
GitHub username: Anzaraa

---

## 1. Setup

| | |
| --- | --- |
| AI assistant (tool) | Claude |
| Exact model name and version | Claude Sonnet 5 |
| Date of the session | 27.09.2026 |
| Diagram renderer used | |


---

## 2. Original AI output — user stories (Part 1)

Paste the **unedited** response to Prompt 1. Do not tidy it. If it is long, paste all of it anyway;
this is the baseline everything else is measured against.

Smart Campus Study Room Booking System — User Stories

Student Goals
- Find and reserve an available study room quickly
- Avoid conflicts or wasted trips to full rooms
- Manage/cancel bookings without hassle
- Get reminders so rooms aren't missed or forgotten

Administrator Goals
- Maintain accurate room inventory and availability
- Prevent misuse (no-shows, overbooking)
- Monitor usage for planning and reporting

1. Search Available Rooms
As a Student, I want to search for study rooms by date, time, and capacity, so that I can quickly find a room that fits my group's needs.
Priority: High
Assumption: Room capacity and availability data is kept up to date in the system in real time.

2. Book a Room
As a Student, I want to reserve a study room for a specific time slot, so that I can guarantee a quiet space for my group to work.
Priority: High
Assumption: Each student account can hold only one active booking at a time, or a defined maximum, to prevent hoarding.

3. Cancel or Modify a Booking
As a Student, I want to cancel or change my reservation, so that I can release the room if my plans change and avoid penalties.
Priority: High
Assumption: Cancellations are allowed up to a set cutoff time (e.g., 30 minutes before the slot starts).

4. Receive Booking Reminders
As a Student, I want to receive a notification before my reserved time slot, so that I don't forget my booking and can arrive on time.
Priority: Medium
Assumption: Students have provided a valid email or app notification channel.

5. View Booking History
As a Student, I want to view my past and upcoming bookings, so that I can track my room usage and plan future sessions.
Priority: Low
Assumption: Booking records are retained for at least one academic term.

6. Manage Room Inventory
As an Administrator, I want to add, edit, or remove study rooms from the system, so that the booking catalog accurately reflects rooms currently available on campus.
Priority: High
Assumption: Administrators have exclusive access rights to modify room listings.

7. Enforce No-Show Policy
As an Administrator, I want to automatically release rooms that remain unclaimed after a grace period, so that unused reservations don't block access for other students.
Priority: Medium
Assumption: A check-in mechanism (e.g., QR scan or app confirmation) exists to detect no-shows.

8. Generate Usage Reports
As an Administrator, I want to view reports on room usage and booking frequency, so that I can identify demand patterns and plan facility improvements.
Priority: Medium
Assumption: The system logs sufficient booking metadata (time, duration, room, department) to support reporting.

---

## 3. Story review (Part 2)

One row per change you made. "Kept unchanged" is a valid row and needs a reason too.

| Story (as generated) | What I did | Why | Final ID |
| 1. Search for available rooms | Kept, trimmed wording slightly | Matches UC-01 exactly; real stakeholder, one valuable outcome, testable, nothing out of scope | US-01 |
| 2. Book a room | Kept unchanged | Matches UC-02 exactly; clean on every checklist item | US-02 |
| 3. Cancel or Modify a Booking | Rewrote: removed "or Modify" and "avoid penalties" | "Modify" is not one of the six fixed use cases (only Cancel booking / UC-03 exists); "avoid penalties" pulls in fees/fines/penalties language, which is explicitly out of scope | US-03 |
| 4. Receive Booking Reminders | Deleted |  Reminder notifications are explicitly out of scope: "SMS, push or reminder notifications of any kind beyond UC-06" | - |
| 5. View Booking History | Deleted | Does not correspond to any of the six fixed use cases; keeping it would add a function the scenario never defines | - | 
| 6. Manage room inventory | Rewrote: narrowed "add, edit, or remove rooms" down to "block or unblock a room" | UC-04 is "Block or unblock room," not full inventory management; the original story let the assistant widen the scenario | US-04 |
| 7. Enforce No-Show Policy | Deleted | Assumption explicitly depends on a QR/check-in mechanism: "check-in, attendance or QR codes" is out of scope | - |
| 8. Generate Usage Reports | Kept unchanged | Matches UC-05 exactly; clean on every checklist item | US-05 |
| (none — not in original output) | Wrote a new story myself, not from the assistant | After the review above, UC-06  had no story behind it. Rather than leave a silent gap or stretch an existing story to fit, I authored US-06 directly: "As a Student, I want to receive a confirmation when my booking or cancellation is processed, so that I know it went through." This is a reviewer addition, not an AI output — disclosed as such in AI_USAGE.md | US-06 |


**Did the assistant invent anything outside the scenario?** Name it against the out-of-scope list in
README section 1, or write "no, and here is how I checked".

Yes, in four places, all against the out-of-scope list in README section 1:

Story 4 (reminders) — out-of-scope notification type beyond UC-06.
Story 7 (no-show enforcement) — depends on a check-in/QR mechanism, explicitly out of scope.
Story 3 ("avoid penalties") — introduces fee/fine/penalty language, explicitly out of scope.
Story 6 (add/edit/remove rooms) — widens UC-04 (block/unblock) into full inventory management, which the scenario never grants.
Story 5 (booking history) is not out-of-scope vocabulary, but it invents a seventh function that is not among the six fixed use cases, so it was cut on the same principle: stay within the supplied scenario.


**How many stories did you end with, and why that number?**
6 — US-01 through US-06, one per each of the six fixed use cases (UC-01…UC-06). Full 1:1 coverage was chosen over leaving UC-06 as an unfilled gap because a working confirmation story was easy to defend and kept traceability clean; the four deletions above were scope violations, not just weak stories, so filling them with padding would have hidden the review rather than shown it.


---

## 4. Original AI output — acceptance criteria (Part 3)

Acceptance Criteria
US-02: Reserve a Study Room
Story: As a Student, I want to reserve a study room for a specific time slot, so that I can guarantee a quiet space for my group to work.
Assumptions:
- A student can hold only one active booking per room at a time.
- Bookings must be made for a future time slot.
- The maximum booking duration is two hours.
- A room cannot have overlapping bookings.
- Blocked rooms cannot be booked.
Acceptance Criteria
AC-01: Successful booking
- Given a student is logged in and a room is available.
- When the student selects a future time slot of up to two hours and confirms the booking.
- Then the system creates the booking and displays a confirmation.
AC-02: Booking in the past
- Given a student is selecting a time slot.
- When the student tries to book a time slot in the past or starting now.
- Then the system rejects the booking and displays an error message.
AC-03: Maximum booking duration
- Given a student is selecting a time slot.
- When the student tries to book a room for more than two hours.
- Then the system rejects the booking and asks the student to select a shorter time slot.
AC-04: Overlapping booking
- Given a room already has a booking for a specific time slot.
- When another student tries to book the same room for an overlapping time slot.
- Then the system rejects the booking and informs the student that the room is unavailable.
AC-05: Blocked room
- Given a room is blocked by an administrator.
- When a student tries to book that room.
- Then the system rejects the booking and informs the student that the room is unavailable.

US-03: Cancel a Reservation
Story: As a Student, I want to cancel my reservation, so that I can release the room if my plans change.
Assumptions:
- A student can cancel only their own reservation.
- Cancellations are allowed at any time before the booking's start time.
- A cancelled booking no longer blocks the room's time slot.
Acceptance Criteria
AC-01: Successful cancellation
- Given a student has an active booking that has not started yet.
- When the student cancels the booking.
- Then the system cancels the booking and confirms the cancellation.
AC-02: Cancellation after the start time
- Given a student has a booking that has already started.
- When the student tries to cancel the booking.
- Then the system rejects the cancellation and displays an error message.
AC-03: Booking does not exist
- Given a student has no active booking for the selected reservation.
- When the student tries to cancel that reservation.
- Then the system displays a message that the booking cannot be found or is already cancelled.
AC-04: Room becomes available
- Given a student has an active booking for a future time slot.
- When the student successfully cancels the booking.
- Then the system releases the time slot so another student can book it, provided the room is not blocked.

US-04: Block or Unblock a Study Room
Story: As an Administrator, I want to block or unblock a study room, so that rooms out of service cannot be booked and can be returned to use once repaired.
Assumptions:
- Only an administrator can block or unblock a room.
- Blocking a room does not automatically cancel existing bookings.
- A blocked room cannot receive new bookings.
- Unblocking a room makes it available for booking, subject to existing bookings and other rules.
Acceptance Criteria
AC-01: Successfully block a room
- Given an administrator is logged in and a room is available.
- When the administrator blocks the room.
- Then the system marks the room as blocked and prevents new bookings.
AC-02: Successfully unblock a room
- Given a room is blocked.
- When the administrator unblocks the room.
- Then the system changes the room's status to available for booking, subject to existing reservations.
AC-03: Unauthorized access
- Given a student is logged in without administrator permissions.
- When the student tries to block or unblock a room.
- Then the system rejects the action and displays an access-denied message.
AC-04: Existing bookings remain
- Given a room has existing bookings.
- When an administrator blocks the room.
- Then the system keeps the existing bookings and marks the room as blocked for new reservations.
AC-05: Booking a blocked room
- Given a room is blocked by an administrator.
- When a student tries to book the room for a future time slot.
- Then the system rejects the booking and informs the student that the room is blocked.

---

## 5. Criteria review (Part 3)

1. US-02 — Reserve a Study Room

| Criterion | Problem | What I changed it to | Final ID |
| AC-01: Successful booking | The login requirement is outside the scenario | Removed the login requirement. Kept the successful booking behavior | AC-01 |
| AC-02: Booking in the past | The error message is not defined in the scenario | Removed the error message requirement. Kept the rejection of bookings that start in the past or now | AC-02 |
| AC-03: Maximum booking duration | Asking the student to select a shorter slot describes interface behavior | Removed the interface instruction. Kept the rejection of bookings longer than two hours | AC-03 |
| AC-04: Overlapping booking | The message about room availability is unnecessary | Removed the message requirement. Kept the rejection of overlapping bookings | AC-04 |
|  AC-05: Blocked room | The message about room availability is unnecessary | Removed the message requirement. Kept the rejection of bookings for blocked rooms | AC-05 |

2. US-03 — Cancel a Reservation

| Criterion | Problem | What I changed it to | Final ID |
| AC-01: Successful cancellation | No major problem | Removed the login requirement. Kept unchanged | AC-06 |
| AC-02: Cancellation after the start time | The error message is not defined in the scenario | Removed the error message requirement. Kept the rejection of cancellation after the booking starts | AC-07 |
| AC-03: Booking does not exist | The message requirement is not necessary | AC-08 |
| AC-04: Room becomes available | No major problem. | Removed the message requirement | Kept unchanged | AC-09 |


3. US-04 — Block or Unblock a Study Room

| Criterion | Problem | What I changed it to | Final ID |
| AC-01: Successfully block a room | The login requirement is outside the scenario | Removed the login requirement. Kept the room-blocking behavior | AC-10 |
| AC-02: Successfully unblock a room | No major problem | Kept unchanged | AC-11 |
| AC-03: Unauthorized access | The login requirement is outside the scenario | Removed the login requirement. Kept the restriction that only an administrator can block or unblock a room | AC-12 |
| AC-04: Existing bookings remain | No major problem. It follows the stated assumption | Kept unchanged | AC-13 |
|  AC-05: Booking a blocked room | It repeats US-02 AC-05, which already checks that blocked rooms cannot be booked | Deleted because the same rule is already covered by US-02 AC-05 | - |



**The two open questions.** Write your decision and the reason. Either answer is accepted.

| Question | My decision | Why |
| --- | --- | --- |
| A booking ending exactly when another begins — overlap under R3? | allowed | Two bookings can be next to each other without sharing any time, so they do not overlap |
| Is exactly two hours allowed under R2? | allowed | The rule says the maximum duration is two hours, so exactly two hours is permitted |

**Which invalid or boundary case did the assistant leave out?**

The assistant did not include a separate test for a booking lasting exactly two hours. The maximum duration rule allows two hours, so this boundary case should be checked explicitly.

---

## 6. Original AI output — use-case diagram (Part 4)

@startuml
left to right direction

actor Student
actor Administrator

rectangle "Smart Campus Study Room Booking System" {
    usecase "View availability" as UC1
    usecase "Book room" as UC2
    usecase "Cancel booking" as UC3
    usecase "Block or unblock room" as UC4
    usecase "Review usage" as UC5
    usecase "Send confirmation" as UC6

    UC2 ..> UC6 : <<include>>
    UC3 ..> UC6 : <<include>>
}

Student -- UC1
Student -- UC2
Student -- UC3

Administrator -- UC4
Administrator -- UC5

@enduml

Rendered diagram : 
https://www.plantuml.com/plantuml/png/TP7DJiCm48Jl-nIhtbk9fkM0ggYGDsW4zutZXbNzW-nrKOHuTvpM5oF8ARFpxMGrEKQX8CaQCFeiA1u3J--28mUjXBq382K-O2zfr4wAUXujEuuIA2k0XIKt6OshtkOyxCX-f7XRcl7alSKNxo_i9kpdADgky0imFobgHJ6llR7-HBeI6nhOiCmhf8YltKEDBIaOSbwnjxNTaLFQu73_Lc6QNn76gmlwWCaD-RMAszNeIL_pMLdJf0knhubUkn6LTsSEbfQw2lO8DouVY9jDkmpm2Gy7Tiha6jkskCq_xZT0wHlNwwM5McvhsG1K_-C-tVqrtCCnNvoi-G40
---

## 7. Diagram review (Part 4)

| Element | Problem | What I changed |
|UC-02 → UC-06 | The original diagram showed confirmation after booking, but not after cancellation | Added an <<include>> relationship from Cancel booking to Send confirmation |
| Actor associations | No incorrect actor associations were identified | Kept the existing actor associations |
| System boundary | All six use cases were inside the system boundary | No changes were needed |
| Use cases | The diagram did not include screens, databases, or internal classes | No changes were needed |

**Associations.** Which actor–use-case links did the assistant draw that a person does not actually
trigger? Name them.
- No incorrect actor–use-case links were identified. Student is connected to View availability, Book room, and Cancel booking. Administrator is connected to Block or unblock room and Review usage. Send confirmation is triggered by the system.

**Did any screen, database or internal component appear as a use case or an actor?**
- No. The diagram contains only actors and use cases. No screens, databases, or internal components were included.
---

## 8. Traceability (Part 5)

Summarise what the table in `requirements/traceability.md` shows:

- Use cases with **no story** behind them: None. All six use cases are linked to a user story.
- Stories with **no use case** they belong to: None. All six user stories are linked to a use case.
- Criteria that test **no rule** from section 1: None. AC-02 tests R1, AC-03 tests R2, AC-04 tests R3, and AC-05 tests R4.

**What does the largest gap tell you about the generated requirements?**
- The largest gap is that UC-01 View availability and UC-05 Review usage have user stories but no dedicated acceptance criteria. This shows that the AI generated the main requirements, but it did not fully turn every use case into a testable requirement. Human review was needed to identify this gap instead of assuming that every generated story was complete.
---

## 9. Checker runs

Paste the **real terminal output** of both runs. A table with nothing behind it does not count.

$ python tests/check_requirements.py
PASS   US-1  user-stories.md         no placeholders left
PASS   US-2  user-stories.md         6 stories, IDs US-01…US-06
PASS   US-3  user-stories.md         every story has the required sentence shape
PASS   US-4  user-stories.md         every story has a priority
PASS   US-5  user-stories.md         every story declares an assumption
PASS   US-6  user-stories.md         only Student and Administrator appear as roles
PASS   US-7  user-stories.md         nothing from the out-of-scope list appears
PASS   AC-1  acceptance-criteria.md  no placeholders left
PASS   AC-2  acceptance-criteria.md  three sections, all naming real stories: US-02, US-03, US-04
PASS   AC-3  acceptance-criteria.md  every section has 3 to 5 uniquely numbered criteria
PASS   AC-4  acceptance-criteria.md  all 13 criteria are complete Given/When/Then
PASS   AC-5  acceptance-criteria.md  every section covers an invalid or boundary case
PASS   AC-6  acceptance-criteria.md  4 assumptions listed before the criteria
PASS   AC-7  acceptance-criteria.md  both open questions are settled in the assumptions
PASS   PU-1  use-cases.puml          valid PlantUML block, no placeholders
PASS   PU-2  use-cases.puml          exactly two actors: Student, Administrator
PASS   PU-3  use-cases.puml          all six use cases present
PASS   PU-4  use-cases.puml          system boundary present
PASS   PU-5  use-cases.puml          no screens, databases or internal components
PASS   PU-6  use-cases.puml          no unjustified actor associations found
PASS   TR-1  traceability.md         all six use cases have a row
PASS   TR-2  traceability.md         every ID in the table resolves
PASS   TR-3  traceability.md         every story appears in the table
------------------------------------------------------------------------
23 PASS · 0 FAIL · 0 ERROR   (23 checks)
Shape is clean. This says nothing about whether the requirements are good.



$ python tests/validate_submission.py
submission.yml — submission.yml
------------------------------------------------------------------------
PASS   schema                                    1
PASS   week                                      03
FAIL   student.name                              left empty
FAIL   student.student_id                        left empty
FAIL   student.github                            left empty
FAIL   assistant.tool                            left empty
FAIL   assistant.model                           left empty
FAIL   counts.user_stories                       left empty
PASS   counts.acceptance_criteria_sets           3
FAIL   checker.pass                              left empty — run the checker and report the result
FAIL   checker.fail                              left empty — run the checker and report the result
FAIL   checker.error                             left empty — run the checker and report the result
FAIL   checker.commit                            left empty
FAIL   assumptions.overlap_touching_bookings     not decided — either answer is accepted, no answer is not
FAIL   assumptions.exactly_two_hours             not decided — either answer is accepted, no answer is not
PASS   traceability.use_cases_not_covered        []
PASS   traceability.stories_not_traced           []
NOTE   traceability                              you are claiming full coverage in both directions — that is rare on a first pass, and it is checked
FAIL   review_findings                           three or more required, found 0
FAIL   honesty.can_explain_everything_submitted  answer yes or no
FAIL   honesty.ai_usage_disclosed                answer yes or no
------------------------------------------------------------------------
5 PASS · 15 FAIL · 0 ERROR · 1 note
Fix the FAIL and ERROR lines above, then run this again before you push.

| | PASS | FAIL | ERROR |
| `check_requirements.py` | 23 | 0 | 0 |

Commit these numbers were produced at (`git rev-parse --short HEAD`):

**Every FAIL, one line each: what it is and what you decided to do about it.** A FAIL you report and
explain costs you nothing.
- The initial checker run had three FAILs. US-1 was caused by two TODO placeholders in user-stories.md, so I removed them. US-7 was caused by the out-of-scope word "repair" in US-04, so I replaced that wording. PU-1 was caused by two TODO placeholders in use-cases.puml, so I removed them. I reran the checker after these fixes and the final result was 23 PASS, 0 FAIL, 0 ERROR.

**Did you run the checks by hand instead of with Python?** Say so here — it costs nothing, but it
has to be said.
- No. I ran the provided Python checker scripts.

---

## 10. Conclusion (150–200 words)

Answer all three:

1. Which part of the generated requirements was most wrong, and how would you have caught it without
   a checker?
- The biggest problem I found in the generated requirements was US-04. In the first version, it used the word “repair.” Repair and maintenance are outside the scope of our system. At first, I did not notice it because it sounds like something that could be useful in a real library. The checker helped me find this problem. Without the checker, I would have needed to read the scenario and the out-of-scope list more carefully and check each story myself.
2. What did the assistant get right that would have taken you noticeably longer by hand?
- The assistant was also useful for creating the main requirements. It created six user stories with priorities and assumptions, 13 acceptance criteria in Given, When, Then format, and the use-case diagram with the two correct actors and six use cases. Doing all of this manually would have taken me more time. The checker also helped me make sure that the IDs and traceability were correct.
3. You are handing these requirements to someone who will implement them, and you will not be in the
   room. Which single one would you rewrite first, and why?
- If I give these requirements to another developer, I would rewrite US-04 first. The original wording could make the developer think that the system needs to manage room repairs. I would clearly say that the Administrator can only block or unblock a room. This makes the requirement easier to understand and keeps the system within the project scope.
