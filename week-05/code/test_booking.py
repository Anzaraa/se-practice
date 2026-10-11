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


if __name__ == "__main__":
    unittest.main()