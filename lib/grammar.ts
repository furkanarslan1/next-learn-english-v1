import type { Json } from "@/lib/supabase/database.types";

export type GrammarContent = {
  summary: string;
  rules: { title: string; text: string }[];
  forms: {
    label: string;
    formula: string;
    examples: { en: string; tr: string }[];
  }[];
  signals: string[];
  notes: string[];
  exercises: GrammarExercise[];
};

export type GrammarExercise = {
  /** Sentence with "___" where the answer goes. */
  sentence: string;
  options: string[];
  /** Index of the correct option. */
  answer: number;
  explanation: string;
};

/** Safely reads the jsonb `content` column; missing parts become empty. */
export function parseGrammarContent(json: Json): GrammarContent {
  const c = (typeof json === "object" && json && !Array.isArray(json) ? json : {}) as Record<string, unknown>;
  const list = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
  return {
    summary: typeof c.summary === "string" ? c.summary : "",
    rules: list(c.rules),
    forms: list(c.forms),
    signals: list(c.signals),
    notes: list(c.notes),
    exercises: list(c.exercises),
  };
}
