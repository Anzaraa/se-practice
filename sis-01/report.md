# SIS #01 — Software Engineering Fundamentals, With an AI in the Loop


**Topic:** 1.10

---

## 1. Scenario

**Question:** What social challenges (privacy, safety and accountability) does a software-controlled inspection drone create on a university campus, and which safeguards are justified?

**Users:** Campus facilities engineers who plan and run inspection flights; students and staff who live in the dormitories and walk below the flight routes.

**Problem:** Manual roof and facade inspections of six dormitory buildings need scaffolding and take weeks. The facilities team wants a drone that flies preset routes and photographs cracks and leaks.

**Constraints:** (1) Flights are allowed only in daylight, below 60 m and inside the campus boundary. (2) The budget covers one drone and one trained operator.

**Risk:** The high-resolution camera records students through dormitory windows, and the images are stored or shared without consent.

**Assumptions:** Northgate University, its six dormitories, the 60 m limit and the budget are fictional. The drone software is assumed to support geofencing and preset routes.

## 2. Analysis

<!-- 350–400 words. Your answer to the question, the trade-offs, and how it applies to your
     scenario. Explain at least two engineering decisions and why they fit the scenario. -->

(write here)

## 3. Review

<!-- 250–300 words. What Prompt B's critique said and what you did with it; your two source
     checks and your two substantive revisions, each with a reason. Point at the rows of the
     tables in section 9 ("verification row 2", "change-log row 1"). -->

(write here)

## 4. Conclusion

<!-- 100–150 words. Your recommendation for the scenario and its main limitation. -->

(write here)

## 5. Reflection

<!-- 150–200 words. NOT part of the main total. Written by you, not by the assistant:
     what helped, what you changed, what you learned. Specific beats flattering. -->

(write here)

## 6. References

<!-- Full references, one per line, each starting with "- ". Only sources you actually opened.
     Every URL used in the verification table must also appear here. Example:
     - Sommerville, I. (2016). Software Engineering, 10th ed., Global Edition. Pearson. Ch. 1.
-->

- (write here)

## 7. Appendix A — Initial outline

1. To protect students' privacy, the drone's camera should only turn on for takeoff and landing. During flight it should point down, blur faces, and not record video all the time.
2. If the drone falls and someone gets hurt, the university should be responsible, because it owns the system, chose to use the drone, and approved the flight routes. If the crash was caused by a software bug, the development team is also responsible, because they had to test the drone for safety before launch.
3. Photos should be stored on a secure university server that only the operator can access, and deleted after 7 days (fictional), unless there was an incident.
4. Before a flight, students should be warned through a notification in the campus app and signs along the flight route.
5. If there is only one operator, there is a risk that they get tired or distracted and miss a problem. If they are sick, nobody can control the drone.

## 8. Appendix B — AI exchanges

<!-- Complete prompts and complete responses, as text — never screenshots. Paste each inside
     the fenced block that follows its label. If a response itself contains ``` lines, open
     and close that block with ~~~~ instead. You may add B4, B5 … after B3 if you ran more. -->

### B1 — Draft (Prompt A)

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Purpose:** contextual draft

<!-- Model: the exact model with its version, as the tool shows it (e.g. "GPT-5 Thinking",
     "Claude Sonnet 4.5"). If the tool does not show it, write: not displayed
     Date: YYYY-MM-DD -->

**Prompt:**

```text
(paste here)
```

**Response:**

```text
(paste here)
```

### B2 — Critique (Prompt B)

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Purpose:** critical review of the draft

**Prompt:**

```text
(paste here)
```

**Response:**

```text
(paste here)
```

### B3 — Revision (Prompt C)

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Purpose:** revision using my decisions and verified evidence

**Prompt:**

```text
(paste here)
```

**Response:**

```text
(paste here)
```

## 9. Appendix C — Evidence tables

### Verification table

<!-- At least two complete rows. Source and locator: title + page / slide / section / chapter,
     or title + URL + access date (YYYY-MM-DD). Decision: keep, qualify or reject — one word. -->

| AI claim | Source and locator | Evidence found | Decision |
| --- | --- | --- | --- |
| (write here) | (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) | (write here) |

### Change log

<!-- At least two substantive revisions. Your final version must differ from the AI wording,
     and the reason must say which evidence or scenario constraint made you change it. -->

| AI wording / suggestion | Your final version | Reason for change |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |
