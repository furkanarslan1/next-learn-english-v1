"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { submitDuel } from "../actions";

type Question = { english: string; options: string[] };

const now = () => performance.now();

export function Play({ duelId, questions }: { duelId: string; questions: Question[] }) {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [pending, startTransition] = useTransition();
  const startedAt = useRef(0);

  // The timer starts when the player presses "Başla".
  useEffect(() => {
    if (started) startedAt.current = now();
  }, [started]);

  if (!started) {
    return (
      <Card>
        <CardContent className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Hazır mısın?</h2>
          <p className="text-sm text-muted-foreground">
            {questions.length} soru var. Her kelimenin Türkçesini seç. Süre
            &quot;Başla&quot; ile başlar ve bitiş zamanı eşitlikte belirleyici olur.
            Sonuçlar en sonda gösterilir.
          </p>
          <Button onClick={() => setStarted(true)}>Başla</Button>
        </CardContent>
      </Card>
    );
  }

  const question = questions[index];

  const choose = (option: number) => {
    const next = [...answers, option];
    setAnswers(next);
    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else {
      const elapsed = now() - startedAt.current;
      startTransition(() => submitDuel(duelId, next, elapsed));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Soru {index + 1}/{questions.length}
      </p>
      <Card>
        <CardContent className="flex flex-col gap-4">
          <p className="text-3xl font-bold">{question.english}</p>
          <div className="flex flex-col gap-2">
            {question.options.map((option, i) => (
              <Button
                key={i}
                variant="outline"
                className="h-auto justify-start whitespace-normal py-3 text-left"
                disabled={pending}
                onClick={() => choose(i)}
              >
                {option}
              </Button>
            ))}
          </div>
          {pending && <p className="text-sm text-muted-foreground">Sonuç gönderiliyor…</p>}
        </CardContent>
      </Card>
    </div>
  );
}
