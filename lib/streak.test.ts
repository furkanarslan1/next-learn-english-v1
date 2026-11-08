import { describe, expect, it } from "vitest";
import { streakStatus, todayInTurkey } from "./streak";

describe("streakStatus", () => {
  it("is 0 when there is no activity yet", () => {
    expect(streakStatus(0, null, "2026-11-08")).toEqual({ count: 0, doneToday: false });
  });

  it("counts as done today when the last activity was today", () => {
    expect(streakStatus(4, "2026-11-08", "2026-11-08")).toEqual({ count: 4, doneToday: true });
  });

  it("is still alive, but not done, when the last activity was yesterday", () => {
    expect(streakStatus(4, "2026-11-07", "2026-11-08")).toEqual({ count: 4, doneToday: false });
  });

  it("is broken after a missed day", () => {
    expect(streakStatus(4, "2026-11-06", "2026-11-08")).toEqual({ count: 0, doneToday: false });
  });

  it("works across a month boundary", () => {
    expect(streakStatus(3, "2026-10-31", "2026-11-01")).toEqual({ count: 3, doneToday: false });
  });
});

describe("todayInTurkey", () => {
  it("returns a YYYY-MM-DD date", () => {
    expect(todayInTurkey()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
