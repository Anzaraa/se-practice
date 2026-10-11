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

The drone raises three social challenges: privacy, safety and accountability. A safeguard counts as justified if it reduces a serious harm, still lets the inspection find defects, and fits the constraints: daylight only, below 60 m, inside campus, one drone and one operator.

**Software control.** Because the drone follows preset routes, errors can come from software, not only from the pilot: a wrong waypoint, an inaccurate position, or a geofence that fails to keep it below 60 m and inside campus. A supervisor checks each new route, tests it over an empty area, and sets the geofence with a safety margin. Under the comparable US rule, the pilot must keep the drone in sight for the whole flight (14 CFR § 107.31), so the operator can take over if the software misbehaves.

**Privacy.** Cracks around window frames matter, so only the glass is blurred automatically. The drone takes still photos at preset points, not video, and a person checks images before sharing, because blurring can fail. Under a fictional campus rule, notice and blurring replace individual consent; signs and an app message give the flight time, so residents can ask for deletion.

**Data path.** Before buying, the university checks where the chosen drone stores photos; DJI reports that photos go to the SD card first and that syncing with its servers is opt-in (verification row 2). Photos move to a university server with logged access for the operator and a supervisor. Raw images are deleted after a fictional 7 days; cropped defect photos are kept.

**Safety.** Paths fill up between classes, so flights follow outdoor foot traffic, and return-to-home uses a preset route away from paths. Within the budget, cordons and a helper cover only high-risk entrances. An active leak needs quick action. If the only operator is ill, a facilities engineer inspects the leak from inside the building or from the ground, and the drone flight waits until the operator returns.

**Accountability.** The university chose the system, approved the routes and controls the data, so it is primarily accountable to residents; a contractor's duties belong in the contract. Whoever leaks images is responsible, but so is the university if its access controls were weak. A software fault may shift some responsibility to the manufacturer.

Each safeguard targets a specific harm for a little extra staff time; the exact cost is an assumption.

## 3. Review


**Prompt B's critique.** Prompt B raised 16 concerns. I accepted 11, qualified 5 and rejected none, and I treated each as a claim to judge, not as evidence. The most important was #4: the draft ignored the "software-controlled" part of the question, so I added route, position and geofence errors and a supervisor route check. I accepted #2 because cracks around window frames are what the inspection looks for, so only glass is blurred. I qualified #5: the budget is limited, but cordons and a helper are still needed at high-risk entrances, so I reduced these safeguards instead of removing them. For #14 I first wanted to reject, arguing that the operator is a university employee, but my scenario never says so, so I accepted it and added the contractor case.

**Source checks.** Verification row 1: the draft said drone rules may require "a second observer". 14 CFR § 107.31 (p. 918) requires line of sight but mentions a visual observer only "if one is used", so I qualified the claim: one operator remains possible, and US rules are only a comparison. Verification row 2: Prompt B said drones "often sync to the manufacturer's app or cloud". DJI says syncing is opt-in, and Help Net Security (2017) confirms SD-card storage, so I qualified it and changed decision 8 from accept to qualify.

**Revisions.** Change-log row 1: the draft named urgent leaks but not who acts when the only operator is ill; because of the one-operator budget, a facilities engineer now inspects without the drone. Change-log row 2: the SD-card claim is limited to DJI and turned into a pre-purchase check (verification row 2).

**Unverified.** Blurring accuracy and liability law remain assumptions.

## 4. Conclusion

The campus inspection drone can be launched, but first as a pilot project and only with the main safeguards. It should fly preset safe routes, including a preset return-to-home route, outside the times between classes, with one operator who keeps the drone in sight at all times, and students should be notified through the campus app and signs. Photos should be stored only on the SD card and the university server, with cloud sync switched off, the window glass blurred, and raw images deleted after 7 days unless there was an incident.

The main limitation of this recommendation is that the scenario, the costs and the campus rules are fictional, and the rules I verified (FAA) apply to the United States. Before a real launch, the local law must be checked.

## 5. Reflection

**What helped**

The most useful moment was when the AI noticed that my idea #1, keeping the camera off or pointed down, contradicted the goal, because then the facade could not be photographed at all. I did not notice that the topic is called “software-controlled” until Prompt B pointed out that I said nothing about route or GPS errors (#4).

**What I changed**

At first I decided to reject #14, but then I realised that my scenario does not state the operator’s status. I changed #8 from accept to qualify because the source supported only part of it. I did not fully agree with the AI about #5: the safety measures should be reduced, not removed. If the operator is ill, I chose an inspection without the drone, because the budget covers only one pilot.

**What I learned**

I learned that a source can confirm only half of a claim: the sources confirmed the SD card, but not “often syncs”. I first gave a link to § 107.37 instead of § 107.31, so next time I will check every reference carefully. Now I understand that AI feedback is also a claim that must be verified.

## 6. References


- U.S. Federal Aviation Administration. 14 CFR Part 107 — Small Unmanned Aircraft Systems, § 107.31 Visual line of sight aircraft operation and § 107.33 Visual observer. Code of Federal Regulations, Title 14, Vol. 2, 1 January 2025 edition, p. 918. https://www.govinfo.gov/content/pkg/CFR-2025-title14-vol2/pdf/CFR-2025-title14-vol2-sec107-31.pdf (accessed 2026-10-11)
- DJI. "DJI to Disable Flight Records Sync in the U.S." DJI Viewpoints. https://viewpoints.dji.com/blog/dji-to-disable-flight-record-sync-in-the-us (accessed 2026-10-11)
- Help Net Security (2017, 3 October). "DJI launches privacy mode for drone operators." https://www.helpnetsecurity.com/2017/10/03/dji-local-data-mode/ (accessed 2026-10-11)

## 7. Appendix A — Initial outline

1. To protect students' privacy, the drone's camera should only turn on for takeoff and landing. During flight it should point down, blur faces, and not record video all the time.
2. If the drone falls and someone gets hurt, the university should be responsible, because it owns the system, chose to use the drone, and approved the flight routes. If the crash was caused by a software bug, the development team is also responsible, because they had to test the drone for safety before launch.
3. Photos should be stored on a secure university server that only the operator can access, and deleted after 7 days (fictional), unless there was an incident.
4. Before a flight, students should be warned through a notification in the campus app and signs along the flight route.
5. If there is only one operator, there is a risk that they get tired or distracted and miss a problem. If they are sick, nobody can control the drone.

## 8. Appendix B — AI exchanges

### B1 — Draft (Prompt A)

- **Tool:** Claude
- **Model:** Claude Opus 5.5
- **Date:** 2026.10.11
- **Purpose:** contextual draft



**Prompt:**

```text
Act as a software engineering tutor. Help me analyze topic 1.10 — What social challenges (privacy, safety and accountability) does a software-controlled inspection drone create on a university campus, and which safeguards are justified? — for a first-year-level university assignment.

My scenario is: Users: campus facilities engineers who plan and run inspection flights; students and staff who live in the dormitories and walk below the flight routes. Problem: manual roof and facade inspections of six dormitory buildings need scaffolding and take weeks; the facilities team wants a drone that flies preset routes and photographs cracks and leaks. Constraints: (1) flights are allowed only in daylight, below 60 m and inside the campus boundary; (2) the budget covers one drone and one trained operator. Risk: the high-resolution camera records students through dormitory windows, and the images are stored or shared without consent. (Northgate University, its six dormitories, the 60 m limit and the budget are fictional.) My initial ideas are: (1) To protect students' privacy, the drone's camera should only turn on for takeoff and landing. During flight it should point down, blur faces, and not record video all the time. (2) If the drone falls and someone gets hurt, the university should be responsible, because it owns the system, chose to use the drone, and approved the flight routes. If the crash was caused by a software bug, the development team is also responsible, because they had to test the drone for safety before launch. (3) Photos should be stored on a secure university server that only the operator can access, and deleted after 7 days (fictional), unless there was an incident. (4) Before a flight, students should be warned through a notification in the campus app and signs along the flight route. (5) If there is only one operator, there is a risk that they get tired or distracted and miss a problem. If they are sick, nobody can control the drone. Draft a 400–500 word explanation using these details.

Separate facts from assumptions. Explain trade-offs and identify claims I should verify. Do not invent quotations, references or page numbers.
```

**Response:**

```text
Draft (about 480 words)

Social challenges and safeguards for a campus inspection drone

Northgate University’s facilities team wants to replace scaffolding-based inspections of six dormitories with a drone that flies preset routes and photographs cracks and leaks. The scenario sets several facts. Flights are limited to daylight, below 60 m, and inside the campus boundary. The budget covers one drone and one trained operator. The users are the engineers who plan the flights and the students and staff who live in the dormitories or walk under the routes. The main risk is that the high-resolution camera records people through windows, and the images are stored or shared without consent. The drone therefore raises three social challenges: privacy, safety and accountability.

Privacy. A facade inspection needs the camera to face the walls, and the walls contain windows. Pointing the camera down or switching it off during flight would defeat the purpose. A more realistic safeguard is data minimisation:

take still photos only at preset inspection points, not continuous video;
mask window areas or blur people automatically;
schedule flights when rooms are less likely to be occupied.

This assumes automatic blurring works well, but it can miss faces, so a human should check images before they are shared. Notice through the campus app and signs respects residents, but notice is not consent. Residents should also have a way to raise concerns or ask for images to be deleted.

Storage. Raw images should be kept on a secure university server with role-based access, not on personal devices. If only the single operator has access, nobody can reach the data when that person is absent. A named supervisor should also have access, and every access should be logged. A short retention period, such as the fictional 7 days, limits harm, but engineers may need images longer to track how a crack develops. A reasonable compromise is to delete raw images quickly and keep cropped defect photos, with people removed, as maintenance records.

Safety. Low altitude and daylight reduce risk but do not remove it, because people walk under the routes. Safeguards include:

avoiding busy paths at peak times;
temporary ground cordons;
automatic return-to-home when signal or battery is lost;
pre-flight checklists.

With one operator, fatigue and illness are real risks. Inspections are not urgent, so the simplest safeguard is to postpone flights rather than fly tired, and to limit how long each session lasts.

Accountability. The university chose the system, approved the routes and employs the operator, so it should carry primary responsibility to the people affected. If a software fault causes a crash, the manufacturer or developer may share responsibility, but that depends on contracts and law. Flight logs and incident reports make it possible to find out what happened.

Overall, these safeguards are justified because they reduce serious harm at modest cost while still letting the drone save weeks of scaffolding work.

Tutor notes

Changes to your ideas, and why

Idea 1 contradicted the goal. A camera that is off during flight, or pointing down, can’t photograph facades. I replaced it with still photos at set points plus masking and blurring.
Idea 2 assumed a “development team.” The university will most likely buy a commercial drone, so the developer is probably an outside vendor. That makes the question one of contracts, not internal testing.
Idea 3 created a single point of failure: access for one operator only, who could be absent. That is the same problem you raised in idea 5. I also flagged that 7 days may be too short for engineering use.
Idea 4 was kept, with the point that notice is not the same as consent.
Idea 5 was kept. Postponing flights is a cheaper fix than hiring a backup, which the budget doesn’t allow.

Facts (given in the scenario): the users, the six dormitories, daylight, 60 m, campus boundary, one drone, one operator, and the privacy risk.

Assumptions (yours and mine): that blurring is reliable, that students read app notifications, that rooms are emptier at certain times, that the vendor shares liability, and that inspections can be delayed safely.

Claims to verify before submitting

Your country’s aviation rules for small drones. Many require visual line of sight, registration, or a second observer, which would affect the one-operator constraint.
Data-protection law on images of identifiable people, including how long they may be kept and whether notice is enough.
How accurate automatic face and person blurring actually is in drone software.
Who is legally liable for injuries: the owner, the operator, or the manufacturer.

If you’d like, I can turn this into a doc you can edit and export.
```

### B2 — Critique (Prompt B)

- **Tool:** Claude
- **Model:** Claude Opus 5.5
- **Date:** 2026.10.11
- **Purpose:** critical review of the draft

**Prompt:**

```text
Review the draft below against my chosen question and scenario. Identify inaccuracies, missing reasoning, vague claims and unsupported assumptions.
For each concern, explain why it matters and how I could check it. Include a counterexample or alternative interpretation. Do not rewrite the answer yet.
Question: 1.10 — What social challenges (privacy, safety and accountability) does a software-controlled inspection drone create on a university campus, and which safeguards are justified? Scenario: Users: campus facilities engineers who plan and run inspection flights; students and staff who live in the dormitories and walk below the flight routes. Problem: manual roof and facade inspections of six dormitory buildings need scaffolding and take weeks; the facilities team wants a drone that flies preset routes and photographs cracks and leaks. Constraints: (1) flights are allowed only in daylight, below 60 m and inside the campus boundary; (2) the budget covers one drone and one trained operator. Risk: the high-resolution camera records students through dormitory windows, and the images are stored or shared without consent. (Northgate University, its six dormitories, the 60 m limit and the budget are fictional.) Draft: Draft (about 480 words)

Social challenges and safeguards for a campus inspection drone

Northgate University’s facilities team wants to replace scaffolding-based inspections of six dormitories with a drone that flies preset routes and photographs cracks and leaks. The scenario sets several facts. Flights are limited to daylight, below 60 m, and inside the campus boundary. The budget covers one drone and one trained operator. The users are the engineers who plan the flights and the students and staff who live in the dormitories or walk under the routes. The main risk is that the high-resolution camera records people through windows, and the images are stored or shared without consent. The drone therefore raises three social challenges: privacy, safety and accountability.

Privacy. A facade inspection needs the camera to face the walls, and the walls contain windows. Pointing the camera down or switching it off during flight would defeat the purpose. A more realistic safeguard is data minimisation:

take still photos only at preset inspection points, not continuous video;
mask window areas or blur people automatically;
schedule flights when rooms are less likely to be occupied.

This assumes automatic blurring works well, but it can miss faces, so a human should check images before they are shared. Notice through the campus app and signs respects residents, but notice is not consent. Residents should also have a way to raise concerns or ask for images to be deleted.

Storage. Raw images should be kept on a secure university server with role-based access, not on personal devices. If only the single operator has access, nobody can reach the data when that person is absent. A named supervisor should also have access, and every access should be logged. A short retention period, such as the fictional 7 days, limits harm, but engineers may need images longer to track how a crack develops. A reasonable compromise is to delete raw images quickly and keep cropped defect photos, with people removed, as maintenance records.

Safety. Low altitude and daylight reduce risk but do not remove it, because people walk under the routes. Safeguards include:

avoiding busy paths at peak times;
temporary ground cordons;
automatic return-to-home when signal or battery is lost;
pre-flight checklists.

With one operator, fatigue and illness are real risks. Inspections are not urgent, so the simplest safeguard is to postpone flights rather than fly tired, and to limit how long each session lasts.

Accountability. The university chose the system, approved the routes and employs the operator, so it should carry primary responsibility to the people affected. If a software fault causes a crash, the manufacturer or developer may share responsibility, but that depends on contracts and law. Flight logs and incident reports make it possible to find out what happened.

Overall, these safeguards are justified because they reduce serious harm at modest cost while still letting the drone save weeks of scaffolding work.

Tutor notes

Changes to your ideas, and why

Idea 1 contradicted the goal. A camera that is off during flight, or pointing down, can’t photograph facades. I replaced it with still photos at set points plus masking and blurring.
Idea 2 assumed a “development team.” The university will most likely buy a commercial drone, so the developer is probably an outside vendor. That makes the question one of contracts, not internal testing.
Idea 3 created a single point of failure: access for one operator only, who could be absent. That is the same problem you raised in idea 5. I also flagged that 7 days may be too short for engineering use.
Idea 4 was kept, with the point that notice is not the same as consent.
Idea 5 was kept. Postponing flights is a cheaper fix than hiring a backup, which the budget doesn’t allow.

Facts (given in the scenario): the users, the six dormitories, daylight, 60 m, campus boundary, one drone, one operator, and the privacy risk.

Assumptions (yours and mine): that blurring is reliable, that students read app notifications, that rooms are emptier at certain times, that the vendor shares liability, and that inspections can be delayed safely.

Claims to verify before submitting

Your country’s aviation rules for small drones. Many require visual line of sight, registration, or a second observer, which would affect the one-operator constraint.
Data-protection law on images of identifiable people, including how long they may be kept and whether notice is enough.
How accurate automatic face and person blurring actually is in drone software.
Who is legally liable for injuries: the owner, the operator, or the manufacturer.

If you’d like, I can turn this into a doc you can edit and export.
```

**Response:**

```text
Review of the draft

The draft is organised clearly, but it has several problems. The most serious are internal contradictions, a weak treatment of the “software-controlled” part of the question, and safeguards that quietly break the budget constraint.

Inaccuracies and internal contradictions

1. Two scheduling safeguards pull against each other.
The draft says to fly “when rooms are less likely to be occupied” and also to avoid “busy paths at peak times.” When students are out of their rooms (in class), they are often walking between buildings, which is when paths are busiest.

Why it matters: The draft presents these as compatible, when they are actually a privacy-versus-safety trade-off. That trade-off is exactly what the question asks you to analyse.
How to check: Think through a typical weekday timetable, or ask facilities when dorms and paths are each quietest.
Alternative view: Weekend mornings may be quiet on paths but full in rooms. No single time solves both risks.

2. Masking windows may hide the defects the drone is looking for.
Leaks and cracks often appear around window frames, seals and sills.

Why it matters: A safeguard that defeats the inspection’s purpose is not “justified.” It just moves the problem somewhere else.
How to check: Look for common causes of facade water ingress in general building-maintenance sources, or ask a facilities engineer.
Alternative: Mask only the glass, not the frame. Or blur after capture instead of masking during capture.

3. The “facts” list includes the risk itself.
The scenario names a risk (images could be captured and shared). It does not say this has happened.

Why it matters: Calling it a fact overstates the case. A marker may notice that the draft is mixing up likelihood and occurrence.
Missing reasoning

4. “Software-controlled” is almost ignored.
The question highlights software control, but the draft treats the drone mainly as a camera with an operator. It does not discuss:

what happens if the preset route, GPS or geofence is wrong (for example, flying outside the boundary or above 60 m);
who wrote or approved the route software;
how much the operator actually controls during autonomous flight.
Why it matters: Accountability changes with automation. If the drone flies itself, operator fatigue matters less, and route validation and software testing matter more.
Counterexample: A crash caused by a mistyped waypoint is neither a “software fault” nor operator fatigue. Under the draft’s framework, it is unclear who is responsible.

5. The safeguards quietly exceed the budget.
Ground cordons, a supervisor with data access, and human review of every image all need extra people or time. The budget covers one operator.

Why it matters: The constraints are part of the scenario. Ignoring them makes the safeguards less “justified” than the draft claims.
How to check: For each safeguard, ask: who does this, and is that person in the budget?

6. Accountability covers only crashes, not privacy breaches.
The draft does not say who is responsible if images are leaked or misused. Yet that is the risk the scenario actually names.

Alternative: Responsibility could fall on the person who shared the images, on the data owner (the university), or on both.

7. No criteria for “justified.”
The question asks which safeguards are justified, but the draft never says what makes one justified. Possible criteria are severity of harm, likelihood, cost, and whether the inspection still works.

Why it matters: Without criteria, the conclusion (“modest cost”) is an assertion, not an argument.

8. Data may never reach the university server.
Commercial drones usually store images on an SD card and often sync to the manufacturer’s app or cloud. The storage safeguard starts too late in the data flow.

How to check: Read the data-handling documentation for a typical inspection drone.

9. The deletion right isn’t workable as described.
A resident cannot ask for deletion if they don’t know they were photographed.

Alternative: Default blurring may matter more than on-request deletion.
Vague claims

10. “Reduce serious harm at modest cost” has no cost estimate or comparison behind it.

11. “Notice is not consent” is true as a general principle. Whether consent is legally required depends on local data-protection law, which may allow processing on other grounds.

How to check: Look up the lawful bases for processing personal data in the relevant law.

12. “Return-to-home” is presented as purely safe, but the automatic return path can itself cross busy areas.

Counterexample: A drone losing signal near a path flies straight back over the crowd it was meant to avoid.
Unsupported assumptions

13. “Inspections are not urgent.”
A visible leak or a loose facade element could be urgent. Postponing flights then becomes a safety risk of its own.

How to check: Ask how facilities currently prioritise defects.

14. “The university employs the operator.”
The operator could be a contractor, which changes who is accountable.

15. “The university will most likely buy a commercial drone” (tutor note). This is plausible but not stated in the scenario. It should be marked as an assumption.

16. “Engineers may need images longer than 7 days.”
This is reasonable but unverified, and the retention period should depend on the inspection cycle.

How to check: Ask how often the dorms are re-inspected.
Missing from the verification list
Whether geofencing software reliably enforces the 60 m limit and the campus boundary.
Where commercial drone apps send image data.
Whether students count as “users.” They are better described as affected stakeholders, and the difference matters when you discuss whose consent is needed.

Highest priority to fix: #4 (software control), #1 and #2 (contradictions), and #5 (budget). These are the points a marker is most likely to notice.
```

### B3 — Revision (Prompt C)

- **Tool:** Claude
- **Model:** Claude Opus 5.5
- **Date:** 2026.10.11
- **Purpose:** revision using my decisions and verified evidence

**Prompt:**

```text
Revise the draft using my review decisions and source notes below. Keep the answer relevant to my scenario and preserve uncertainty where evidence is limited.

My decisions: (1) Accept: paths fill up between classes, so flights should be planned around outdoor foot traffic, not around empty rooms. (2) Accept: cracks around window frames matter for the inspection, so only the glass should be blurred, not the whole window area. (3) Accept: a risk is a possible event, so it belongs under Risk, not under facts. (4) Accept: the topic is software-controlled drones, so without route, GPS and geofence errors the main part of the topic is missing. (5) Qualify: the budget is limited, but a supervisor and cordons are needed at least in dangerous areas, so the safeguards should be reduced, not removed. (6) Accept: a photo leak also harms students, so the draft must say who is responsible for it. (7) Accept: without criteria (for example, risk reduction versus cost) the word "justified" proves nothing. (8) Accept: many commercial drones really work this way, so the data path should be described honestly, including turning off the manufacturer's cloud sync. (9) Accept: a deletion right is useless without notice, so signs and an app message about the filming time are needed. (10) Qualify: the exact cost cannot be calculated in a study scenario, but it should be marked as an assumption with a rough estimate. (11) Qualify: the law decides whether consent is needed, but the assumptions can state that we follow a fictional campus rule. (12) Accept: a direct return path can cross a crowd, so return-to-home should follow a preset safe route. (13) Accept: a leak can quickly damage the building, so urgency should be judged by the type of problem, not by treating everything as non-urgent. (14) Accept: the scenario does not state the operator's status, so the operator could be a contractor, and the report should take this case into account. (15) Accept: this decision has not been made yet, so it should be moved to assumptions and labelled. (16) Qualify: 7 days is not verified, but for a study scenario it is enough to label the period as fictional and explain why it is short. Verified evidence: (1) US FAA, 14 CFR Part 107, § 107.31 (visual line of sight) and § 107.33 (visual observer), govinfo.gov, CFR 2025 edition, p. 918, https://www.govinfo.gov/content/pkg/CFR-2025-title14-vol2/pdf/CFR-2025-title14-vol2-sec107-31.pdf, accessed 2026-10-11: § 107.31 says the pilot must be able to see the drone during the whole flight. A visual observer is mentioned only "if one is used", so a second person is optional, not required. These are US rules; our campus rules are fictional. Decision: qualify. (2) DJI Newsroom, "DJI to Disable Flight Records Sync in the U.S.", https://viewpoints.dji.com/blog/dji-to-disable-flight-record-sync-in-the-us, accessed 2026-10-11; Help Net Security, "DJI launches privacy mode for drone operators", 3 Oct 2017, https://www.helpnetsecurity.com/2017/10/03/dji-local-data-mode/, accessed 2026-10-11: DJI says syncing data with DJI is opt-in, not on by default, and since June 2024 flight-record sync is turned off in the US. Help Net Security reports that photos and videos are always stored on the drone's SD card. The SD-card part is correct, but "often sync to the cloud" is too strong. Decision: qualify (this changes my decision 8 from accept to qualify). Draft: Draft (about 480 words)

Social challenges and safeguards for a campus inspection drone

Northgate University’s facilities team wants to replace scaffolding-based inspections of six dormitories with a drone that flies preset routes and photographs cracks and leaks. The scenario sets several facts. Flights are limited to daylight, below 60 m, and inside the campus boundary. The budget covers one drone and one trained operator. The users are the engineers who plan the flights and the students and staff who live in the dormitories or walk under the routes. The main risk is that the high-resolution camera records people through windows, and the images are stored or shared without consent. The drone therefore raises three social challenges: privacy, safety and accountability.

Privacy. A facade inspection needs the camera to face the walls, and the walls contain windows. Pointing the camera down or switching it off during flight would defeat the purpose. A more realistic safeguard is data minimisation:

take still photos only at preset inspection points, not continuous video;
mask window areas or blur people automatically;
schedule flights when rooms are less likely to be occupied.

This assumes automatic blurring works well, but it can miss faces, so a human should check images before they are shared. Notice through the campus app and signs respects residents, but notice is not consent. Residents should also have a way to raise concerns or ask for images to be deleted.

Storage. Raw images should be kept on a secure university server with role-based access, not on personal devices. If only the single operator has access, nobody can reach the data when that person is absent. A named supervisor should also have access, and every access should be logged. A short retention period, such as the fictional 7 days, limits harm, but engineers may need images longer to track how a crack develops. A reasonable compromise is to delete raw images quickly and keep cropped defect photos, with people removed, as maintenance records.

Safety. Low altitude and daylight reduce risk but do not remove it, because people walk under the routes. Safeguards include:

avoiding busy paths at peak times;
temporary ground cordons;
automatic return-to-home when signal or battery is lost;
pre-flight checklists.

With one operator, fatigue and illness are real risks. Inspections are not urgent, so the simplest safeguard is to postpone flights rather than fly tired, and to limit how long each session lasts.

Accountability. The university chose the system, approved the routes and employs the operator, so it should carry primary responsibility to the people affected. If a software fault causes a crash, the manufacturer or developer may share responsibility, but that depends on contracts and law. Flight logs and incident reports make it possible to find out what happened.

Overall, these safeguards are justified because they reduce serious harm at modest cost while still letting the drone save weeks of scaffolding work.

Tutor notes

Changes to your ideas, and why

Idea 1 contradicted the goal. A camera that is off during flight, or pointing down, can’t photograph facades. I replaced it with still photos at set points plus masking and blurring.
Idea 2 assumed a “development team.” The university will most likely buy a commercial drone, so the developer is probably an outside vendor. That makes the question one of contracts, not internal testing.
Idea 3 created a single point of failure: access for one operator only, who could be absent. That is the same problem you raised in idea 5. I also flagged that 7 days may be too short for engineering use.
Idea 4 was kept, with the point that notice is not the same as consent.
Idea 5 was kept. Postponing flights is a cheaper fix than hiring a backup, which the budget doesn’t allow.

Facts (given in the scenario): the users, the six dormitories, daylight, 60 m, campus boundary, one drone, one operator, and the privacy risk.

Assumptions (yours and mine): that blurring is reliable, that students read app notifications, that rooms are emptier at certain times, that the vendor shares liability, and that inspections can be delayed safely.

Claims to verify before submitting

Your country’s aviation rules for small drones. Many require visual line of sight, registration, or a second observer, which would affect the one-operator constraint.
Data-protection law on images of identifiable people, including how long they may be kept and whether notice is enough.
How accurate automatic face and person blurring actually is in drone software.
Who is legally liable for injuries: the owner, the operator, or the manufacturer.

If you’d like, I can turn this into a doc you can edit and export.

Show what you changed and why. Use only the sources I supplied. Flag remaining gaps instead of inventing details.
```

**Response:**

```text
Revised draft (about 495 words)

Social challenges and safeguards for a software-controlled campus inspection drone

Northgate University’s facilities team wants a drone to fly preset routes around six dormitories and photograph cracks and leaks, replacing weeks of scaffolding. Facilities engineers plan and run the flights. Students and staff who live in or walk past the dormitories are affected but do not control the drone. The drone raises three social challenges: privacy, safety and accountability. In this answer, a safeguard counts as justified if it reduces a serious harm, still lets the inspection find defects, and fits the constraints: daylight only, below 60 m, inside campus, one drone and one operator.

Software control. Because the drone follows preset routes, errors can come from software, not only from the pilot. Examples are a wrong waypoint, an inaccurate position, or a geofence that fails to keep the drone below 60 m and inside campus. A supervisor should check each new route, test it once over an empty area, and set the geofence with a safety margin. Under the comparable US rule, the pilot must keep the drone in sight for the whole flight (14 CFR § 107.31). If Northgate has a similar rule, the operator can take over when the software misbehaves.

Privacy. Cracks around window frames matter for the inspection, so only the glass should be blurred automatically. The drone should take still photos at preset points, not continuous video. Blurring can fail, so a person should check images before they are shared. Under an assumed, fictional Northgate rule, notice and blurring replace individual consent. Signs and an app message give the flight date and time, so residents know when they might appear in images and can ask for deletion.

Data path. Photos are first stored on the drone’s SD card (Help Net Security, 2017). They should be moved to a university server with logged access for the operator and a supervisor, then wiped from the card. DJI states that syncing data with its servers is opt-in, so the operator should confirm that syncing is off. Raw images are deleted after a fictional 7 days because they may show people. Cropped defect photos are kept as maintenance records.

Safety. Paths fill up between classes, so flights should be planned around outdoor foot traffic. Return-to-home should follow a preset route away from paths, not a straight line. Because the budget is limited, cordons and a helper are used only at high-risk spots such as entrances. Urgency depends on the defect: an active leak needs quick action, while a cosmetic crack can wait if the operator is tired or ill.

Accountability. The university chose the system, approved the routes and controls the data, so it is primarily accountable to residents. If the operator is a contractor, the contract should set out their duties. Whoever leaks images is responsible for that act, but the university is responsible if its access controls were weak. A software fault may shift some responsibility to the manufacturer, depending on contracts and law. Flight logs show what happened.

Each safeguard targets a specific harm for a small amount of extra staff time, which is why it is justified. The exact cost is an assumption, not a calculation.

Facts, risk and assumptions

Facts (from the scenario):

The users are facilities engineers; students and staff are affected.
There are six dormitories, and the drone flies preset routes to photograph cracks and leaks.
Flights are allowed only in daylight, below 60 m, and inside the campus boundary.
The budget covers one drone and one trained operator.

Risk (a possible event, not something that has happened): The camera records students through windows, and the images are stored or shared without consent.

Fictional by design: Northgate, the 60 m limit, the budget, the 7-day retention period, and the campus consent rule.

Assumptions:

The university buys a commercial drone. This decision hasn’t been made yet.
The operator may be an employee or a contractor.
Automatic blurring mostly works.
Residents read app messages.
Northgate has a line-of-sight rule similar to the US one.
The chosen drone supports glass-only blurring, a preset return route, and geofence margins.
Rough cost: a supervisor spends a few hours on each new route check, and one helper spends a few hours on each flight day at high-risk spots. There is no money figure, because the scenario gives no prices.
What changed and why
#	Your decision	Change in the draft
1	Accept	Scheduling now follows outdoor foot traffic, not empty rooms.
2	Accept	Only the glass is blurred, so frames stay visible.
3	Accept	The privacy risk moved from “facts” to its own “Risk” line.
4	Accept	New “Software control” paragraph covering route, position and geofence errors.
5	Qualify	A supervisor checks routes, and cordons and a helper are used only at high-risk spots.
6	Accept	Accountability now covers image leaks as well as crashes.
7	Accept	Criteria for “justified” stated in the introduction and used in the conclusion.
8	Qualify (per source 2)	“Often sync to the cloud” replaced with: SD card first, DJI sync is opt-in, confirm it is off.
9	Accept	Signs and the app message now give the flight time, so a deletion request is possible.
10	Qualify	“Modest cost” replaced with a labelled rough estimate in staff time.
11	Qualify	Consent handled by a stated fictional campus rule.
12	Accept	Return-to-home follows a preset safe route.
13	Accept	“Inspections are not urgent” replaced with urgency by defect type.
14	Accept	Contractor case added to accountability.
15	Accept	Buying a commercial drone moved to assumptions.
16	Qualify	7 days labelled fictional, with the reason it is short (raw images may show people).
Source 1	Qualify	Line of sight cited as a US comparison, not as Northgate’s rule. Because a second observer is optional, the “verify a second observer” claim was dropped.

The old tutor notes and verification list were removed from the draft and replaced by the section above and the gaps below.

Sources used (only those you supplied)
US FAA, 14 CFR Part 107, § 107.31 and § 107.33, govinfo.gov, CFR 2025 edition, p. 918. https://www.govinfo.gov/content/pkg/CFR-2025-title14-vol2/pdf/CFR-2025-title14-vol2-sec107-31.pdf (accessed 2026-10-11)
DJI Newsroom, “DJI to Disable Flight Records Sync in the U.S.” https://viewpoints.dji.com/blog/dji-to-disable-flight-record-sync-in-the-us (accessed 2026-10-11)
Help Net Security, “DJI launches privacy mode for drone operators,” 3 Oct 2017. https://www.helpnetsecurity.com/2017/10/03/dji-local-data-mode/ (accessed 2026-10-11)
Remaining gaps
The DJI sources cover only DJI. Other manufacturers may handle data differently. The 2024 US change concerns flight records, not photos, and applies to the US only.
The Help Net Security report is from 2017. Current models may store or transfer data differently.
The FAA rules are US law. They are not your country’s rules or Northgate’s. The draft uses them only for comparison.
No source supports how accurate automatic blurring is, how reliable GPS and geofencing are near buildings, or whether a given drone supports preset return routes. These remain assumptions until a drone is chosen.
Liability for injuries and leaks is still unverified law.
There is no fallback for urgent defects when the operator is unavailable. The draft says a leak needs quick action but doesn’t say who acts if the only operator is ill.
Word count: the essay is about 495 words. If your marker counts the facts and assumptions section, you’ll go over 500 and may need to trim.
```

## 9. Appendix C — Evidence tables

### Verification table


| AI claim | Source and locator | Evidence found | Decision |
| --- | --- | --- | --- |
| "Many require visual line of sight, registration, or a second observer, which would affect the one-operator constraint." | US FAA, 14 CFR Part 107, § 107.31 (visual line of sight) and § 107.33 (visual observer), govinfo.gov, CFR 2025 edition, https://www.govinfo.gov/content/pkg/CFR-2025-title14-vol2/pdf/CFR-2025-title14-vol2-sec107-31.pdf, accessed 2026-10-11 | § 107.31 says the pilot must be able to see the drone during the whole flight. A visual observer is mentioned only "if one is used", so a second person is optional, not required. These are US rules; our campus rules are fictional. Line of sight is required, but the one-operator constraint stays possible. | qualify |
| "Commercial drones usually store images on an SD card and often sync to the manufacturer's app or cloud." | DJI Newsroom, "DJI to Disable Flight Records Sync in the U.S.", https://viewpoints.dji.com/blog/dji-to-disable-flight-record-sync-in-the-us, accessed 2026-10-11; Help Net Security, "DJI launches privacy mode for drone operators", 3 Oct 2017, https://www.helpnetsecurity.com/2017/10/03/dji-local-data-mode/, accessed 2026-10-11 | DJI says syncing data with DJI is opt-in, not on by default, and since June 2024 flight-record sync is turned off in the US. Help Net Security reports that photos and videos are always stored on the drone's SD card. The SD-card part is correct, but "often sync to the cloud" is too strong. | qualify |

### Change log


| AI wording / suggestion | Your final version | Reason for change |
| --- | --- | --- |
| "Urgency depends on the defect: an active leak needs quick action, while a cosmetic crack can wait if the operator is tired or ill." | "An active leak needs quick action. If the only operator is ill, a facilities engineer inspects the leak from inside the building or from the ground, and the drone flight waits until the operator returns." | Scenario constraint: the budget covers one drone and one trained operator, so the fallback for urgent defects must not need a second pilot. The AI draft named urgency but not who acts when the operator is unavailable. |
| "Photos are first stored on the drone's SD card (Help Net Security, 2017)." | "Before buying, the university checks where the chosen drone stores photos; DJI reports that photos go to the SD card first and that syncing with its servers is opt-in (verification row 2)." | Verification row 2: the sources cover only DJI, and the Help Net Security report is from 2017, so the claim cannot be stated for every drone; the purchase decision is still an assumption. |
