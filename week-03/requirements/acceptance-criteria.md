# Acceptance criteria — three selected stories

Assumptions first, then the criteria. Each block names the story it belongs to. 3 to 5 criteria per
story, every one in Given / When / Then form, and every set covers a validation or error case — not
three happy paths.

---

## Assumptions

These must settle the two questions the scenario leaves open. Either answer is accepted; no answer
is not.

- **Overlap:** A booking that ends exactly when another begins is not an overlap under R3. Back-to-back bookings are allowed because they do not share any time.

- **Duration:** A booking of exactly two hours is allowed under R2 because the maximum duration is two hours.
- Additional assumption: When a room is blocked, existing bookings remain unchanged. The room cannot be booked for new reservations while it is blocked.
- Additional assumption: Only an Administrator can block or unblock a room.
---

## US-02 — Reserve a Study Room

### AC-01
- **Given** a student selects an available room and a future time slot of up to two hours
- **When** the student books the room
- **Then** the system creates the booking and confirms the reservation.

### AC-02
- **Given** a student selects a time slot that starts in the past or at the current time
- **When** the student tries to book the room
- **Then** the system rejects the booking because bookings must start in the future.

### AC-03
- **Given** a student selects a time slot longer than two hours
- **When**  the student tries to book the room
- **Then**  the system rejects the booking because the maximum duration is two hours.

### AC-04
- **Given** a room has an existing booking that overlaps with the selected time slot
- **When**  a student tries to book the room for that time
- **Then**  the system rejects the booking because overlapping bookings are not allowed.

### AC-05

- **Given** a room is blocked
- **When** a student tries to book the room
- **Then** the system rejects the booking because blocked rooms cannot be booked.
---

## US-03 — Cancel a Reservation

### AC-06

- **Given** a student has an existing booking that has not started
- **When** the student cancels the booking
- **Then** the system cancels the booking and confirms the cancellation.

### AC-07

- **Given** a student has an existing booking that has already started
- **When** the student tries to cancel the booking
- **Then** the system rejects the cancellation.

### AC-08

- **Given** a student tries to cancel a booking that does not exist
- **When** the student submits the cancellation request
- **Then** the system rejects the cancellation because the booking cannot be found.

### AC-09

- **Given** a student has an existing booking that has not started
- **When** the student cancels the booking successfully
- **Then** the cancelled time slot becomes available for a new booking, provided the room is not blocked.
---

## US-04 — Block or Unblock a Study Room

### AC-10

- **Given** an Administrator selects a room that is not blocked
- **When** the Administrator blocks the room
- **Then** the system marks the room as blocked and prevents new bookings.

### AC-11

- **Given** a room is blocked
- **When** an Administrator unblocks the room
- **Then** the system marks the room as available for new bookings.

### AC-12

- **Given** a Student tries to block or unblock a room
- **When** the Student submits the request
- **Then** the system rejects the request because only an Administrator can block or unblock a room.

### AC-13

- **Given** a room has existing bookings
- **When** an Administrator blocks the room
- **Then** the existing bookings remain unchanged, but new bookings are not allowed.

---