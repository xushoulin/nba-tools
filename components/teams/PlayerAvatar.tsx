"use client";

import { useState } from "react";
import { initials, playerHeadshotUrl, teamColor } from "@/lib/team-assets";

type Props = {
  name: string;
  teamAbbr: string;
  size?: number;
  className?: string;
};

/**
 * Player headshot with an initials badge as the base layer. If the headshot is
 * missing or blocked, the badge stays visible — no broken-image icons.
 */
export default function PlayerAvatar({ name, teamAbbr, size = 44, className = "" }: Props) {
  const [failed, setFailed] = useState(false);
  const url = playerHeadshotUrl(name);
  const color = teamColor(teamAbbr);

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-black/5 ${className}`}
      style={{ width: size, height: size, backgroundColor: `${color}14` }}
    >
      {(failed || !url) && (
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center font-bold"
          style={{ color, fontSize: Math.max(10, size * 0.34) }}
        >
          {initials(name)}
        </span>
      )}
      {url && !failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={name}
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="relative h-full w-full object-cover"
          style={{ objectPosition: "50% 18%" }}
        />
      )}
    </span>
  );
}
