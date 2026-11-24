"use client";

import { useEffect, useState } from "react";

/**
 * Marks the day group that matches the reader's current date in US Eastern.
 *
 * Deliberately client-only and deliberately self-contained: the label has to be
 * computed against the visitor's clock, not the build machine's, so it cannot be
 * part of the static HTML. It also avoids pulling the whole news JSON into the
 * client bundle just to format one date.
 */
function currentDayKey(): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export default function TodayBadge({ dayKey }: { dayKey: string }) {
  const [isToday, setIsToday] = useState(false);

  useEffect(() => {
    setIsToday(currentDayKey() === dayKey);
  }, [dayKey]);

  if (!isToday) return null;

  return (
    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-200">
      Today
    </span>
  );
}
