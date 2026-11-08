import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { FiArrowLeft } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
  buildFillQuestions,
  buildMatchRounds,
  buildTrueFalseQuestions,
} from "@/lib/quiz";
import { createClient } from "@/lib/supabase/server";
import { Match } from "@/components/match";
import { Quiz } from "@/components/quiz";

const MODE_TITLE = {
  fill: "Boşluk doldurma",
  tf: "Doğru / Yanlış",
  match: "Eşleştirme",
} as const;

export default function TestPage({
  params,
}: PageProps<"/words/[deckId]/test/[mode]">) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 p-4">
      <Suspense fallback={<p className="text-sm text-muted-foreground">Test hazırlanıyor…</p>}>
        <QuizLoader params={params} />
      </Suspense>
    </main>
  );
}

async function QuizLoader({
  params,
}: {
  params: Promise<{ deckId: string; mode: string }>;
}) {
  await connection(); // questions are shuffled per request
  const { deckId: rawId, mode } = await params;
  const deckId = Number(rawId);
  if (!Number.isInteger(deckId) || (mode !== "fill" && mode !== "tf" && mode !== "match")) notFound();

  const supabase = await createClient();
  const { data: deck } = await supabase
    .from("decks")
    .select("title, deck_words(position, words(id, english, turkish, example_en))")
    .eq("id", deckId)
    .maybeSingle();
  if (!deck) notFound();

  const words = deck.deck_words
    .sort((a, b) => a.position - b.position)
    .flatMap((dw) => (dw.words ? [dw.words] : []));

  return (
    <>
      <header className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          nativeButton={false}
          render={<Link href={`/words/${deckId}`} aria-label="Geri" />}
        >
          <FiArrowLeft />
        </Button>
        <h1 className="text-xl font-semibold">
          {deck.title} · {MODE_TITLE[mode]}
        </h1>
      </header>
      {mode === "match" ? (
        <Match
          rounds={buildMatchRounds(words)}
          backHref={`/words/${deckId}`}
          backLabel="Desteye dön"
        />
      ) : mode === "fill" ? (
        <Quiz
          mode="fill"
          backHref={`/words/${deckId}`}
          backLabel="Desteye dön"
          questions={buildFillQuestions(words)}
        />
      ) : (
        <Quiz
          mode="tf"
          backHref={`/words/${deckId}`}
          backLabel="Desteye dön"
          questions={buildTrueFalseQuestions(words)}
        />
      )}
    </>
  );
}
