import { Suspense } from "react";
import type { Metadata } from "next";
import GameDetailView from "@/components/scores/GameDetailView";

export const metadata: Metadata = {
  title: "Game box score",
  description:
    "Quarter-by-quarter line score, both rosters and a per-player rating for a single NBA game.",
  alternates: { canonical: "/game" },
  // Live game pages are generated per event and carry no unique crawlable text,
  // so they stay out of the index while still passing link equity through.
  robots: { index: false, follow: true },
};

export default function GamePage() {
  return (
    <main>
      <Suspense
        fallback={
          <div className="mx-auto max-w-5xl px-4 py-10">
            <div className="h-8 w-40 animate-pulse rounded bg-gray-100" />
            <div className="mt-6 h-40 animate-pulse rounded-2xl bg-gray-100" />
            <div className="mt-4 h-24 animate-pulse rounded-2xl bg-gray-100" />
            <div className="mt-6 h-72 animate-pulse rounded-2xl bg-gray-100" />
          </div>
        }
      >
        <GameDetailView />
      </Suspense>
    </main>
  );
}
