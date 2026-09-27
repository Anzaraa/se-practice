# User stories — Smart Campus study room booking

6 to 8 stories. Keep the shape exactly: ID, the As/I want/so that sentence, a priority, one
assumption. Roles are **Student** or **Administrator** only.

---

### US-01
**Story:** As a Student, I want to search for available study rooms by date, time, and capacity, so that I can quickly find a room that fits my group's needs.
**Priority:** High
**Assumption:** Room capacity and availability data shown to the student is kept current.

### US-02
**Story:** As a Student, I want to reserve a study room for a specific time slot, so that I can guarantee a quiet space for my group to work.
**Priority:** High
**Assumption:** A student can hold only one active booking per room at a time.

### US-03
**Story:** As a Student, I want to cancel my reservation, so that I can release the room if my plans change.
**Priority:** High
**Assumption:** Cancellations are allowed at any time before the booking's start time.

### US-04
**Story:** As an Administrator, I want to block or unblock a study room, so that unavailable rooms cannot be booked and can be returned to use when appropriate.
**Priority:** High
**Assumption:** Blocking a room does not automatically cancel bookings that already exist for it.

### US-05
**Story:** As an Administrator, I want to view reports on room usage and booking frequency, so that I can identify demand patterns and plan facility improvements.
**Priority:** Medium
**Assumption:** The system logs booking metadata (time, duration, room) needed for reporting.

### US-06
**Story:** As a Student, I want to receive a confirmation when my booking or cancellation is processed, so that I know it went through successfully.
**Priority:** Medium
**Assumption:** Confirmation is generated automatically by the system without extra action from the student.


