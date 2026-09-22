def analyze_marks(marks, pass_mark=50):
    """
    Analyze a list of numeric marks (0-100).

    Returns a dict with:
        - average: mean of all marks
        - highest: maximum mark
        - lowest: minimum mark
        - pass_rate: percentage of marks >= pass_mark

    Raises:
        ValueError: if marks is empty, contains non-numeric values,
                    or contains values outside the 0-100 range.
    """
    if not marks:
        raise ValueError("marks list cannot be empty")

    for m in marks:
        if isinstance(m, bool) or not isinstance(m, (int, float)):
            raise ValueError(f"non-numeric mark found: {m!r}")
        if m < 0 or m > 100:
            raise ValueError(f"mark out of range (0-100): {m!r}")

    total = sum(marks)
    count = len(marks)
    average = total / count
    highest = max(marks)
    lowest = min(marks)
    passed = sum(1 for m in marks if m >= pass_mark)
    pass_rate = (passed / count) * 100

    return {
        "average": round(average, 2),
        "highest": round(highest, 2),
        "lowest": round(lowest, 2),
        "pass_rate": round(pass_rate, 2),
    }


# ---------------- Tests ----------------
if __name__ == "__main__":

    def expect_value_error(func, *args, **kwargs):
        try:
            func(*args, **kwargs)
        except ValueError as e:
            print(f"  OK - raised ValueError: {e}")
        else:
            raise AssertionError("Expected ValueError but none was raised")

    # Basic example from the prompt
    result = analyze_marks([40, 60, 80], 50)
    assert result == {"average": 60.0, "highest": 80, "lowest": 40, "pass_rate": 66.67}, result
    print("Basic example:", result)

    # 1. Single mark
    result = analyze_marks([75])
    assert result == {"average": 75, "highest": 75, "lowest": 75, "pass_rate": 100.0}
    print("One mark:", result)

    # 2. Decimal marks
    result = analyze_marks([55.5, 60.25, 70.1])
    print("Decimals:", result)
    assert result["average"] == round((55.5 + 60.25 + 70.1) / 3, 2)

    # 3. Custom pass_mark
    result = analyze_marks([30, 45, 60, 90], pass_mark=60)
    assert result["pass_rate"] == 50.0
    print("Custom pass_mark:", result)

    # 4. Empty list
    print("Empty list:")
    expect_value_error(analyze_marks, [])

    # 5. Text value
    print("Text value:")
    expect_value_error(analyze_marks, [50, "sixty", 70])

    # 6. Marks below 0 or above 100
    print("Below 0:")
    expect_value_error(analyze_marks, [-5, 50, 70])
    print("Above 100:")
    expect_value_error(analyze_marks, [50, 105])

    print("\nAll tests passed.")