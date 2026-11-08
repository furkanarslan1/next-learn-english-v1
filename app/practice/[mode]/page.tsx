import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { FiArrowLeft } from "react-icons/fi";
import { Quiz } from "@/components/quiz";
import { Button } from "@/components/ui/button";
import {
  buildFillQuestions,
  buildTrueFalseQuestions,
  pickRandom,
} from "@/lib/quiz";
import { createClient } from "@/lib/supabase/server";

const QUESTION_COUNT = 10;

export default function PracticeModePage({
  params,
}: PageProps<"/practice/[mode]">) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 p-4">
      <header className="flex items-center gap-2">
        <Button variant="ghost" size="icon" nativeButton={false} render={<Link href="/practice" aria-label="Geri" />}>
          <FiArrowLeft />
        </Button>
        <h1 className="text-xl font-semibold">Genel pratik</h1>
      </header>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Test hazırlanıyor…</p>}>
        <PracticeQuiz params={params} />
      </Suspense>
    </main>
  );
}

async function PracticeQuiz({ params }: { params: Promise<{ mode: string }> }) {
  await connection(); // questions are random per request
  const { mode } = await params;
  if (mode !== "fill" && mode !== "tf") notFound();

  const supabase = await createClient();
  const [{ data: profile }, { data: decks }] = await Promise.all([
    supabase.from("profiles").select("learned_word_ids").single(),
    supabase.from("user_decks").select("known_word_ids"),
  ]);

  // Words from learned decks plus words marked "I know this" in active decks.
  const ids = [
    ...new Set([
      ...(profile?.learned_word_ids ?? []),
      ...(decks ?? []).flatMap((d) => d.known_word_ids),
    ]),
  ];
  // Pick the random subset first so we only fetch what we need.
  const picked = pickRandom(ids, QUESTION_COUNT);

  if (picked.length < 2) {
    return (
      <p className="text-sm text-muted-foreground">
        Henüz yeterli kelime öğrenmedin. Kelime desteleri çalışıp birkaç kelimeyi
        &quot;biliyorum&quot; olarak işaretle, sonra buraya dön.
      </p>
    );
  }

  const { data: words } = await supabase
    .from("words")
    .select("id, english, turkish, example_en")
    .in("id", picked);

  const list = words ?? [];
  return mode === "fill" ? (
    <Quiz mode="fill" backHref="/words" backLabel="Kelimelere dön" questions={buildFillQuestions(list)} />
  ) : (
    <Quiz mode="tf" backHref="/words" backLabel="Kelimelere dön" questions={buildTrueFalseQuestions(list)} />
  );
}
