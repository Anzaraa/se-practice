# Project memory

## Product intent & audience

- Room-booking availability checker that validates proposed bookings against existing room schedules.
- Purpose: verify acceptance criteria (AC) like rejecting overlapping bookings (e.g., AC4: 12:00–13:00 overlaps 11:40–12:40).
- Test data includes multiple rooms with predefined bookings used to exercise availability logic.

## Brand personality & voice

- Technical, precise communication; minimal narrative.
- Focus on correctness and smallest-change edits.

## Visual design & UX direction

- Stack: Vite + React + JSX + Tailwind CSS + Lucide React icons.
- Path alias `@/` → `src/` for imports.
- Production-quality, non-generic UI expected.

## Decisions, constraints & rationale

- Test rooms must have booking configurations that allow specific ACs to be verified (e.g., need a room with exactly two bookings to test overlap rejection for a specific time).
- Added fictional room "Drew Hall 106" with bookings 10:00–11:00 and 11:40–12:40 to enable AC4 verification (12:00–13:00 rejection).
- Constraint: do not modify existing rooms, bookings, or availability logic — only add new test data when gaps are found.
- Rationale: smallest possible change preserves existing test integrity while filling coverage gaps.

## Open questions & assumptions

- Assumption: room identifiers can be fictional/unrealistic; no validation against real venue data.
- Assumption: booking times are stored in a structured data file or fixture (not hard-coded in component logic).
- Unverified: exact data file path/module where rooms and bookings are defined (to be confirmed when editing).