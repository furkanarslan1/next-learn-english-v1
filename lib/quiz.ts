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

export function buildFillQuestions(words: QuizWord[]): FillQuestion[] {
  return shuffle(words).map((w) => ({
    id: w.id,
    turkish: w.turkish,
    hint: blankOut(w.example_en, w.english),
    answer: w.english,
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
