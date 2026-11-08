import { describe, expect, it } from "vitest";
import {
  formatWait,
  msUntil,
  REVIEW_INTERVALS_HOURS,
  scheduleNext,
  scheduleRetry,
} from "./srs";

const HOUR = 60 * 60 * 1000;
const now = new Date("2026-01-01T00:00:00.000Z");
const waitHours = (iso: string) => (Date.parse(iso) - now.getTime()) / HOUR;

describe("scheduleNext", () => {
  it("moves up one stage and waits the interval of the stage that was just completed", () => {
    REVIEW_INTERVALS_HOURS.slice(0, -1).forEach((hours, stage) => {
      const next = scheduleNext(stage, now);
      expect(next.stage).toBe(stage + 1);
      expect(waitHours(next.next_review_at)).toBe(hours);
    });
  });

  it("stays on the last stage and keeps the longest wait", () => {
    const last = REVIEW_INTERVALS_HOURS.length - 1;
    const next = scheduleNext(last, now);
    expect(next.stage).toBe(last);
    expect(waitHours(next.next_review_at)).toBe(REVIEW_INTERVALS_HOURS[last]);
  });

  it("never goes past the schedule for out-of-range stages", () => {
    expect(scheduleNext(999, now).stage).toBe(REVIEW_INTERVALS_HOURS.length - 1);
  });

  it("starts with a 3 hour wait", () => {
    expect(REVIEW_INTERVALS_HOURS[0]).toBe(3);
  });
});

describe("scheduleRetry", () => {
  it("goes one stage back and comes back in 3 hours", () => {
    const next = scheduleRetry(3, now);
    expect(next.stage).toBe(2);
    expect(waitHours(next.next_review_at)).toBe(3);
  });

  it("does not go below stage 0", () => {
    expect(scheduleRetry(0, now).stage).toBe(0);
  });
});

describe("formatWait", () => {
  it("says now for zero or negative waits", () => {
    expect(formatWait(0)).toBe("şimdi");
    expect(formatWait(-5000)).toBe("şimdi");
  });

  it("uses hours below a day and rounds up", () => {
    expect(formatWait(3 * HOUR)).toBe("3 saat sonra");
    expect(formatWait(HOUR / 2)).toBe("1 saat sonra");
  });

  it("uses days from 24 hours up", () => {
    expect(formatWait(24 * HOUR)).toBe("1 gün sonra");
    expect(formatWait(49 * HOUR)).toBe("3 gün sonra");
  });
});

describe("msUntil", () => {
  it("is negative for the past and positive for the future", () => {
    expect(msUntil(new Date(Date.now() - 60_000).toISOString())).toBeLessThan(0);
    expect(msUntil(new Date(Date.now() + 60_000).toISOString())).toBeGreaterThan(0);
  });
});
