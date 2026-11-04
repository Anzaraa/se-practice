import { useMemo, useState } from "react";
import { Building2, Clock, CheckCircle2, XCircle, Info, Calendar } from "lucide-react";
import type { Room, Verdict } from "./types";
import { ROOMS as INITIAL_ROOMS, BOOKINGS } from "./data";
import { checkAvailability, fmt, parseTime } from "./availability";

function nowMinutes(): number {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

function RoomCard({
  room,
  selected,
  onSelect,
  onToggleBlock,
}: {
  room: Room;
  selected: boolean;
  onSelect: () => void;
  onToggleBlock: () => void;
}) {
  return (
    <div
      className={[
        "rounded-xl border p-4 transition-all duration-200 w-full",
        room.blocked
          ? "border-slate-200 bg-slate-50 opacity-70"
          : selected
            ? "border-sky-500 bg-sky-50 ring-2 ring-sky-400 shadow-sm"
            : "border-slate-200 bg-white hover:border-sky-300 hover:shadow-sm",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={onSelect}
          className="text-left flex-1 min-w-0"
        >
          <p className="font-semibold text-slate-800 truncate">{room.name}</p>
          <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            {room.building}
          </p>
        </button>
        <button
          type="button"
          onClick={onToggleBlock}
          className={[
            "text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap transition-colors",
            room.blocked
              ? "text-rose-600 bg-rose-50 hover:bg-rose-100"
              : "text-slate-500 bg-slate-100 hover:bg-slate-200",
          ].join(" ")}
        >
          {room.blocked ? "Blocked" : `${room.capacity} seats`}
        </button>
      </div>
    </div>
  );
}

function VerdictPanel({ verdict }: { verdict: Verdict | null }) {
  if (!verdict) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center text-slate-400">
        Select a room and enter start / end times to check availability.
      </div>
    );
  }

  if (verdict.kind === "available") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <p className="font-semibold text-emerald-800">Available</p>
            <p className="text-sm text-emerald-700">
              This room is free for the selected interval.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-5">
      <div className="flex items-start gap-3">
        <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
        <div className="w-full">
          <p className="font-semibold text-rose-800">Unavailable</p>
          <ul className="mt-2 space-y-1">
            {verdict.reasons.map((r, i) => (
              <li key={i} className="text-sm text-rose-700 flex gap-1.5">
                <span className="text-rose-400">•</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState<string>("");
  const [startStr, setStartStr] = useState<string>("09:00");
  const [endStr, setEndStr] = useState<string>("10:00");
  const [currentStr, setCurrentStr] = useState<string>(fmt(nowMinutes()));
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const currentTime = parseTime(currentStr);

  const selectedRoom = rooms.find((r) => r.id === roomId) ?? null;

  const toggleBlock = (id: string) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, blocked: !r.blocked } : r))
    );
  };

  const verdict = useMemo<Verdict | null>(() => {
    if (!roomId) return null;
    const start = parseTime(startStr);
    const end = parseTime(endStr);
    return checkAvailability(roomId, start, end, currentTime, rooms, BOOKINGS);
  }, [roomId, startStr, endStr, currentTime, rooms]);

  const roomBookings = useMemo(
    () => BOOKINGS.filter((b) => b.roomId === roomId).sort((a, b) => a.start - b.start),
    [roomId]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
              Smart Campus Room Availability
            </h1>
            <p className="text-sm text-slate-500">
              Set the current time below, then check room availability
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: form */}
          <section className="space-y-5">
            {/* Room selection */}
            <div>
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
                1. Select a room
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    selected={room.id === roomId}
                    onSelect={() => setRoomId(room.id)}
                    onToggleBlock={() => toggleBlock(room.id)}
                  />
                ))}
              </div>
            </div>

            {/* Time inputs */}
            <div>
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
                2. Enter time interval
              </h2>
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-slate-600 flex items-center gap-1 mb-1">
                    <Clock className="w-3.5 h-3.5" /> Current time
                  </span>
                  <input
                    type="time"
                    value={currentStr}
                    onChange={(e) => setCurrentStr(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-sm font-medium text-slate-600 flex items-center gap-1 mb-1">
                      <Clock className="w-3.5 h-3.5" /> Start
                    </span>
                    <input
                      type="time"
                      value={startStr}
                      onChange={(e) => setStartStr(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-600 flex items-center gap-1 mb-1">
                      <Clock className="w-3.5 h-3.5" /> End
                    </span>
                    <input
                      type="time"
                      value={endStr}
                      onChange={(e) => setEndStr(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                    />
                  </label>
                </div>

                <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                  <p>
                    Max booking length is 120 minutes. Start must be after the
                    current time (set above). Touching endpoints (one booking
                    ends 10:00, next starts 10:00) are allowed.
                  </p>
                </div>
              </div>
            </div>

            {/* Verdict */}
            <div>
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
                3. Result
              </h2>
              <VerdictPanel verdict={verdict} />
            </div>
          </section>

          {/* Right: schedule for selected room */}
          <section>
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
              {selectedRoom ? `${selectedRoom.name} — today's schedule` : "Room schedule"}
            </h2>
            {!selectedRoom ? (
              <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-400">
                Select a room to view its bookings.
              </div>
            ) : selectedRoom.blocked ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center">
                <XCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                <p className="text-rose-700 font-medium">
                  This room is blocked and cannot be booked.
                </p>
              </div>
            ) : roomBookings.length === 0 ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-emerald-700 font-medium">
                  No existing bookings for this room.
                </p>
              </div>
            ) : (
              <ul className="space-y-2">
                {roomBookings.map((b) => (
                  <li
                    key={b.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-1.5 h-8 rounded-full bg-sky-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 truncate">
                          {b.bookedBy}
                        </p>
                        <p className="text-sm text-slate-500">
                          {fmt(b.start)} – {fmt(b.end)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap pl-2">
                      {b.end - b.start} min
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>

      <footer className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-slate-400">
        Fictional sample data for demonstration only.
      </footer>
    </div>
  );
}
