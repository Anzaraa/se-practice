import type { Room, Booking } from "./types";

// Fictional sample data — no real campus, no real people
export const ROOMS: Room[] = [
  { id: "R1", name: "Allen Hall 101", building: "Allen Hall", capacity: 40, blocked: false },
  { id: "R2", name: "Allen Hall 102", building: "Allen Hall", capacity: 30, blocked: true },
  { id: "R3", name: "Bexar Lab 220", building: "Bexar Lab", capacity: 25, blocked: false },
  { id: "R4", name: "Bexar Lab 310", building: "Bexar Lab", capacity: 50, blocked: false },
  { id: "R5", name: "Cass Library Annex", building: "Cass Library", capacity: 12, blocked: false },
  { id: "R6", name: "Cass Library Quiet Room", building: "Cass Library", capacity: 8, blocked: true },
];

// Times stored as minutes-from-midnight
export const BOOKINGS: Booking[] = [
  { id: "B1", roomId: "R1", start: 9 * 60, end: 10 * 60 + 30, bookedBy: "Prof. Acosta" },
  { id: "B2", roomId: "R1", start: 14 * 60, end: 15 * 60, bookedBy: "Dept. Seminar" },
  { id: "B3", roomId: "R3", start: 11 * 60, end: 12 * 60, bookedBy: "Study Group A" },
  { id: "B4", roomId: "R4", start: 13 * 60, end: 14 * 60 + 30, bookedBy: "Lab Session" },
  { id: "B5", roomId: "R5", start: 15 * 60, end: 16 * 60, bookedBy: "Reading Circle" },
  { id: "B6", roomId: "R3", start: 16 * 60, end: 17 * 60, bookedBy: "Office Hours" },
  { id: "B7", roomId: "R4", start: 9 * 60 + 30, end: 11 * 60, bookedBy: "Workshop" },
];
