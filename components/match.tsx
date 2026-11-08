"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiCheck } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { MatchRound } from "@/lib/quiz";

type Side = "left" | "right";

// A finished round moves on by itself after a short pause.
const ROUND_DELAY_MS = 900;

// Practice only: runs in the browser, nothing is saved.
export function Match({
  rounds,
  backHref,
  backLabel,
}: {
  rounds: MatchRound[];
  backHref: string;
  backLabel: string;
}) {
  const router = useRouter();
  const [roundIndex, setRoundIndex] = useState(0);
  const [selected, setSelected] = useState<{ side: Side; id: number } | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [flash, setFlash] = useState<{ left: number; right: number } | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  // The red "wrong" highlight disappears after a moment.
  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 600);
    return () => clearTimeout(t);
  }, [flash]);

  const finished = roundIndex >= rounds.length;
  const round = rounds[roundIndex];
  const roundDone = !finished && round.left.every((w) => matched.has(w.id));

  const pick = (side: Side, id: number) => {
    if (roundDone || matched.has(id) || flash) return;
    if (!selected || selected.side === side) {
      setSelected(selected?.side === side && selected.id === id ? null : { side, id });
      return;
    }
    const leftId = side === "right" ? selected.id : id;
    const rightId = side === "right" ? id : selected.id;
    if (leftId === rightId) {
      setMatched((m) => new Set(m).add(id));
      if (matched.size + 1 >= round.left.length) {
        timer.current = setTimeout(() => {
          setRoundIndex((i) => i + 1);
          setMatched(new Set());
        }, ROUND_DELAY_MS);
      }
    } else {
      setMistakes((n) => n + 1);
      setFlash({ left: leftId, right: rightId });
    }
    setSelected(null);
  };

  const restart = () => {
    clearTimeout(timer.current);
    router.refresh(); // new shuffle from the server
    setRoundIndex(0);
    setMatched(new Set());
    setSelected(null);
    setFlash(null);
    setMistakes(0);
  };

  if (finished) {
    return (
      <Card>
        <CardContent className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Eşleştirme bitti</h2>
          <p>
            {mistakes === 0 ? (
              "Hiç hata yapmadın!"
            ) : (
              <>
                <strong>{mistakes}</strong> yanlış deneme yaptın.
              </>
            )}
          </p>
          <Button onClick={restart}>Tekrar oyna</Button>
          <Button variant="ghost" nativeButton={false} render={<Link href={backHref} />}>
            {backLabel}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const item = (side: Side, w: { id: number; text: string }) => {
    const isMatched = matched.has(w.id);
    const isSelected = selected?.side === side && selected.id === w.id;
    const isWrong = flash !== null && flash[side] === w.id;
    return (
      <button
        key={`${side}-${w.id}`}
        type="button"
        onClick={() => pick(side, w.id)}
        disabled={isMatched}
        aria-pressed={isSelected}
        className={cn(
          "flex min-h-14 w-full items-center justify-between gap-2 rounded-lg border-2 px-3 py-2 text-left text-sm font-medium transition-colors",
          "border-input bg-background hover:bg-muted",
          isSelected && "border-primary bg-primary/10",
          isWrong && "border-destructive bg-destructive/10 text-destructive",
          isMatched && "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400",
          side === "left" && "text-base font-semibold",
        )}
      >
        <span>{w.text}</span>
        {isMatched && <FiCheck className="shrink-0" aria-label="Doğru" />}
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Tur {roundIndex + 1}/{rounds.length} · Bir kelimeye, sonra anlamına dokun
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">{round.left.map((w) => item("left", w))}</div>
        <div className="flex flex-col gap-2">{round.right.map((w) => item("right", w))}</div>
      </div>
      {roundDone && (
        <p role="status" className="text-center font-semibold text-success">
          Tur tamamlandı!
        </p>
      )}
    </div>
  );
}
