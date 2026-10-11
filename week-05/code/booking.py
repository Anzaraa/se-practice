"""Smart Campus study room booking: availability check for one room."""


def can_book(start, end, now, blocked, existing):
    """Return True if a booking [start, end) is allowed, otherwise False.

    Times are integer minutes after midnight on one date.
    Intervals include the start and exclude the end.
    `existing` holds (start, end) tuples of this room's active bookings
    and is only read, never modified.
    """
    # AC1: valid window within the day, and start strictly after now.
    if not (0 <= start < end <= 1440):
        return False
    if start <= now:
        return False

    # AC2: duration of at most 120 minutes.
    if end - start > 120:
        return False

    # AC3: the room must not be blocked.
    if blocked:
        return False

    # AC4: no overlap with any existing booking; touching endpoints are allowed.
    for booked_start, booked_end in existing:
        if start < booked_end and booked_start < end:
            return False

    # AC5: every condition holds.
    return True
