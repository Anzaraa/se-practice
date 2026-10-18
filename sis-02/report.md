# SIS #02 — AI-Assisted UML Modeling: University Course Registration

<!--
  This is the only file you write your report in. README.md tells you what goes where.

  Rules the checker relies on:
  - Do not delete, rename or renumber the ## headings, the ### headings, or the **Label:** words.
  - Replace every "(write here)" and "(paste here)". None may be left when you submit.
  - Comments like this one are ignored by the checker and the word counter. Delete them or leave them.
-->

## 1. Scope and assumptions

**Scope:** A signed-in student browses the course catalog for one semester, sees the course code, title, offering and available places, selects one CourseOffering and requests registration. At registration the system rechecks, in one atomic step, whether the student is already enrolled and whether places remain, then either creates exactly one Enrollment and returns a confirmation, or rejects the request with "already enrolled" or "course full" and changes nothing. Out of scope: payments, prerequisites, timetable clashes, waiting lists, cancellation, and login itself.

**Assumptions:**

1. The only actor is the Student; no admin or instructor actions are modelled.
2. A Course has one or more CourseOfferings; each CourseOffering belongs to exactly one Course and one semester and has a fixed capacity (a positive whole number).
3. An Enrollment links exactly one Student to exactly one CourseOffering; a student has at most one Enrollment per offering.
4. Available places = capacity minus the current number of Enrollments for the offering. A catalog view shows this figure but reserves nothing, so it can be stale.
5. The duplicate check, the capacity check and the creation of the Enrollment form one atomic operation, so two competing requests cannot both take the last place.
6. If a student is already enrolled and the offering is also full, the duplicate check runs first and the reason returned is "already enrolled".
7. The rejection reason for a full offering is "course full" (the wording R5 requires), not "no places left" as in my first draft.

## 2. User stories and acceptance criteria

<!-- Your APPROVED requirements: Prompt A's draft after your review. Keep the IDs, the three
     story headings and the bullet shape. Every criterion names the rule(s) it maps to,
     e.g. (R2, R4). Two criteria per story. Nothing out of scope.
     Format of a criterion, on one bullet:
     - **AC-03** (R2, R4): Given ..., When ..., Then ... -->

### US-01 — Browse offerings

**US-01:** As a signed-in student, I want to see the course offerings for a semester with their available places, so that I can choose an offering to register for.

- **AC-01** (R1): Given course INF210 "Data Modeling" has offering "Section A, Fall 2026" with capacity 30 and 28 enrollments, When student Aida opens the catalog for Fall 2026, Then the catalog shows code "INF210", title "Data Modeling", offering "Section A, Fall 2026" and 2 available places.
- **AC-02** (R1, R2, R5): Given offering INF210 Section A, Fall 2026 has capacity 30 and 29 enrollments, and student Bolat's catalog view shows 1 available place, When student Dana registers for that offering before Bolat submits a request, Then Dana's enrollment is created, Bolat's catalog view did not create or hold an enrollment, and Bolat's later request is rechecked against current availability and rejected with "course full".

### US-02 — Register for an offering

**US-02:** As a signed-in student, I want to register for a selected course offering, so that I get a place in it and receive a confirmation.

- **AC-03** (R2, R4): Given offering MTH115 "Discrete Structures", Section B, Fall 2026 has capacity 25 and 24 enrollments, and student Aida has no enrollment in it, When Aida requests registration for that offering, Then exactly one Enrollment linking Aida and MTH115 Section B, Fall 2026 is created, available places become 0, and Aida receives a confirmation.
- **AC-04** (R2, R4, R5): Given offering MTH115 Section B, Fall 2026 has capacity 25 and 24 enrollments, and neither Bolat nor Chingiz is enrolled in it, When Bolat and Chingiz request registration at the same time, Then exactly one of them gets an Enrollment and a confirmation, the other is rejected with "course full" and gets no enrollment, and the enrollment count is 25 and never exceeds capacity.

### US-03 — Receive a clear rejection

**US-03:** As a signed-in student, I want to be told why my registration was rejected, so that I know my request did not create an enrollment.

- **AC-05** (R2, R5): Given offering INF210 Section C, Fall 2026 has capacity 20 and 20 enrollments, and student Dana has no enrollment in it, When Dana requests registration for that offering, Then the request is rejected with "course full", no Enrollment is created, and the enrollment count stays 20.
- **AC-06** (R3, R5): Given student Aida already has an Enrollment in offering MTH115 Section B, Fall 2026, which has capacity 25 and 12 enrollments, When Aida requests registration for the same offering again, Then the request is rejected with "already enrolled", no Enrollment is created, and the enrollment count stays 12.

## 3. Sequence diagram

<!-- The FINAL diagram, rendered. Change .png to .svg if that is what you exported. -->

![Final sequence diagram](models/img/sequence.png)

**Participants:** (write here — each lifeline and what it stands for)

**Atomic operation:** (write here — which messages form the one atomic step: the final duplicate check, the capacity check and the creation of the Enrollment, and why a catalog view reserves nothing)

**Where the Enrollment is created:** (write here — which message, which lifeline, and which class in section 4 it produces)

**Technical lifelines:** (write here — every lifeline that is NOT a class in the class diagram, by name, and why the difference in abstraction is fine. "None" if there are none.)

## 4. Class diagram

<!-- The FINAL diagram, rendered. -->

![Final class diagram](models/img/classes.png)

<!-- One row per association in classes.puml, read in both directions. -->

| Association | Read left to right | Read right to left |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |

**How an Enrollment links a student to an offering:** (write here)

**Capacity constraint:** (write here — and why multiplicity alone cannot express it)

**Uniqueness constraint:** (write here — and why multiplicity alone cannot express it)

## 5. Traceability

<!-- Every rule, including the catalog fields and availability (R1). Column 1: the rule and
     the criteria that cover it, e.g. "R2 + AC-03, AC-04". Column 2: the message, guard,
     class or constraint that shows the rule in YOUR diagrams. Column 3: the T-ID that
     exercises it, or the extra check you did instead (R1 has no T case). -->

| Rule and criterion | Model evidence | Validation case |
| --- | --- | --- |
| R1 + (write here) | (write here) | (write here) |
| R2 + (write here) | (write here) | (write here) |
| R3 + (write here) | (write here) | (write here) |
| R4 + (write here) | (write here) | (write here) |
| R5 + (write here) | (write here) | (write here) |

## 6. Walkthroughs

<!-- Walk each case through YOUR final sequence diagram, message by message. Column 2: the
     actual steps and the state change (count before → after). Column 3 starts with Pass or
     Fail, then the location: the message, guard or note where you saw it. A Fail you
     report honestly is a finding, not a penalty. -->

| Case | Observed path and state change | Judgment and evidence |
| --- | --- | --- |
| T1. Available | (write here) | (write here) |
| T2. Last place | (write here) | (write here) |
| T3. Full | (write here) | (write here) |
| T4. Duplicate | (write here) | (write here) |

## 7. Review decisions

<!-- At least three substantive decisions about Prompt C's critique or your own inspection.
     Decision: accepted / rejected / modified — and what you did. Reason: why, in a full
     sentence. Rule: R1–R5. Do not invent an error to fill the table; a justified rejection
     of advice counts. -->

| AI suggestion or model element | Decision | Reason | Rule |
| --- | --- | --- | --- |
| (write here) | (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) | (write here) |

## 8. Modeling explanation

<!-- 200–300 words. Your main design choices; how the class diagram and the sequence diagram
     complement each other; why an activity diagram could also help explain the workflow. -->

(write here)

## 9. Reflection

<!-- 150–200 words. Written by you, not by the assistant: where AI helped, one decision you
     made yourself, one remaining limitation. Specific beats flattering. -->

(write here)

## 10. Appendix A — Before AI

<!-- Written BEFORE you run Prompt A, committed and pushed in your first commit, and never
     edited afterwards. This is what you paste into Prompt A as "My initial assumptions". -->

**Scope:** A signed-in student browses the electronic course catalog, selects one course offering (a section of a course in a specific semester) and requests
registration; the system creates an Enrollment or rejects the request based on
available places. Out of scope: payments, prerequisites, timetable clashes, waiting lists, cancellation, and login itself.

**Initial assumptions:**

1. The only actor who registers is the Student; the Course Catalog / Registration System is the system under design. No admin or instructor actions are modelled.
2. A Course (e.g. "SE101 Software Engineering") can have many CourseOfferings; each CourseOffering belongs to exactly one Course and one semester and has a fixed capacity (a positive whole number).
3. An Enrollment links exactly one Student to exactly one CourseOffering. A student can have many enrollments, but at most one for the same offering.
4. A registration request is accepted (an Enrollment is created) only if the number of existing enrollments for that offering is less than its capacity; otherwise it is rejected with a "no places left" message. Since waitlists are excluded, nothing happens after a rejection.
5. A duplicate request (the student is already enrolled in that offering) is rejected, and the enrollment count does not change.
6. Two students requesting the last place at the same time must not both succeed, so the capacity check and creating the Enrollment happen as one step.
7. The catalog shows the remaining places for each offering, so the student can see whether it is full before requesting.

## 11. Appendix B — AI exchanges

<!-- Complete prompts and complete responses, as text — never screenshots. Paste each inside
     the ~~~~ block that follows its label: AI responses contain ``` PlantUML blocks, and
     ~~~~ keeps them from breaking this file. Prompts B and C: the prompt text first, then
     the material it refers to ("below", "these two") pasted under it, in the same block.
     You may add B5, B6 … after B4 if you ran more. -->

### B1 — Requirements (Prompt A)

- **Tool:** Claude
- **Model:** Claude Opus 5.5
- **Date:** 2026-10-18
- **Purpose:** draft 3 user stories and 6 acceptance criteria

<!-- Model: the exact model with its version, as the tool shows it (e.g. "GPT-5 Thinking",
     "Claude Sonnet 4.5"). If the tool does not show it, write: not displayed
     Date: YYYY-MM-DD -->

**Prompt:**

~~~~text
Act as a requirements analyst. Use only this course registration scenario and rules R1–R5: Scenario: A student browses an electronic course catalog, chooses a course offering and requests registration. Each offering has a limited number of places. A Course describes a subject. A CourseOffering is one scheduled section in one semester. Registration always targets a specific offering. Assume that the student is signed in, the selected offering exists, and its capacity is a positive whole number. Exclude payments, prerequisites, timetable clashes, waiting lists and cancellation. Use fictional students and courses. R1. Catalog: Show the course code, title, offering and available places for one semester. R2. Capacity: Recheck current availability when registering. Enrollment must never exceed the offering's capacity. R3. Duplicates: A student may have at most one enrollment in the same offering. Reject a repeat request. R4. Success: Create exactly one Enrollment linking the student and offering, update availability and return a confirmation. R5. Rejection: Explain "course full" or "already enrolled". Create no enrollment and leave the enrollment count unchanged. A catalog view does not reserve a place. Model the final checks and enrollment creation as one atomic operation so competing requests cannot take the same last place. My initial assumptions are 1. The only actor who registers is the Student; the Course Catalog / Registration System is the system under design. No admin or instructor actions are modelled. 2. A Course (e.g. "SE101 Software Engineering") can have many CourseOfferings; each CourseOffering belongs to exactly one Course and one semester and has a fixed capacity (a positive whole number). 3. An Enrollment links exactly one Student to exactly one CourseOffering. A student can have many enrollments, but at most one for the same offering. 4. A registration request is accepted (an Enrollment is created) only if the number of existing enrollments for that offering is less than its capacity; otherwise it is rejected with a "no places left" message. Since waitlists are excluded, nothing happens after a rejection. 5. A duplicate request (the student is already enrolled in that offering) is rejected, and the enrollment count does not change. 6. Two students requesting the last place at the same time must not both succeed, so the capacity check and creating the Enrollment happen as one step. 7. The catalog shows the remaining places for each offering, so the student can see whether it is full before requesting.
Draft 3 user stories and 2 Given / When / Then acceptance criteria for each. Use IDs US-01 to US-03 and AC-01 to AC-06. Map each criterion to rule IDs.
Cover normal and rejection behavior. List uncertainty separately. Do not add excluded features or invent university policies.
~~~~

**Response:**

~~~~text
Course Registration: User Stories and Acceptance Criteria

All students and courses below are fictional.

Notes on your assumptions

Two adjustments keep the assumptions in line with the rules:

Assumption 4: R5 requires the message “course full”. Use that wording instead of “no places left”.
Assumption 6: The rules require all of the final checks to be atomic, not only the capacity check. The duplicate check (R3) should be part of the same atomic step as the capacity check and enrollment creation.

The rest are consistent with R1–R5.

US-01: Browse the catalog

As a signed-in student, I want to see the course offerings for a semester with their available places, so that I can choose an offering to register for.

AC-01: Catalog shows required fields (R1)

Given course INF210 “Data Modeling” has offering “Section A, Fall 2026” with capacity 30 and 28 enrollments
When student Aida opens the catalog for Fall 2026
Then the catalog shows code “INF210”, title “Data Modeling”, offering “Section A, Fall 2026” and 2 available places.

AC-02: Viewing does not reserve a place (R1, R2)

Given offering INF210 Section A, Fall 2026 has capacity 30 and 29 enrollments, and student Bolat’s catalog view shows 1 available place
When student Dana registers for that offering before Bolat submits a request
Then Dana’s enrollment is created, Bolat’s catalog view did not create or hold an enrollment, and Bolat’s later request is rechecked against current availability and rejected with “course full”.
US-02: Register for an offering

As a signed-in student, I want to register for a selected course offering, so that I get a place in it and receive a confirmation.

AC-03: Successful registration (R2, R3, R4)

Given offering MTH115 “Discrete Structures”, Section B, Fall 2026 has capacity 25 and 24 enrollments, and student Aida has no enrollment in it
When Aida requests registration for that offering
Then exactly one Enrollment linking Aida and MTH115 Section B, Fall 2026 is created, available places become 0, and Aida receives a confirmation.

AC-04: Competing requests for the last place (R2, R4, R5)

Given offering MTH115 Section B, Fall 2026 has capacity 25 and 24 enrollments, and neither Bolat nor Chingiz is enrolled in it
When Bolat and Chingiz request registration at the same time
Then exactly one of them gets an Enrollment and a confirmation, the other is rejected with “course full” and gets no enrollment, and the enrollment count is 25. It never exceeds capacity.
US-03: Understand a rejected request

As a signed-in student, I want to be told why my registration was rejected, so that I know my request did not create an enrollment.

AC-05: Offering is full (R2, R5)

Given offering INF210 Section C, Fall 2026 has capacity 20 and 20 enrollments, and student Dana has no enrollment in it
When Dana requests registration for that offering
Then the request is rejected with “course full”, no Enrollment is created, and the enrollment count stays 20.

AC-06: Already enrolled (R3, R5)

Given student Aida already has an Enrollment in offering MTH115 Section B, Fall 2026, which has capacity 25 and 12 enrollments
When Aida requests registration for the same offering again
Then the request is rejected with “already enrolled”, no Enrollment is created, and the enrollment count stays 12.
Traceability
Rule	Acceptance criteria
R1	AC-01, AC-02
R2	AC-02, AC-03, AC-04, AC-05
R3	AC-03, AC-06
R4	AC-03, AC-04
R5	AC-02, AC-04, AC-05, AC-06
Uncertainties (not covered by R1–R5)
Which reason wins: If a student is already enrolled in an offering that is also full, the rules don’t say whether the message should be “already enrolled” or “course full”.
Which semester is shown: R1 says “one semester” but not how it is chosen (the current semester, or one the student selects).
Offering display: It is unspecified what identifies an offering in the catalog, such as a section label, semester, or other details.
Confirmation contents: R4 requires a confirmation but doesn’t define what it includes.
How availability is calculated: It could be derived as capacity minus enrollments or stored as a counter. The rules require only that it stays correct.
Full offerings in the catalog: The rules don’t say whether full offerings are listed with 0 places or hidden. Assumption 7 implies they are listed.
Fixed capacity: Capacity is “fixed” only in your assumption 2. The rules don’t address capacity changes.
Same student submitting twice at once: The rules imply but don’t explicitly state that the atomic operation also stops a student from creating two enrollments by sending simultaneous duplicate requests.
Freshness of the catalog figure: It is unspecified how up to date the displayed available places must be, since a catalog view can become stale (see AC-02).~~~~

### B2 — UML drafts (Prompt B)

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Purpose:** draft the sequence and class diagrams

**Prompt:**

~~~~text
Sequence diagram
plantuml
@startuml
title Course registration - browse and register (R1-R5)
autonumber

actor "Student\n(signed in)" as S
boundary "Registration UI" as UI
control "RegistrationService" as RS
database "Registration Store" as DB

== Browse catalog (R1, US-01, AC-01) ==
S -> UI : openCatalog(semester = "Fall 2026")
UI -> RS : listOfferings("Fall 2026")
RS -> DB : read offerings with course data\nand enrollment counts
DB --> RS : offerings
RS -> RS : availablePlaces = capacity - enrollmentCount
RS --> UI : rows (code, title, offering, availablePlaces)
UI --> S : show catalog\ne.g. INF210 | Data Modeling | Section A, Fall 2026 | 2 places
note over UI, DB
  Read-only. Viewing the catalog creates no
  enrollment and reserves no place (AC-02).
end note

== Request registration (R2-R5, US-02, US-03) ==
S -> UI : register(offering = MTH115 Section B, Fall 2026)
UI -> RS : register(studentId, offeringId)

critical Atomic operation: final checks + creation (one transaction, offering locked)
  RS -> DB : lock offering; read capacity, enrollmentCount,\nexisting Enrollment(studentId, offeringId)
  DB --> RS : capacity, enrollmentCount, alreadyEnrolled
  alt alreadyEnrolled (R3)
    RS -> RS : outcome = "already enrolled"\n(no write, count unchanged)
  else enrollmentCount >= capacity (R2)
    RS -> RS : outcome = "course full"\n(no write, count unchanged)
  else not enrolled and enrollmentCount < capacity (R2, R3)
    RS -> DB : create exactly one Enrollment(student, offering)
    DB --> RS : created; enrollmentCount + 1
    RS -> RS : outcome = success\navailablePlaces = capacity - enrollmentCount
  end
  RS -> DB : commit and release lock
end

alt outcome = success (R4, AC-03)
  RS --> UI : confirmation(enrollment, offering, availablePlaces)
  UI --> S : "Registered for MTH115 Section B, Fall 2026"
else outcome = "course full" (R5, AC-02, AC-05)
  RS --> UI : rejected("course full")
  UI --> S : "Course full - no enrollment created"
else outcome = "already enrolled" (R5, AC-06)
  RS --> UI : rejected("already enrolled")
  UI --> S : "Already enrolled - no enrollment created"
end

note right of RS
  Competing requests (AC-04): the lock serializes them.
  The first request takes the last place. The second
  then reads enrollmentCount = capacity and is
  rejected with "course full".
end note
@enduml
Domain class diagram
plantuml
@startuml
title Course registration - domain model
hide methods
hide circle

class Student {
  studentId : String {unique}
  name : String
}

class Course {
  code : String {unique}
  title : String
}

class CourseOffering {
  section : String
  semester : String
  capacity : Integer {capacity > 0}
  /availablePlaces : Integer
}

class Enrollment {
  enrolledAt : DateTime
}

Course "1" -- "0..*" CourseOffering : is offered as >
Student "1" -- "0..*" Enrollment : holds >
CourseOffering "1" -- "0..*" Enrollment : has >

note right of CourseOffering
  Capacity constraint (R2):
  inv: enrollments->size() <= capacity
  Derived (R1, R4):
  availablePlaces = capacity - enrollments->size()
  Assumed key: (course, semester, section) unique
end note

note bottom of Enrollment
  Uniqueness constraint (R3):
  at most one Enrollment per (student, offering)
  inv: Enrollment.allInstances()->isUnique(e |
       Tuple{s = e.student, o = e.offering})
  Each Enrollment links exactly 1 Student
  and exactly 1 CourseOffering (R4)
end note
@enduml
Assumptions
Check order: The duplicate check runs before the capacity check, so a student who is already enrolled in a full offering sees “already enrolled”. The rules don’t set this order; it was listed as open earlier.
Available places are derived: They are calculated as capacity minus the enrollment count, not stored as a separate counter. “Update availability” (R4) happens because the enrollment count goes up.
Semester is an attribute: It is modeled as a plain attribute of CourseOffering, because the rules only use it to filter the catalog. No Semester class is added.
Assumed offering key: The key (course, semester, section) is my assumption, not a stated rule.
Confirmation is not an entity: It is a reply message, not a domain class. The rules don’t require storing it.
Scope limits: The diagrams model no actor other than Student, no capacity changes, and none of the excluded features.
Technical lifelines
Registration UI (boundary): the screen through which the student browses the catalog and submits requests.
RegistrationService (control): applies R2–R5 and owns the atomic operation.
Registration Store (database): holds Course, CourseOffering and Enrollment data.

These three are design placeholders, not domain concepts. The critical fragment stands for one transaction with the offering locked. A database unique constraint on (student, offering) would also enforce R3 as a second safeguard.
~~~~

**Response:**

~~~~text
Sequence diagram
plantuml
@startuml
title Course registration - browse and register (R1-R5)
autonumber

actor "Student\n(signed in)" as S
boundary "Registration UI" as UI
control "RegistrationService" as RS
database "Registration Store" as DB

== Browse catalog (R1, US-01, AC-01) ==
S -> UI : openCatalog(semester = "Fall 2026")
UI -> RS : listOfferings("Fall 2026")
RS -> DB : read offerings with course data\nand enrollment counts
DB --> RS : offerings
RS -> RS : availablePlaces = capacity - enrollmentCount
RS --> UI : rows (code, title, offering, availablePlaces)
UI --> S : show catalog\ne.g. INF210 | Data Modeling | Section A, Fall 2026 | 2 places
note over UI, DB
  Read-only. Viewing the catalog creates no
  enrollment and reserves no place (AC-02).
end note

== Request registration (R2-R5, US-02, US-03) ==
S -> UI : register(offering = MTH115 Section B, Fall 2026)
UI -> RS : register(studentId, offeringId)

critical Atomic operation: final checks + creation (one transaction, offering locked)
  RS -> DB : lock offering; read capacity, enrollmentCount,\nexisting Enrollment(studentId, offeringId)
  DB --> RS : capacity, enrollmentCount, alreadyEnrolled
  alt alreadyEnrolled (R3)
    RS -> RS : outcome = "already enrolled"\n(no write, count unchanged)
  else enrollmentCount >= capacity (R2)
    RS -> RS : outcome = "course full"\n(no write, count unchanged)
  else not enrolled and enrollmentCount < capacity (R2, R3)
    RS -> DB : create exactly one Enrollment(student, offering)
    DB --> RS : created; enrollmentCount + 1
    RS -> RS : outcome = success\navailablePlaces = capacity - enrollmentCount
  end
  RS -> DB : commit and release lock
end

alt outcome = success (R4, AC-03)
  RS --> UI : confirmation(enrollment, offering, availablePlaces)
  UI --> S : "Registered for MTH115 Section B, Fall 2026"
else outcome = "course full" (R5, AC-02, AC-05)
  RS --> UI : rejected("course full")
  UI --> S : "Course full - no enrollment created"
else outcome = "already enrolled" (R5, AC-06)
  RS --> UI : rejected("already enrolled")
  UI --> S : "Already enrolled - no enrollment created"
end

note right of RS
  Competing requests (AC-04): the lock serializes them.
  The first request takes the last place. The second
  then reads enrollmentCount = capacity and is
  rejected with "course full".
end note
@enduml
Domain class diagram
plantuml
@startuml
title Course registration - domain model
hide methods
hide circle

class Student {
  studentId : String {unique}
  name : String
}

class Course {
  code : String {unique}
  title : String
}

class CourseOffering {
  section : String
  semester : String
  capacity : Integer {capacity > 0}
  /availablePlaces : Integer
}

class Enrollment {
  enrolledAt : DateTime
}

Course "1" -- "0..*" CourseOffering : is offered as >
Student "1" -- "0..*" Enrollment : holds >
CourseOffering "1" -- "0..*" Enrollment : has >

note right of CourseOffering
  Capacity constraint (R2):
  inv: enrollments->size() <= capacity
  Derived (R1, R4):
  availablePlaces = capacity - enrollments->size()
  Assumed key: (course, semester, section) unique
end note

note bottom of Enrollment
  Uniqueness constraint (R3):
  at most one Enrollment per (student, offering)
  inv: Enrollment.allInstances()->isUnique(e |
       Tuple{s = e.student, o = e.offering})
  Each Enrollment links exactly 1 Student
  and exactly 1 CourseOffering (R4)
end note
@enduml
Assumptions
Check order: The duplicate check runs before the capacity check, so a student who is already enrolled in a full offering sees “already enrolled”. The rules don’t set this order; it was listed as open earlier.
Available places are derived: They are calculated as capacity minus the enrollment count, not stored as a separate counter. “Update availability” (R4) happens because the enrollment count goes up.
Semester is an attribute: It is modeled as a plain attribute of CourseOffering, because the rules only use it to filter the catalog. No Semester class is added.
Assumed offering key: The key (course, semester, section) is my assumption, not a stated rule.
Confirmation is not an entity: It is a reply message, not a domain class. The rules don’t require storing it.
Scope limits: The diagrams model no actor other than Student, no capacity changes, and none of the excluded features.
Technical lifelines
Registration UI (boundary): the screen through which the student browses the catalog and submits requests.
RegistrationService (control): applies R2–R5 and owns the atomic operation.
Registration Store (database): holds Course, CourseOffering and Enrollment data.

These three are design placeholders, not domain concepts. The critical fragment stands for one transaction with the offering locked. A database unique constraint on (student, offering) would also enforce R3 as a second safeguard.
~~~~

### B3 — Model critique (Prompt C)

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Purpose:** review both models against R1–R5 and T1–T4

**Prompt:**

~~~~text
(paste here)
~~~~

**Response:**

~~~~text
(paste here)
~~~~

### B4 — Focused revision (Prompt D)

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Purpose:** apply my accepted review decisions

**Prompt:**

~~~~text
(paste here)
~~~~

**Response:**

~~~~text
(paste here)
~~~~

## 12. Appendix C — Original diagrams

<!-- The AI's first output from Prompt B, rendered unedited from models/original/. -->

![Original sequence diagram](models/img/original-sequence.png)

![Original class diagram](models/img/original-classes.png)

## 13. Appendix D — References and source checks

### References

<!-- Full references, one per line, each starting with "- ". Only sources you actually opened.
     Every URL used in the source checks must also appear here. Example:
     - Sommerville, I. (2016). Software Engineering, 10th ed., Global Edition. Pearson. Ch. 5. -->

- (write here)

### Source checks

<!-- At least two modeling decisions you verified. Source and locator: title + slide, page,
     section, chapter or figure — or title + URL + access date (YYYY-MM-DD). Slide numbers
     refer to the decks posted in our Teams. -->

| Modeling decision | Source and locator | What the source says | How it supports or changed your model |
| --- | --- | --- | --- |
| (write here) | (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) | (write here) |
