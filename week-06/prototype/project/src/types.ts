export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
}

export interface Booking {
  id: string;
  roomId: string;
  start: number; // minutes from 00:00
  end: number; // minutes from 00:00
  bookedBy: string;
}

export interface IntervalCheck {
  roomId: string;
  start: number;
  end: number;
}

export type Verdict =
  | { kind: "available" }
  | { kind: "unavailable"; reasons: string[] };
