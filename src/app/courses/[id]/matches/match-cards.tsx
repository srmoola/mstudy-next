"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Profile } from "@/lib/types";

export default function MatchCards({
  suggestions,
  courseId,
  courseName,
}: {
  suggestions: Profile[];
  courseId: number;
  courseName: string;
}) {
  const [index, setIndex] = useState(0);
  const [connecting, setConnecting] = useState(false);
  const router = useRouter();

  async function handleConnect(receiverId: string) {
    setConnecting(true);
    const res = await fetch("/api/matches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course_id: courseId, receiver_id: receiverId }),
    });

    const data = await res.json();
    if (!res.ok) {
      router.push(
        `/courses/${courseId}?alert=${encodeURIComponent(data.error || "Failed to send match request")}`
      );
    } else {
      router.push(
        `/courses/${courseId}?notice=${encodeURIComponent("Match request sent!")}`
      );
    }
  }

  function handleSkip() {
    setIndex((i) => i + 1);
  }

  const allViewed = index >= suggestions.length;

  if (allViewed) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-12 text-center">
        <p className="text-lg font-semibold text-umBlue">No more suggestions</p>
        <p className="mt-2 text-sm text-slate-500">
          You&apos;ve seen all compatible partners for this class.
        </p>
        <Link
          href={`/courses/${courseId}`}
          className="mt-4 inline-block rounded-full bg-umBlue px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#001633]"
        >
          Back to class
        </Link>
      </div>
    );
  }

  const user = suggestions[index];

  return (
    <div className="relative">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 overflow-hidden transition-all duration-300">
        {/* Card header */}
        <div className="bg-gradient-to-br from-umBlue to-[#001633] px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-xl font-black text-white">
              {user.first_name[0]}
              {user.last_name[0]}
            </div>
            <div>
              <p className="text-lg font-bold text-white">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-sm text-white/60">{user.year}</p>
            </div>
          </div>
        </div>

        {/* Card body */}
        <div className="px-6 py-5 space-y-4">
          {/* Location */}
          <div className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mt-0.5 h-5 w-5 shrink-0 text-umMaize"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Location
              </p>
              <p className="text-sm font-medium text-umBlue">
                {user.location_preference.join(", ")}
              </p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mt-0.5 h-5 w-5 shrink-0 text-umMaize"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Preferred times
              </p>
              <p className="text-sm font-medium text-umBlue">
                {user.time_preference.join(", ")}
              </p>
            </div>
          </div>

          {/* Days */}
          <div className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mt-0.5 h-5 w-5 shrink-0 text-umMaize"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
              />
            </svg>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Available days
              </p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {user.day_preference.map((day) => (
                  <span
                    key={day}
                    className="rounded-full bg-umBlue/5 px-2.5 py-0.5 text-xs font-medium text-umBlue"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
          <button
            onClick={handleSkip}
            className="flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
          >
            Skip
          </button>
          <button
            onClick={() => handleConnect(user.id)}
            disabled={connecting}
            className="flex-1 rounded-full bg-umMaize px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-umBlue shadow-md shadow-umMaize/30 transition hover:bg-yellow-400 hover:shadow-lg disabled:opacity-50"
          >
            {connecting ? "Sending..." : "Connect"}
          </button>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        {index + 1} of {suggestions.length}
      </p>
    </div>
  );
}
