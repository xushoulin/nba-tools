"use client";

import { useState } from "react";
import { TEAM_ASSETS, teamLogoUrl } from "@/lib/team-assets";

type Props = {
  abbr: string;
  size?: number;
  className?: string;
};

/**
 * Team crest from a public logo CDN. If the image fails to load, falls back to a
 * brand-coloured tile with the team abbreviation so the layout never collapses.
 */
export default function TeamLogo({ abbr, size = 48, className = "" }: Props) {
  const [failed, setFailed] = useState(false);
  const asset = TEAM_ASSETS[abbr.toLowerCase()];

  if (failed || !asset) {
    return (
      <span
        aria-label={`${abbr} logo`}
        className={`inline-flex shrink-0 items-center justify-center rounded-lg font-extrabold text-white ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: asset?.primary ?? "#1d428a",
          fontSize: Math.max(10, size * 0.32),
        }}
      >
        {abbr}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={teamLogoUrl(abbr)}
      alt={`${abbr} logo`}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`shrink-0 object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
