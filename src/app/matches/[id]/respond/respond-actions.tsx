"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RespondActions({ matchId }: { matchId: number }) {
  const [loading, setLoading] = useState<"accept" | "decline" | null>(null);
  const router = useRouter();

  async function handleRespond(action: "accept" | "decline") {
    setLoading(action);
    const res = await fetch(`/api/matches/${matchId}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });

    const data = await res.json();
    if (!res.ok) {
      router.push(
        `/matches?alert=${encodeURIComponent(data.error || "Something went wrong")}`
      );
    } else if (action === "accept") {
      router.push(
        `/matches?notice=${encodeURIComponent("Match accepted! Check your email for your partner's contact info.")}`
      );
    } else {
      router.push(
        `/matches?notice=${encodeURIComponent("Match declined.")}`
      );
    }
  }

  return (
    <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
      <button
        onClick={() => handleRespond("decline")}
        disabled={loading !== null}
        className="flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
      >
        {loading === "decline" ? "Declining..." : "Decline"}
      </button>
      <button
        onClick={() => handleRespond("accept")}
        disabled={loading !== null}
        className="flex-1 rounded-full bg-umMaize px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-umBlue shadow-md shadow-umMaize/30 transition hover:bg-yellow-400 hover:shadow-lg disabled:opacity-50"
      >
        {loading === "accept" ? "Accepting..." : "Accept"}
      </button>
    </div>
  );
}
