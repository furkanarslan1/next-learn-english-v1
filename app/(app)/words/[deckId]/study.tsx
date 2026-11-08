"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { FiCheck, FiChevronLeft, FiChevronRight } from "react-icons/fi";
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
  synonyms: string[];
};

const PART_OF_SPEECH_TR: Record<string, string> = {
  noun: "isim",
  verb: "fiil",
  adjective: "sıfat",
  adverb: "zarf",
  "noun/verb": "isim/fiil",
  preposition: "edat",
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

  const toggleKnown = (id: number) =>
    setKnown((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  // Swipe left = next card, swipe right = previous card.
  const onSwipe = (direction: SwipeDirection) =>
    setIndex((i) => Math.max(0, direction === "left" ? i + 1 : i - 1));

  const goPrevious = () =>
    isSummary ? setIndex(words.length - 1) : cardRef.current?.swipe("right");
  const goNext = () => cardRef.current?.swipe("left");

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
          <SwipeCard
            key={word.id}
            ref={cardRef}
            onSwipe={onSwipe}
            canSwipeRight={index > 0}
          >
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

              {word.synonyms.length > 0 && (
                <p className="text-sm">
                  <span className="text-muted-foreground">Eş anlamlılar: </span>
                  <span className="font-semibold">{word.synonyms.join(", ")}</span>
                </p>
              )}

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
        <>
          <Button
            variant={known.has(word.id) ? "default" : "outline"}
            onClick={() => toggleKnown(word.id)}
          >
            <FiCheck /> {known.has(word.id) ? "Biliyorum olarak işaretlendi" : "Biliyorum"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Kartı sola kaydırınca sonraki, sağa kaydırınca önceki kart gelir.
          </p>
        </>
      )}

      <div className="mt-auto flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="icon"
            aria-label="Önceki"
            disabled={index === 0}
            onClick={goPrevious}
          >
            <FiChevronLeft />
          </Button>
        <div className="flex flex-1 justify-center gap-1.5">
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
          <Button
            variant="outline"
            size="icon"
            aria-label="Sonraki"
            disabled={isSummary}
            onClick={goNext}
          >
            <FiChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
