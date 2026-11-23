"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import TeamLogo from "@/components/teams/TeamLogo";
import {
  buildEvaluation,
  fetchGame,
  findPlayer,
  gradeForRating,
  teamRank,
  type BoxPlayer,
  type BoxTeam,
  type GameBox,
} from "@/lib/game-detail";

type Phase = "loading" | "ready" | "error";

function signed(value: number): string {
  return value > 0 ? `+${value}` : `${value}`;
}

function formatGameDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

function Headshot({ player }: { player: BoxPlayer }) {
  const [failed, setFailed] = useState(false);
  if (!player.headshot || failed) {
    return (
      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg font-extrabold text-gray-400">
        {player.name
          .split(" ")
          .map((part) => part[0])
          .slice(0, 2)
          .join("")}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={player.headshot}
      alt=""
      width={64}
      height={64}
      onError={() => setFailed(true)}
      className="h-16 w-16 shrink-0 rounded-full bg-gray-100 object-cover"
    />
  );
}

function RatingCard({ player, rank, size }: { player: BoxPlayer; rank: number; size: number }) {
  if (player.didNotPlay) {
    return (
      <div className="card p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Game rating</p>
        <p className="mt-1 text-2xl font-extrabold text-gray-400">No rating</p>
        <p className="mt-1 text-sm text-gray-600">
          A rating needs minutes on the floor. {player.note ? `Listed as: ${player.note.toLowerCase()}.` : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Game rating</p>
          <p className="mt-1 flex items-baseline gap-1">
            <span className="text-4xl font-extrabold tabular-nums text-ink">{player.rating.toFixed(1)}</span>
            <span className="text-sm font-medium text-gray-400">/ 10</span>
          </p>
          <p className="mt-1 text-sm font-semibold text-court">{gradeForRating(player.rating)}</p>
        </div>
        <dl className="text-right text-xs text-gray-500">
          <div>
            <dt className="inline">Game score </dt>
            <dd className="inline font-bold text-ink tabular-nums">{player.gameScore.toFixed(1)}</dd>
          </div>
          <div className="mt-1">
            <dt className="inline">Team rank </dt>
            <dd className="inline font-bold text-ink tabular-nums">
              {rank}
              <span className="font-normal text-gray-400"> of {size}</span>
            </dd>
          </div>
          <div className="mt-1">
            <dt className="inline">Plus/minus </dt>
            <dd className="inline font-bold text-ink tabular-nums">{signed(player.plusMinus)}</dd>
          </div>
        </dl>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-court transition-[width] duration-500"
          style={{ width: `${Math.min(100, player.rating * 10)}%` }}
        />
      </div>
      <p className="mt-2 text-[11px] text-gray-400">
        Hollinger-style game score, rescaled to 0–10. Derived, not an official rating.
      </p>
    </div>
  );
}

const STAT_BOXES: Array<{ label: string; value: (player: BoxPlayer) => string | number }> = [
  { label: "MIN", value: (player) => (player.minutes === null ? "–" : Math.round(player.minutes)) },
  { label: "PTS", value: (player) => player.points },
  { label: "REB", value: (player) => player.rebounds },
  { label: "AST", value: (player) => player.assists },
  { label: "STL", value: (player) => player.steals },
  { label: "BLK", value: (player) => player.blocks },
  { label: "TO", value: (player) => player.turnovers },
  { label: "+/-", value: (player) => signed(player.plusMinus) },
];

function StatGrid({ player }: { player: BoxPlayer }) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
      {STAT_BOXES.map((box) => (
        <div key={box.label} className="rounded-xl border border-gray-100 bg-white px-2 py-3 text-center">
          <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{box.label}</div>
          <div className="mt-0.5 text-lg font-bold tabular-nums text-ink">{box.value(player)}</div>
        </div>
      ))}
    </div>
  );
}

function ShootingTable({ player }: { player: BoxPlayer }) {
  const rows = [
    { label: "Field goals", value: `${player.fgMade}-${player.fgAttempted}`, extra: pct(player.fgMade, player.fgAttempted) },
    { label: "Three-pointers", value: `${player.threeMade}-${player.threeAttempted}`, extra: pct(player.threeMade, player.threeAttempted) },
    { label: "Free throws", value: `${player.ftMade}-${player.ftAttempted}`, extra: pct(player.ftMade, player.ftAttempted) },
    {
      label: "True shooting",
      value: player.trueShooting === null ? "–" : `${player.trueShooting.toFixed(1)}%`,
      extra: "",
    },
  ];
  return (
    <div className="card mt-4 overflow-hidden">
      <table className="w-full text-sm">
        <caption className="sr-only">Shooting splits</caption>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-gray-50 last:border-0">
              <th scope="row" className="px-4 py-2.5 text-left font-medium text-gray-600">{row.label}</th>
              <td className="px-2 py-2.5 text-right tabular-nums text-ink">{row.value}</td>
              <td className="w-16 px-4 py-2.5 text-right tabular-nums text-gray-400">{row.extra}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function pct(made: number, attempted: number): string {
  if (attempted === 0) return "—";
  return `${Math.round((made / attempted) * 100)}%`;
}

export default function PlayerGameView() {
  const params = useSearchParams();
  const gameId = params.get("id") ?? "";
  const playerId = params.get("pid") ?? "";

  const [phase, setPhase] = useState<Phase>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [state, setState] = useState<{
    game: GameBox;
    team: BoxTeam;
    opponent: BoxTeam;
    player: BoxPlayer;
  } | null>(null);

  useEffect(() => {
    if (!gameId || !playerId) {
      setPhase("error");
      setErrorMessage("This link is missing the game or player id.");
      return;
    }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const load = async (first: boolean) => {
      try {
        const game = await fetchGame(gameId);
        if (cancelled) return;
        const found = findPlayer(game, playerId);
        if (!found) {
          setErrorMessage("That player is not in this game's box score.");
          setPhase("error");
          return;
        }
        setState({ game, ...found });
        setPhase("ready");
        if (first) {
          document.title = `${found.player.name} · ${found.player.points} PTS vs ${found.opponent.abbr} | NBA Tools`;
        }
        if (game.state === "in") timer = setTimeout(() => void load(false), 30_000);
      } catch (error) {
        if (cancelled || !first) return;
        setErrorMessage(error instanceof Error ? error.message : "Unknown error");
        setPhase("error");
      }
    };

    setPhase("loading");
    void load(true);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [gameId, playerId]);

  if (phase === "loading") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="h-8 w-52 animate-pulse rounded bg-gray-100" />
        <div className="mt-6 h-28 animate-pulse rounded-2xl bg-gray-100" />
        <div className="mt-4 h-40 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    );
  }

  if (phase === "error" || !state) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-ink">Player data unavailable</h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-600">
          {errorMessage ?? "Something went wrong loading this player."}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href={gameId ? `/game/?id=${gameId}` : "/#scores"} className="btn-primary">
            Back to the box score
          </Link>
          <Link href="/#scores" className="btn-ghost">
            Today&apos;s games
          </Link>
        </div>
      </div>
    );
  }

  const { game, team, opponent, player } = state;
  const { rank, size } = teamRank(team, player.id);
  const evaluation = buildEvaluation(player, {
    teamName: team.name,
    opponentAbbr: opponent.abbr,
    teamWon: team.winner,
    teamScore: team.score,
    opponentScore: opponent.score,
    rank,
    rosterSize: size,
    baselineTrueShooting: game.baselineTrueShooting,
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="text-xs text-gray-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-court">Home</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/#scores" className="hover:text-court">Today&apos;s games</Link></li>
          <li aria-hidden>/</li>
          <li><Link href={`/game/?id=${game.id}`} className="hover:text-court">{game.away.abbr} @ {game.home.abbr}</Link></li>
          <li aria-hidden>/</li>
          <li className="font-medium text-gray-700">{player.name}</li>
        </ol>
      </nav>

      <div className="mt-4 flex items-center gap-4">
        <Headshot player={player} />
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{player.name}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <TeamLogo abbr={team.key} size={16} />
              {team.name}
            </span>
            <span aria-hidden>·</span>
            <span>
              {player.jersey ? `#${player.jersey} · ` : ""}
              {player.position ?? "—"}
              {player.starter ? " · Starter" : ""}
            </span>
            <span aria-hidden>·</span>
            <span>{formatGameDate(game.dateISO)}</span>
          </p>
          <p className="mt-1 text-xs text-gray-400">
            vs {opponent.name} · {team.winner ? "Win" : "Loss"} {team.score}–{opponent.score}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link href={`/game/?id=${game.id}`} className="btn-ghost">
          ← Back to box score
        </Link>
        {player.profileSlug && (
          <Link href={`/players/${player.profileSlug}`} className="btn-ghost">
            Full season profile →
          </Link>
        )}
      </div>

      <section className="mt-6">
        <RatingCard player={player} rank={rank} size={size} />
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-bold text-ink">Evaluation</h2>
        <p className="mt-2 text-sm font-semibold leading-relaxed text-ink">{evaluation.headline}</p>
        <div className="mt-2 space-y-2">
          {evaluation.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-relaxed text-gray-700">
              {paragraph}
            </p>
          ))}
        </div>

        {(evaluation.positives.length > 0 || evaluation.negatives.length > 0) && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {evaluation.positives.length > 0 && (
              <div className="rounded-xl border border-green-100 bg-green-50/60 p-3">
                <p className="text-[11px] font-bold uppercase tracking-wide text-green-700">What worked</p>
                <ul className="mt-1.5 space-y-1">
                  {evaluation.positives.map((item) => (
                    <li key={item} className="text-sm text-gray-700">+ {item}</li>
                  ))}
                </ul>
              </div>
            )}
            {evaluation.negatives.length > 0 && (
              <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-3">
                <p className="text-[11px] font-bold uppercase tracking-wide text-orange-700">What didn&apos;t</p>
                <ul className="mt-1.5 space-y-1">
                  {evaluation.negatives.map((item) => (
                    <li key={item} className="text-sm text-gray-700">− {item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-bold text-ink">Stat line</h2>
        <div className="mt-3">
          <StatGrid player={player} />
        </div>
        <ShootingTable player={player} />
      </section>

      <p className="mt-6 text-[11px] leading-relaxed text-gray-400">
        Rating model: game score = PTS + 0.4×FGM − 0.7×FGA − 0.4×(FTA−FTM) + 0.7×OREB + 0.3×DREB + STL +
        0.7×AST + 0.7×BLK − 0.4×PF − TO, rescaled so that a 15-point game score reads as 5.0. A game score of
        15 is a normal starter&apos;s night; 30 is a takeover. The write-up is generated from this box score only,
        so it cannot see defensive assignments, shot quality or anything that does not appear in the numbers.
      </p>
    </div>
  );
}
