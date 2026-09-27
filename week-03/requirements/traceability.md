# Traceability — use cases → stories → criteria

One row per use case. All six rows stay, even the ones with nothing behind them: an empty cell is a
finding you report, not a failure you hide. Use real IDs, comma-separated; write `none` where there
is nothing.

| Use case | Stories (US-nn) | Criteria (AC-nn) | Gap? |
| --- | --- | --- | --- |
| UC-01 View availability | US-01 | none | Yes — no acceptance criteria |
| UC-02 Book room | US-02 | AC-01, AC-02, AC-03, AC-04, AC-05 | No |
| UC-03 Cancel booking | US-03 | AC-06, AC-07, AC-08, AC-09 | No |
| UC-04 Block or unblock room | US-04 | AC-10, AC-11, AC-12, AC-13 | No |
| UC-05 Review usage | US-05 | none | Yes — no acceptance criteria |
| UC-06 Send confirmation | US-06 | AC-01, AC-06 | No |

**Stories that belong to no use case:** 
- none

**What the gaps tell you:** 
- UC-01 and UC-05 have no acceptance criteria. UC-06 has a user story (US-06), but no dedicated acceptance criteria.
