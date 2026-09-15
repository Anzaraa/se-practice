marks = input().split(",")

valid_marks = []

for mark in marks:
    try:
        value = float(mark.strip())

        if 0 <= value <= 100:
            valid_marks.append(value)

    except ValueError:
        continue

if not valid_marks:
    print("No valid marks. No statistics available.")
else:
    count = len(valid_marks)
    average = sum(valid_marks) / count
    highest = max(valid_marks)
    lowest = min(valid_marks)
    passing = sum(mark >= 50 for mark in valid_marks)
    pass_rate = passing / count * 100


    print(f"Number of valid marks: {count}")
    print(f"Average: {average:.2f}")
    print(f"Highest: {highest:g}")
    print(f"Lowest: {lowest:g}")
    print(f"Pass rate: {pass_rate:.1f}%")