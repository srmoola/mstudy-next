"use client";

import { useSearchParams } from "next/navigation";

export default function FlashMessages() {
  const searchParams = useSearchParams();
  const notice = searchParams.get("notice");
  const alert = searchParams.get("alert");
  const warning = searchParams.get("warning");

  if (!notice && !alert && !warning) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-4">
      {notice && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {notice}
        </div>
      )}
      {warning && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {warning}
        </div>
      )}
      {alert && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {alert}
        </div>
      )}
    </div>
  );
}
