// Spaced repetition schedule. Pure functions, no framework imports,
// so the same code can be reused in the Expo app.
// All numbers are examples and can be tuned here.

/** Wait time (hours) after each completed review: 3h, 6h, 12h, 24h, 2d, 4d, 1w, 1mo. */
export const REVIEW_INTERVALS_HOURS = [3, 6, 12, 24, 48, 96, 168, 720];

/** How many decks a user can study at the same time. */
export const MAX_ACTIVE_DECKS = 3;

const LAST_STAGE = REVIEW_INTERVALS_HOURS.length - 1;

/** Stage and next review time after finishing a due review at `stage`. */
export function scheduleNext(stage: number, now: Date = new Date()) {
  const current = Math.min(stage, LAST_STAGE);
  const waitMs = REVIEW_INTERVALS_HOURS[current] * 60 * 60 * 1000;
  return {
    stage: Math.min(current + 1, LAST_STAGE),
    next_review_at: new Date(now.getTime() + waitMs).toISOString(),
  };
}

/** "now", "in 3h", "in 2d" */
export function formatWait(ms: number) {
  if (ms <= 0) return "now";
  const hours = Math.ceil(ms / (60 * 60 * 1000));
  if (hours < 24) return `in ${hours}h`;
  return `in ${Math.ceil(hours / 24)}d`;
}

/** Milliseconds until an ISO timestamp (negative if it is in the past). */
export function msUntil(iso: string) {
  return new Date(iso).getTime() - Date.now();
}
