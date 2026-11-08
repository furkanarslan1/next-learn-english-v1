// Streak helpers. Pure functions, reusable in the Expo app.
// Days are counted in Turkey time, same as touch_streak() in the database.

const TIMEZONE = "Europe/Istanbul";
const DAY_MS = 24 * 60 * 60 * 1000;

/** Today's date as YYYY-MM-DD in Turkey time. */
export function todayInTurkey(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE }).format(new Date());
}

/**
 * The streak to show: it is still alive if the last active day was today or
 * yesterday, otherwise it is broken and shows 0.
 */
export function streakStatus(count: number, lastDate: string | null, today: string) {
  if (!lastDate) return { count: 0, doneToday: false };
  const diffDays = Math.round((Date.parse(today) - Date.parse(lastDate)) / DAY_MS);
  if (diffDays === 0) return { count, doneToday: true };
  if (diffDays === 1) return { count, doneToday: false };
  return { count: 0, doneToday: false };
}
