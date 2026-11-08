// Quiz helpers. Pure functions (no framework imports) so they can be reused in the Expo app.

export type QuizWord = {
  id: number;
  english: string;
  turkish: string;
  example_en: string | null;
};

export type FillQuestion = {
  id: number;
  turkish: string;
  /** Example sentence with the word blanked out, if it can be found. */
  hint: string | null;
  answer: string;
  /** Per character of `answer`: true = shown to the player, false = must be typed. */
  mask: boolean[];
};

export type MatchRound = {
  /** English words, in a fixed order. */
  left: { id: number; text: string }[];
  /** Turkish meanings, shuffled. `id` matches the English word's id. */
  right: { id: number; text: string }[];
};

export type TrueFalseQuestion = {
  id: number;
  english: string;
  shownTurkish: string;
  isTrue: boolean;
  correctTurkish: string;
};

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Lowercase, trim, collapse spaces and drop trailing punctuation. */
export function normalizeAnswer(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.!?,;:]+$/, "");
}

function blankOut(sentence: string | null, english: string) {
  if (!sentence) return null;
  const escaped = english.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`\\b${escaped}\\w*`, "i");
  return pattern.test(sentence) ? sentence.replace(pattern, "_____") : null;
}

/**
 * Decides which characters are shown. Non-letters (spaces, hyphens) are always
 * shown, the first letter is shown, plus roughly 30% of the remaining letters.
 */
export function buildMask(word: string): boolean[] {
  const chars = [...word];
  const letterIdx = chars.flatMap((c, i) => (/\p{L}/u.test(c) ? [i] : []));
  const mask = chars.map((c) => !/\p{L}/u.test(c));
  if (letterIdx.length === 0) return mask;

  mask[letterIdx[0]] = true;
  const rest = letterIdx.slice(1);
  const extra = Math.floor(rest.length * 0.3);
  for (const i of shuffle(rest).slice(0, extra)) mask[i] = true;
  return mask;
}

export function buildFillQuestions(words: QuizWord[]): FillQuestion[] {
  return shuffle(words).map((w) => ({
    id: w.id,
    turkish: w.turkish,
    hint: blankOut(w.example_en, w.english),
    answer: w.english,
    mask: buildMask(w.english),
  }));
}

/** Splits words into rounds of `size` (a too-small last round is merged into the previous one). */
export function buildMatchRounds(words: QuizWord[], size = 5): MatchRound[] {
  if (words.length < 2) return [];
  const shuffled = shuffle(words);
  const chunks: QuizWord[][] = [];
  for (let i = 0; i < shuffled.length; i += size) chunks.push(shuffled.slice(i, i + size));
  if (chunks.length > 1 && chunks[chunks.length - 1].length < 2) {
    chunks[chunks.length - 2].push(...chunks.pop()!);
  }
  return chunks.map((chunk) => ({
    left: chunk.map((w) => ({ id: w.id, text: w.english })),
    right: shuffle(chunk.map((w) => ({ id: w.id, text: w.turkish }))),
  }));
}

export function buildTrueFalseQuestions(words: QuizWord[]): TrueFalseQuestion[] {
  return shuffle(words).map((w) => {
    const others = words.filter((o) => o.turkish !== w.turkish);
    const useWrong = others.length > 0 && Math.random() < 0.5;
    const wrong = useWrong ? shuffle(others)[0] : null;
    return {
      id: w.id,
      english: w.english,
      shownTurkish: wrong ? wrong.turkish : w.turkish,
      isTrue: !wrong,
      correctTurkish: w.turkish,
    };
  });
}

/** Picks up to `count` random items. */
export function pickRandom<T>(items: T[], count: number): T[] {
  return shuffle(items).slice(0, count);
}
