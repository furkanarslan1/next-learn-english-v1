"use client";

import { useRef, useState, useTransition } from "react";
import { FiCheck, FiChevronLeft, FiChevronRight, FiVolume2 } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { completeSession, learnDeck } from "../actions";

type Word = {
  id: number;
  english: string;
  turkish: string;
  part_of_speech: string | null;
  example_en: string | null;
  example_tr: string | null;
  usage_note: string | null;
};

const SWIPE_THRESHOLD = 50;

export function Study({
  deckId,
  title,
  words,
  isDue,
}: {
  deckId: number;
  title: string;
  words: Word[];
  isDue: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [pending, startTransition] = useTransition();
  const startX = useRef<number | null>(null);

  const isSummary = index >= words.length;
  const word = words[index];

  const go = (delta: number) =>
    setIndex((i) => Math.min(Math.max(i + delta, 0), words.length));

  const toggleKnown = (id: number) =>
    setKnown((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  const speak = (text: string) => {
    if (typeof speechSynthesis === "undefined") return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{title}</h1>
        <span className="text-sm text-muted-foreground">
          {Math.min(index + 1, words.length)}/{words.length}
        </span>
      </div>

      {!isDue && (
        <p className="text-sm text-muted-foreground">
          Not due yet. This is extra practice and won&apos;t move your schedule.
        </p>
      )}

      {isSummary ? (
        <Card>
          <CardContent className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Session complete</h2>
            <p className="text-sm text-muted-foreground">
              {known.size} word{known.size === 1 ? "" : "s"} marked as known.
            </p>
            <Button
              disabled={pending}
              onClick={() => startTransition(() => completeSession(deckId, [...known]))}
            >
              Finish session
            </Button>
            <Button
              variant="outline"
              disabled={pending}
              onClick={() => startTransition(() => learnDeck(deckId))}
            >
              I learned this deck
            </Button>
            <Button variant="ghost" disabled={pending} onClick={() => setIndex(0)}>
              Review again
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card
          className="touch-pan-y select-none"
          onPointerDown={(e) => (startX.current = e.clientX)}
          onPointerUp={(e) => {
            if (startX.current === null) return;
            const dx = e.clientX - startX.current;
            startX.current = null;
            if (dx <= -SWIPE_THRESHOLD) go(1);
            else if (dx >= SWIPE_THRESHOLD) go(-1);
          }}
        >
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-3xl font-bold">{word.english}</p>
                {word.part_of_speech && (
                  <Badge variant="outline" className="mt-2">
                    {word.part_of_speech}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Pronounce"
                onClick={() => speak(word.english)}
              >
                <FiVolume2 />
              </Button>
            </div>

            <p className="text-xl">{word.turkish}</p>

            {word.example_en && (
              <div className="rounded-md bg-muted p-3 text-sm">
                <p>{word.example_en}</p>
                {word.example_tr && (
                  <p className="mt-1 text-muted-foreground">{word.example_tr}</p>
                )}
              </div>
            )}

            {word.usage_note && (
              <div className="text-sm">
                <p className="font-medium">Ne için kullanılır?</p>
                <p className="text-muted-foreground">{word.usage_note}</p>
              </div>
            )}

            <Button
              variant={known.has(word.id) ? "default" : "outline"}
              onClick={() => toggleKnown(word.id)}
            >
              <FiCheck /> {known.has(word.id) ? "Marked as known" : "I know this"}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="mt-auto flex items-center justify-between">
        <Button variant="outline" size="icon" aria-label="Previous" disabled={index === 0} onClick={() => go(-1)}>
          <FiChevronLeft />
        </Button>
        <div className="flex gap-1.5">
          {words.map((w, i) => (
            <span
              key={w.id}
              className={cn(
                "size-2 rounded-full bg-muted-foreground/30",
                i === index && "bg-foreground",
                known.has(w.id) && i !== index && "bg-primary/60",
              )}
            />
          ))}
        </div>
        <Button variant="outline" size="icon" aria-label="Next" disabled={isSummary} onClick={() => go(1)}>
          <FiChevronRight />
        </Button>
      </div>
    </div>
  );
}
