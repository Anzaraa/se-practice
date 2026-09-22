def analyze_marks(marks, pass_mark=50):
    """
    Analyze a list of student marks.

    Args:
        marks (list): Non-empty list of numeric marks (int or float), each in [0, 100].
        pass_mark (int/float): Minimum mark (inclusive) required to pass. Default 50.

    Returns:
        dict: {
            "average": float,
            "highest": int/float,
            "lowest": int/float,
            "pass_rate": float
        }

    Raises:
        ValueError: if marks is empty, contains a non-numeric value (including bool),
                    or contains a value outside the 0-100 range.
    """
    if not isinstance(marks, list) or len(marks) == 0:
        raise ValueError("marks must be a non-empty list.")

    for m in marks:
        # Reject booleans explicitly (bool is a subclass of int in Python)
        if isinstance(m, bool):
            raise ValueError(f"Invalid mark: {m!r}. Boolean values are not allowed.")
        if not isinstance(m, (int, float)):
            raise ValueError(f"Invalid mark: {m!r}. Marks must be int or float.")
        if m < 0 or m > 100:
            raise ValueError(f"Invalid mark: {m!r}. Marks must be between 0 and 100.")

    total = sum(marks)
    count = len(marks)

    average = round(total / count, 2)
    highest = max(marks)
    lowest = min(marks)

    pass_count = sum(1 for m in marks if m >= pass_mark)
    pass_rate = round((pass_count / count) * 100, 2)

    return {
        "average": average,
        "highest": highest,
        "lowest": lowest,
        "pass_rate": pass_rate,
    }


# ----------------------------
# Tests
# ----------------------------
if __name__ == "__main__":

    # 1. Basic case from the prompt
    result = analyze_marks([40, 60, 80], 50)
    assert result == {"average": 60.0, "highest": 80, "lowest": 40, "pass_rate": 66.67}, result

    # 2. Single mark
    result = analyze_marks([100], 50)
    assert result == {"average": 100, "highest": 100, "lowest": 100, "pass_rate": 100.0}, result

    # 3. Decimal marks
    result = analyze_marks([49.5, 50], 50)
    assert result == {"average": 49.75, "highest": 50, "lowest": 49.5, "pass_rate": 50.0}, result

    # 4. Custom pass_mark
    result = analyze_marks([30, 45, 60, 90], 60)
    assert result["pass_rate"] == 50.0, result

    # 5. Empty list -> ValueError
    try:
        analyze_marks([])
        assert False, "Expected ValueError for empty list"
    except ValueError:
        pass

    # 6. Non-numeric (text) value -> ValueError
    try:
        analyze_marks([40, "60"])
        assert False, "Expected ValueError for text value"
    except ValueError:
        pass

    # 7. Marks outside 0-100 range -> ValueError
    try:
        analyze_marks([-1, 50, 101])
        assert False, "Expected ValueError for out-of-range marks"
    except ValueError:
        pass

    # 8. Boolean value should be rejected
    try:
        analyze_marks([40, True])
        assert False, "Expected ValueError for boolean value"
    except ValueError:
        pass

    print("All tests passed.")