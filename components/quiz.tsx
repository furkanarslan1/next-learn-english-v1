"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  normalizeAnswer,
  type FillQuestion,
  type TrueFalseQuestion,
} from "@/lib/quiz";

type Props =
  | { mode: "fill"; backHref: string; backLabel: string; questions: FillQuestion[] }
  | { mode: "tf"; backHref: string; backLabel: string; questions: TrueFalseQuestion[] };

// After an answer the next question appears on its own. A wrong answer stays
// longer so the correct answer can be read.
const CORRECT_DELAY_MS = 800;
const WRONG_DELAY_MS = 2200;

// Practice only: everything runs in the browser, nothing is saved.
export function Quiz(props: Props) {
  const [questions, setQuestions] = useState<(FillQuestion | TrueFalseQuestion)[]>(
    props.questions,
  );
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState<(FillQuestion | TrueFalseQuestion)[]>([]);

  const done = index >= questions.length;
  const question = questions[index];

  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const next = () => {
    setIndex((i) => i + 1);
    setResult(null);
  };

  const submit = (isCorrect: boolean) => {
    setResult(isCorrect ? "correct" : "wrong");
    if (isCorrect) setScore((s) => s + 1);
    else setWrong((w) => [...w, question]);
    timer.current = setTimeout(next, isCorrect ? CORRECT_DELAY_MS : WRONG_DELAY_MS);
  };

  const restart = (list: (FillQuestion | TrueFalseQuestion)[]) => {
    clearTimeout(timer.current);
    setQuestions(list);
    setIndex(0);
    setResult(null);
    setScore(0);
    setWrong([]);
  };

  if (done) {
    return (
      <Card>
        <CardContent className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Test bitti</h2>
          <p>
            {questions.length} sorudan <strong>{score}</strong> tanesini doğru
            yaptın.
          </p>
          {wrong.length > 0 && (
            <Button onClick={() => restart(wrong)}>
              Yanlışları tekrar et ({wrong.length})
            </Button>
          )}
          <Button variant="outline" onClick={() => restart(props.questions)}>
            Baştan başla
          </Button>
          <Button
            variant="ghost"
            nativeButton={false}
            render={<Link href={props.backHref} />}
          >
            {props.backLabel}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Soru {index + 1}/{questions.length}
      </p>

      <Card>
        <CardContent className="flex flex-col gap-4">
          {props.mode === "fill" ? (
            <FillView
              key={`${index}-${question.id}`}
              question={question as FillQuestion}
              result={result}
              onCheck={(typed) =>
                submit(
                  normalizeAnswer(typed) ===
                    normalizeAnswer((question as FillQuestion).answer),
                )
              }
            />
          ) : (
            <TrueFalseView
              question={question as TrueFalseQuestion}
              result={result}
              onAnswer={(value) =>
                submit(value === (question as TrueFalseQuestion).isTrue)
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ResultBanner({
  result,
  children,
}: {
  result: "correct" | "wrong";
  children?: React.ReactNode;
}) {
  return (
    <div
      role="status"
      className={
        result === "correct"
          ? "flex items-start gap-2 rounded-md bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400"
          : "flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive"
      }
    >
      {result === "correct" ? <FiCheck className="mt-0.5" /> : <FiX className="mt-0.5" />}
      <div>
        <p className="font-medium">{result === "correct" ? "Doğru!" : "Yanlış"}</p>
        {children}
      </div>
    </div>
  );
}

/** Letter boxes: some letters are given, the player fills in the empty boxes. */
function FillView({
  question,
  result,
  onCheck,
}: {
  question: FillQuestion;
  result: "correct" | "wrong" | null;
  onCheck: (typed: string) => void;
}) {
  const chars = [...question.answer];
  const blanks = chars.flatMap((_, i) => (question.mask[i] ? [] : [i]));

  // typed letters by character position; `hinted` positions are filled by the hint button
  const [typed, setTyped] = useState<Record<number, string>>({});
  const [hinted, setHinted] = useState<Set<number>>(new Set());
  const inputs = useRef<Record<number, HTMLInputElement | null>>({});

  const valueAt = (i: number) => (question.mask[i] ? chars[i] : (typed[i] ?? ""));
  const complete = blanks.every((i) => (typed[i] ?? "") !== "");
  const locked = result !== null;

  const focusBlank = (i: number | undefined) => {
    if (i !== undefined) inputs.current[i]?.focus();
  };

  const onType = (i: number, raw: string) => {
    const letter = [...raw].pop() ?? "";
    setTyped((t) => ({ ...t, [i]: letter }));
    if (letter) focusBlank(blanks[blanks.indexOf(i) + 1]);
  };

  const onBackspace = (i: number) => {
    if ((typed[i] ?? "") === "") focusBlank(blanks[blanks.indexOf(i) - 1]);
  };

  const giveHint = () => {
    const target = blanks.find((i) => !hinted.has(i) && (typed[i] ?? "").toLowerCase() !== chars[i].toLowerCase());
    if (target === undefined) return;
    setTyped((t) => ({ ...t, [target]: chars[target] }));
    setHinted((h) => new Set(h).add(target));
  };

  const submit = () => {
    if (!locked && complete) onCheck(chars.map((_, i) => valueAt(i)).join(""));
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <p className="text-sm text-muted-foreground">Eksik harfleri tamamla:</p>
      <p className="text-2xl font-bold">{question.turkish}</p>

      <div className="flex flex-wrap gap-1.5" aria-label="Kelime">
        {chars.map((ch, i) =>
          ch === " " ? (
            <span key={i} className="w-3" aria-hidden />
          ) : question.mask[i] ? (
            <span
              key={i}
              className="flex h-11 w-9 items-center justify-center rounded-md bg-muted text-lg font-semibold"
            >
              {ch}
            </span>
          ) : (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              value={typed[i] ?? ""}
              onChange={(e) => onType(i, e.target.value)}
              onKeyDown={(e) => e.key === "Backspace" && onBackspace(i)}
              onFocus={(e) => e.target.select()}
              disabled={locked || hinted.has(i)}
              maxLength={2}
              inputMode="text"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              autoFocus={i === blanks[0]}
              aria-label={`Harf ${i + 1}`}
              className={cn(
                "h-11 w-9 rounded-md border-2 border-input bg-background text-center text-lg font-semibold outline-none focus:border-ring",
                hinted.has(i) && "border-primary/40 bg-primary/10",
                locked &&
                  (result === "correct"
                    ? "border-green-500"
                    : (typed[i] ?? "").toLowerCase() === ch.toLowerCase()
                      ? "border-green-500"
                      : "border-destructive"),
              )}
            />
          ),
        )}
      </div>

      {question.hint && (
        <p className="rounded-md bg-muted p-3 text-sm">{question.hint}</p>
      )}

      {result ? (
        <ResultBanner result={result}>
          {result === "wrong" && (
            <p>
              Doğru cevap: <strong>{question.answer}</strong>
            </p>
          )}
        </ResultBanner>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <Button type="button" variant="outline" onClick={giveHint}>
            İpucu
          </Button>
          <Button type="submit" disabled={!complete}>
            Kontrol et
          </Button>
        </div>
      )}
    </form>
  );
}

function TrueFalseView({
  question,
  result,
  onAnswer,
}: {
  question: TrueFalseQuestion;
  result: "correct" | "wrong" | null;
  onAnswer: (value: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">Bu eşleşme doğru mu?</p>
      <p className="text-2xl font-bold">{question.english}</p>
      <p className="text-xl">= {question.shownTurkish}</p>
      {result ? (
        <ResultBanner result={result}>
          {result === "wrong" && (
            <p>
              <strong>{question.english}</strong> = {question.correctTurkish}
            </p>
          )}
        </ResultBanner>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => onAnswer(true)}>Doğru</Button>
          <Button variant="outline" onClick={() => onAnswer(false)}>
            Yanlış
          </Button>
        </div>
      )}
    </div>
  );
}
