import statistics

# Sample data: student name -> list of marks (e.g., subject scores)
students = {
    "Alice": [85, 92, 78, 90, 88],
    "Bob": [65, 70, 60, 75, 68],
    "Charlie": [92, 95, 89, 94, 91],
    "Diana": [45, 50, 55, 48, 52],
    "Ethan": [78, 82, 75, 80, 77],
}

def grade_from_average(avg):
    if avg >= 90:
        return "A"
    elif avg >= 80:
        return "B"
    elif avg >= 70:
        return "C"
    elif avg >= 60:
        return "D"
    else:
        return "F"

def analyze_students(data):
    results = []
    for name, marks in data.items():
        total = sum(marks)
        avg = total / len(marks)
        highest = max(marks)
        lowest = min(marks)
        stdev = statistics.stdev(marks) if len(marks) > 1 else 0.0
        grade = grade_from_average(avg)
        results.append({
            "name": name,
            "total": total,
            "average": round(avg, 2),
            "highest": highest,
            "lowest": lowest,
            "stdev": round(stdev, 2),
            "grade": grade,
        })
    return results

def print_report(results):
    # Sort by average, descending, for ranking
    ranked = sorted(results, key=lambda r: r["average"], reverse=True)

    print(f"{'Rank':<5}{'Name':<10}{'Total':<8}{'Average':<10}{'High':<6}{'Low':<6}{'StDev':<8}{'Grade':<5}")
    print("-" * 60)
    for i, r in enumerate(ranked, start=1):
        print(f"{i:<5}{r['name']:<10}{r['total']:<8}{r['average']:<10}{r['highest']:<6}{r['lowest']:<6}{r['stdev']:<8}{r['grade']:<5}")

    # Class-level stats
    all_averages = [r["average"] for r in results]
    print("\nClass Summary")
    print(f"  Class average: {round(statistics.mean(all_averages), 2)}")
    print(f"  Highest average: {max(all_averages)} ({ranked[0]['name']})")
    print(f"  Lowest average: {min(all_averages)} ({ranked[-1]['name']})")
    print(f"  Pass rate (avg >= 60): {round(sum(1 for a in all_averages if a >= 60) / len(all_averages) * 100, 1)}%")

if __name__ == "__main__":
    results = analyze_students(students)
    print_report(results)