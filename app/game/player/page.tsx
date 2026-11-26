import { Suspense } from "react";
import type { Metadata } from "next";
import PlayerGameView from "@/components/scores/PlayerGameView";

export const metadata: Metadata = {
  title: "Player game report",
  description: "A single-game rating, written evaluation and full stat line for an NBA player.",
  alternates: { canonical: "/game/player" },
  robots: { index: false, follow: true },
};

export default function PlayerGamePage() {
  return (
    <main>
      <Suspense
        fallback={
          <div className="mx-auto max-w-4xl px-4 py-10">
            <div className="h-8 w-52 animate-pulse rounded bg-gray-100" />
            <div className="mt-6 h-28 animate-pulse rounded-2xl bg-gray-100" />
            <div className="mt-4 h-40 animate-pulse rounded-2xl bg-gray-100" />
          </div>
        }
      >
        <PlayerGameView />
      </Suspense>
    </main>
  );
}
