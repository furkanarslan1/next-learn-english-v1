"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { FiCheck, FiRotateCcw, FiX } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SwipeCard, type SwipeCardHandle, type SwipeDirection } from "@/components/swipe-card";
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

const PART_OF_SPEECH_TR: Record<string, string> = {
  noun: "isim",
  verb: "fiil",
  adjective: "sıfat",
  adverb: "zarf",
  "noun/verb": "isim/fiil",
};

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
  const cardRef = useRef<SwipeCardHandle>(null);

  const isSummary = index >= words.length;
  const word = words[index];

  // Swipe right = "I know it" (hidden in later sessions), swipe left = "not yet".
  const decide = (direction: SwipeDirection) => {
    setKnown((prev) => {
      const next = new Set(prev);
      if (direction === "right") next.add(word.id);
      else next.delete(word.id);
      return next;
    });
    setIndex((i) => i + 1);
  };

  const undo = () => {
    const previous = words[index - 1];
    if (!previous) return;
    setKnown((prev) => {
      const next = new Set(prev);
      next.delete(previous.id);
      return next;
    });
    setIndex(index - 1);
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
          Henüz tekrar zamanı gelmedi. Bu ekstra pratik, tekrar takvimini ilerletmez.
        </p>
      )}

      {isSummary ? (
        <Card>
          <CardContent className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Oturum tamamlandı</h2>
            <p className="text-sm text-muted-foreground">
              {known.size} kelime &quot;biliyorum&quot; olarak işaretlendi.
            </p>
            <Button
              disabled={pending}
              onClick={() => startTransition(() => completeSession(deckId, [...known]))}
            >
              Oturumu bitir
            </Button>
            <Button
              variant="outline"
              disabled={pending}
              onClick={() => startTransition(() => learnDeck(deckId))}
            >
              Desteyi öğrendim
            </Button>
            <Button variant="ghost" disabled={pending} onClick={() => setIndex(0)}>
              Kartları tekrar gez
            </Button>
            <div className="grid gap-2">
              <Button
                variant="secondary"
                nativeButton={false}
                render={<Link href={`/words/${deckId}/test/match`} />}
              >
                Eşleştirme
              </Button>
              <Button
                variant="secondary"
                nativeButton={false}
                render={<Link href={`/words/${deckId}/test/fill`} />}
              >
                Boşluk doldurma
              </Button>
              <Button
                variant="secondary"
                nativeButton={false}
                render={<Link href={`/words/${deckId}/test/tf`} />}
              >
                Doğru / Yanlış
              </Button>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Testler isteğe bağlıdır.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          {/* A hint of the cards waiting underneath. */}
          {index + 1 < words.length && (
            <div
              aria-hidden
              className="absolute inset-x-4 -bottom-2 top-3 -z-10 rounded-3xl bg-muted ring-1 ring-border"
            />
          )}
          <SwipeCard key={word.id} ref={cardRef} onSwipe={decide}>
            <div className="flex flex-col gap-4 p-5">
              <div>
                <p className="text-4xl font-extrabold tracking-tight">{word.english}</p>
                {word.part_of_speech && (
                  <Badge variant="outline" className="mt-2">
                    {PART_OF_SPEECH_TR[word.part_of_speech] ?? word.part_of_speech}
                  </Badge>
                )}
              </div>

              <p className="text-xl font-bold text-primary">{word.turkish}</p>

              {word.example_en && (
                <div className="rounded-xl border-l-4 border-amber bg-amber/10 p-3 text-sm">
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
            </div>
          </SwipeCard>
        </div>
      )}

      {!isSummary && (
        <p className="text-center text-xs text-muted-foreground">
          Sağa kaydır: biliyorum · Sola kaydır: henüz değil
        </p>
      )}

      <div className="mt-auto flex flex-col gap-3">
        {!isSummary && (
          <div className="grid grid-cols-[auto_1fr_1fr] gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label="Geri al"
              disabled={index === 0}
              onClick={undo}
            >
              <FiRotateCcw />
            </Button>
            <Button variant="outline" onClick={() => cardRef.current?.swipe("left")}>
              <FiX /> Henüz değil
            </Button>
            <Button onClick={() => cardRef.current?.swipe("right")}>
              <FiCheck /> Biliyorum
            </Button>
          </div>
        )}
        {isSummary && index > 0 && (
          <Button variant="ghost" size="sm" onClick={undo}>
            <FiRotateCcw /> Son kartı geri al
          </Button>
        )}
        <div className="flex justify-center gap-1.5">
          {words.map((w, i) => (
            <span
              key={w.id}
              className={cn(
                "size-2 rounded-full bg-muted-foreground/30",
                i === index && "bg-foreground",
                known.has(w.id) && i !== index && "bg-success",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
