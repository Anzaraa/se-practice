import unittest
from booking import can_book

# Base input for every test unless the test says otherwise:
# now=540, blocked=False, existing=[(600, 660)].
NOW = 540
BASE = [(600, 660)]


class BookingTests(unittest.TestCase):
    # ---- The six table cases -------------------------------------------

    def test_touching_end_is_allowed(self):
        result = can_book(660, 720, 540, False, [(600, 660)])
        self.assertIs(result, True)

    def test_partial_overlap_is_rejected(self):  # AC4
        self.assertIs(can_book(630, 690, NOW, False, [(600, 660)]), False)

    def test_blocked_room_is_rejected(self):  # AC3
        self.assertIs(can_book(660, 720, NOW, True, [(600, 660)]), False)

    def test_exactly_two_hours_is_allowed(self):  # AC2
        self.assertIs(can_book(720, 840, NOW, False, [(600, 660)]), True)

    def test_over_two_hours_is_rejected(self):  # AC2
        self.assertIs(can_book(720, 841, NOW, False, [(600, 660)]), False)

    def test_starting_now_is_rejected(self):  # AC1 start > now
        self.assertIs(can_book(540, 570, NOW, False, [(600, 660)]), False)

    # ---- AC1: zero-length and reversed ---------------------------------

    def test_zero_length_is_rejected(self):  # AC1 start < end
        self.assertIs(can_book(700, 700, NOW, False, [(600, 660)]), False)

    def test_reversed_times_are_rejected(self):  # AC1 start < end
        self.assertIs(can_book(720, 700, NOW, False, [(600, 660)]), False)

    # ---- AC1: start > now, one minute later ----------------------------

    def test_one_minute_after_now_is_allowed(self):  # AC1 start > now
        self.assertIs(can_book(541, 570, NOW, False, [(600, 660)]), True)

    # ---- AC1: the day bounds -------------------------------------------

    def test_ending_at_midnight_is_allowed(self):  # AC1 end <= 1440
        self.assertIs(can_book(1380, 1440, NOW, False, [(600, 660)]), True)

    def test_ending_after_midnight_is_rejected(self):  # AC1 end <= 1440
        self.assertIs(can_book(1380, 1441, NOW, False, [(600, 660)]), False)

    # ---- AC4: empty and several bookings -------------------------------

    def test_empty_existing_is_allowed(self):  # AC4 nothing to overlap
        self.assertIs(can_book(630, 690, NOW, False, []), True)

    def test_exact_gap_between_two_bookings_is_allowed(self):  # AC4
        existing = [(600, 660), (720, 780)]
        self.assertIs(can_book(660, 720, NOW, False, existing), True)

    def test_conflict_with_a_later_booking_is_rejected(self):  # AC4
        existing = [(600, 660), (800, 860)]
        self.assertIs(can_book(830, 880, NOW, False, existing), False)

    # ---- AC4: the other overlap relationships --------------------------

    def test_touching_start_is_allowed(self):  # AC4
        self.assertIs(can_book(570, 600, NOW, False, [(600, 660)]), True)

    def test_inside_existing_is_rejected(self):  # AC4
        self.assertIs(can_book(615, 645, NOW, False, [(600, 660)]), False)

    def test_containing_existing_is_rejected(self):  # AC4
        self.assertIs(can_book(570, 690, NOW, False, [(600, 660)]), False)

    def test_identical_interval_is_rejected(self):  # AC4
        self.assertIs(can_book(600, 660, NOW, False, [(600, 660)]), False)

    # ---- AC5: inputs unchanged -----------------------------------------

    def test_existing_unchanged_after_accepted_request(self):  # AC5
        existing = [(800, 860), (600, 660)]
        before = list(existing)
        self.assertIs(can_book(700, 760, NOW, False, existing), True)
        self.assertEqual(existing, before)

    def test_existing_unchanged_after_rejected_request(self):  # AC5
        existing = [(800, 860), (600, 660)]
        before = list(existing)
        self.assertIs(can_book(630, 690, NOW, False, existing), False)
        self.assertEqual(existing, before)

     # ---- Task 4: new edge case ----...

    def test_last_minute_of_the_day_is_allowed(self):  # AC1 end <= 1440, duration 1
            self.assertIs(can_book(1439, 1440, NOW, False, [(600, 660)]), True)


if __name__ == "__main__":
    unittest.main()
