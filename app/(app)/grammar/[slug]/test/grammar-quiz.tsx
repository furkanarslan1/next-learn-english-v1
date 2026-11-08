"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { GrammarExercise } from "@/lib/grammar";
import { cn } from "@/lib/utils";
import { completeGrammarTest } from "../../actions";

export function GrammarQuiz({
  topicId,
  exercises,
  backHref,
}: {
  topicId: number;
  exercises: GrammarExercise[];
  backHref: string;
}) {
  const [list, setList] = useState(exercises);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState<GrammarExercise[]>([]);
  const [isRetry, setIsRetry] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();

  const done = index >= list.length;
  const exercise = list[index];

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === exercise.answer) setScore((s) => s + 1);
    else setWrong((w) => [...w, exercise]);
  };

  const next = () => {
    const isLast = index + 1 >= list.length;
    setIndex((i) => i + 1);
    setPicked(null);
    // Only the first full run is saved to the review schedule.
    if (isLast && !isRetry) {
      startSaving(async () => {
        const result = await completeGrammarTest(topicId, score, list.length);
        setSaveMessage(result.message);
      });
    }
  };

  const restart = (nextList: GrammarExercise[], retry: boolean) => {
    setList(nextList);
    setIndex(0);
    setPicked(null);
    setScore(0);
    setWrong([]);
    setIsRetry(retry);
  };

  if (done) {
    return (
      <Card>
        <CardContent className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Test bitti</h2>
          <p>
            {list.length} sorudan <strong>{score}</strong> tanesini doğru yaptın.
          </p>
          {!isRetry && (
            <p className="text-sm text-muted-foreground">
              {saving ? "Kaydediliyor…" : saveMessage}
            </p>
          )}
          {wrong.length > 0 && (
            <Button onClick={() => restart(wrong, true)}>
              Yanlışları tekrar et ({wrong.length})
            </Button>
          )}
          <Button variant="outline" onClick={() => restart(exercises, true)}>
            Baştan başla
          </Button>
          <Button variant="ghost" nativeButton={false} render={<Link href={backHref} />}>
            Konuya dön
          </Button>
        </CardContent>
      </Card>
    );
  }

  const [before, after] = exercise.sentence.split("___");
  const correct = picked !== null && picked === exercise.answer;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Soru {index + 1}/{list.length}
      </p>
      <Card>
        <CardContent className="flex flex-col gap-5">
          <p className="text-xl font-semibold leading-relaxed">
            {before}
            <span
              className={cn(
                "mx-1 inline-block min-w-16 border-b-2 px-1 text-center",
                picked === null && "border-input text-transparent",
                picked !== null && (correct ? "border-success text-success" : "border-destructive text-destructive"),
              )}
            >
              {picked === null ? "___" : exercise.options[picked]}
            </span>
            {after}
          </p>

          <div className="flex flex-col gap-2">
            {exercise.options.map((option, i) => (
              <Button
                key={option}
                variant="outline"
                className={cn(
                  "h-auto justify-start py-3 text-left text-base",
                  picked !== null && i === exercise.answer && "border-success bg-success/10",
                  picked === i && i !== exercise.answer && "border-destructive bg-destructive/10",
                )}
                disabled={picked !== null}
                onClick={() => choose(i)}
              >
                {option}
              </Button>
            ))}
          </div>

          {picked !== null && (
            <div
              role="status"
              className={cn(
                "flex items-start gap-2 rounded-xl p-3 text-sm",
                correct ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
              )}
            >
              {correct ? <FiCheck className="mt-0.5" /> : <FiX className="mt-0.5" />}
              <div>
                <p className="font-semibold">{correct ? "Doğru!" : "Yanlış"}</p>
                <p className="text-foreground/80">{exercise.explanation}</p>
              </div>
            </div>
          )}

          {picked !== null && (
            <Button onClick={next}>{index + 1 >= list.length ? "Sonucu gör" : "Sonraki"}</Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
