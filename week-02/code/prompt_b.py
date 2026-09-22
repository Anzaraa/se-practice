def analyze_marks(marks, pass_mark=50):
    """
    Analyze a list of numeric marks.

    Parameters
    ----------
    marks : list of int/float
        Marks to analyze, each expected to be in the range 0-100.
    pass_mark : int/float, optional
        The minimum mark (inclusive) required to count as a pass. Default is 50.

    Returns
    -------
    dict with keys:
        'average'   : float, mean of all marks
        'highest'   : float/int, the maximum mark
        'lowest'    : float/int, the minimum mark
        'pass_rate' : float, percentage (0-100) of marks >= pass_mark

    Raises
    ------
    ValueError
        If marks is empty, contains non-numeric values, or values outside 0-100.
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
        "average": average,
        "highest": highest,
        "lowest": lowest,
        "pass_rate": pass_rate,
    }


if __name__ == "__main__":
    # Example usage
    sample = [55, 90, 42, 78, 33, 100, 60]
    print(analyze_marks(sample))
    print(analyze_marks(sample, pass_mark=60))