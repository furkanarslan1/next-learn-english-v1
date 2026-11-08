// Duel helpers. Pure functions, reusable in the Expo app.

export const LIVE_FLAG = (duelId: string) => `live-duel:${duelId}`;

export type DuelOutcome = "my_turn" | "waiting" | "won" | "lost" | "draw";

type DuelRow = {
  my_finished: boolean;
  their_finished: boolean;
  my_score: number | null;
  my_time_ms: number | null;
  their_score: number | null;
  their_time_ms: number | null;
};

/** Higher score wins. On equal scores the faster player wins. */
export function duelOutcome(d: DuelRow): DuelOutcome {
  if (!d.my_finished) return "my_turn";
  if (!d.their_finished) return "waiting";
  const mine = d.my_score ?? 0;
  const theirs = d.their_score ?? 0;
  if (mine !== theirs) return mine > theirs ? "won" : "lost";
  const myTime = d.my_time_ms ?? 0;
  const theirTime = d.their_time_ms ?? 0;
  if (myTime === theirTime) return "draw";
  return myTime < theirTime ? "won" : "lost";
}

export function formatSeconds(ms: number | null) {
  return ms === null ? "-" : `${(ms / 1000).toFixed(1)} sn`;
}

export const OUTCOME_LABEL: Record<DuelOutcome, string> = {
  my_turn: "Sıra sende",
  waiting: "Rakip bekleniyor",
  won: "Kazandın",
  lost: "Kaybettin",
  draw: "Berabere",
};
