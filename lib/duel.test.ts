import { describe, expect, it } from "vitest";
import { duelOutcome, formatSeconds } from "./duel";

const base = {
  my_finished: true,
  their_finished: true,
  my_score: 5,
  my_time_ms: 10000,
  their_score: 5,
  their_time_ms: 10000,
};

describe("duelOutcome", () => {
  it("is my turn until I finish", () => {
    expect(duelOutcome({ ...base, my_finished: false })).toBe("my_turn");
  });

  it("waits for the opponent after I finish", () => {
    expect(duelOutcome({ ...base, their_finished: false })).toBe("waiting");
  });

  it("the higher score wins", () => {
    expect(duelOutcome({ ...base, my_score: 7, their_score: 6, my_time_ms: 99999 })).toBe("won");
    expect(duelOutcome({ ...base, my_score: 6, their_score: 7, my_time_ms: 1 })).toBe("lost");
  });

  it("the faster player wins when scores are equal", () => {
    expect(duelOutcome({ ...base, my_time_ms: 8000 })).toBe("won");
    expect(duelOutcome({ ...base, my_time_ms: 12000 })).toBe("lost");
  });

  it("is a draw with equal score and time", () => {
    expect(duelOutcome(base)).toBe("draw");
  });
});

describe("formatSeconds", () => {
  it("formats milliseconds with one decimal", () => {
    expect(formatSeconds(12345)).toBe("12.3 sn");
    expect(formatSeconds(null)).toBe("-");
  });
});
