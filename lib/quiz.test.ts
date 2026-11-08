import { describe, expect, it } from "vitest";
import {
  buildFillQuestions,
  buildMask,
  buildMatchRounds,
  buildTrueFalseQuestions,
  normalizeAnswer,
  pickRandom,
  shuffle,
  type QuizWord,
} from "./quiz";

const words = (n: number): QuizWord[] =>
  Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    english: `word${i}`,
    turkish: `kelime${i}`,
    example_en: `I like word${i} very much.`,
  }));

describe("normalizeAnswer", () => {
  it("ignores case, outer spaces, repeated spaces and trailing punctuation", () => {
    expect(normalizeAnswer("  Hardly. ")).toBe("hardly");
    expect(normalizeAnswer("As   Soon  As")).toBe("as soon as");
    expect(normalizeAnswer("go!")).toBe("go");
  });
});

describe("shuffle and pickRandom", () => {
  it("keeps every item exactly once and does not change the input", () => {
    const input = [1, 2, 3, 4, 5, 6];
    const out = shuffle(input);
    expect([...out].sort()).toEqual(input);
    expect(input).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("picks at most the requested number without repeats", () => {
    const picked = pickRandom([1, 2, 3, 4, 5], 3);
    expect(picked).toHaveLength(3);
    expect(new Set(picked).size).toBe(3);
    expect(pickRandom([1, 2], 10)).toHaveLength(2);
  });
});

describe("buildMask", () => {
  it("always has one entry per character", () => {
    for (const w of ["hardly", "go", "as soon as", "comprehensive", "x", "well-known"]) {
      expect(buildMask(w)).toHaveLength([...w].length);
    }
  });

  it("shows the first letter and every non-letter, and hides most of the rest", () => {
    for (let run = 0; run < 20; run++) {
      const mask = buildMask("as soon as");
      expect(mask[0]).toBe(true);
      expect(mask[2]).toBe(true); // the spaces
      expect(mask[7]).toBe(true);
    }
    const hidden = buildMask("comprehensive").filter((shown) => !shown).length;
    expect(hidden).toBeGreaterThan(5);
  });

  it("hides at least one letter in a two-letter word", () => {
    expect(buildMask("go")).toEqual([true, false]);
  });
});

describe("buildFillQuestions", () => {
  it("blanks the word out of the example sentence", () => {
    const [q] = buildFillQuestions([
      { id: 1, english: "hardly", turkish: "neredeyse hiç", example_en: "I could hardly hear him." },
    ]);
    expect(q.hint).toBe("I could _____ hear him.");
    expect(q.answer).toBe("hardly");
    expect(q.mask).toHaveLength(6);
  });

  it("has no hint when the word is not in the sentence", () => {
    const [q] = buildFillQuestions([
      { id: 1, english: "go", turkish: "gitmek", example_en: "I went home." },
    ]);
    expect(q.hint).toBeNull();
  });
});

describe("buildTrueFalseQuestions", () => {
  it("shows the right meaning for true questions and a different one for false questions", () => {
    for (let run = 0; run < 20; run++) {
      for (const q of buildTrueFalseQuestions(words(5))) {
        if (q.isTrue) expect(q.shownTurkish).toBe(q.correctTurkish);
        else expect(q.shownTurkish).not.toBe(q.correctTurkish);
      }
    }
  });

  it("only asks true questions when there is nothing to mix up", () => {
    expect(buildTrueFalseQuestions(words(1)).every((q) => q.isTrue)).toBe(true);
  });
});

describe("buildMatchRounds", () => {
  it("needs at least two words", () => {
    expect(buildMatchRounds(words(0))).toEqual([]);
    expect(buildMatchRounds(words(1))).toEqual([]);
  });

  it("splits into rounds of five", () => {
    expect(buildMatchRounds(words(5)).map((r) => r.left.length)).toEqual([5]);
    expect(buildMatchRounds(words(10)).map((r) => r.left.length)).toEqual([5, 5]);
  });

  it("merges a last round of one word into the previous round", () => {
    expect(buildMatchRounds(words(6)).map((r) => r.left.length)).toEqual([6]);
    expect(buildMatchRounds(words(11)).map((r) => r.left.length)).toEqual([5, 6]);
  });

  it("pairs every English word with its own Turkish meaning", () => {
    for (const round of buildMatchRounds(words(10))) {
      expect(round.right).toHaveLength(round.left.length);
      for (const left of round.left) {
        const match = round.right.find((r) => r.id === left.id);
        expect(match?.text).toBe(`kelime${left.id - 1}`);
      }
    }
  });
});
