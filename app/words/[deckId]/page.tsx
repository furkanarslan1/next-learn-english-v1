import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { FiArrowLeft } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { msUntil } from "@/lib/srs";
import { createClient } from "@/lib/supabase/server";
import { Study } from "./study";

export default function DeckPage({ params }: PageProps<"/words/[deckId]">) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 p-4">
      <header className="flex items-center gap-2">
        <Button variant="ghost" size="icon" nativeButton={false} render={<Link href="/words" aria-label="Back" />}>
          <FiArrowLeft />
        </Button>
      </header>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading cards…</p>}>
        <Deck params={params} />
      </Suspense>
    </main>
  );
}

async function Deck({ params }: { params: Promise<{ deckId: string }> }) {
  await connection(); // session + time checks must run at request time
  const deckId = Number((await params).deckId);
  if (!Number.isInteger(deckId)) notFound();

  const supabase = await createClient();
  const [{ data: row }, { data: deck }] = await Promise.all([
    supabase.from("user_decks").select("*").eq("deck_id", deckId).maybeSingle(),
    supabase
      .from("decks")
      .select("title, deck_words(position, words(*))")
      .eq("id", deckId)
      .maybeSingle(),
  ]);

  if (!deck) notFound();
  if (!row) redirect("/words"); // deck not started yet

  // Words marked "I know this" are hidden from sessions.
  const words = deck.deck_words
    .sort((a, b) => a.position - b.position)
    .map((dw) => dw.words)
    .filter((w) => w !== null && !row.known_word_ids.includes(w.id));

  return (
    <Study
      deckId={deckId}
      title={deck.title}
      words={words}
      isDue={msUntil(row.next_review_at) <= 0}
    />
  );
}
