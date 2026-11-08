import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { FiArrowLeft } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatWait, MAX_ACTIVE_DECKS, msUntil } from "@/lib/srs";
import { createClient } from "@/lib/supabase/server";
import { startDeck } from "./actions";

export default function WordsPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4">
      <header className="flex items-center gap-2">
        <Button variant="ghost" size="icon" nativeButton={false} render={<Link href="/" aria-label="Back" />}>
          <FiArrowLeft />
        </Button>
        <h1 className="text-xl font-semibold">Learn words</h1>
      </header>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading decks…</p>}>
        <Decks />
      </Suspense>
    </main>
  );
}

async function Decks() {
  await connection(); // session + time checks must run at request time
  const supabase = await createClient();
  const [{ data: decks }, { data: active }, { data: profile }] = await Promise.all([
    supabase
      .from("decks")
      .select("id, title, category, level, position, deck_words(count)")
      .order("position"),
    supabase.from("user_decks").select("deck_id, next_review_at, known_word_ids"),
    supabase.from("profiles").select("learned_deck_ids").single(),
  ]);

  if (!decks?.length) {
    return <p className="text-sm text-muted-foreground">No decks yet.</p>;
  }

  const activeByDeck = new Map((active ?? []).map((a) => [a.deck_id, a]));
  const learned = new Set(profile?.learned_deck_ids ?? []);
  const limitReached = (active?.length ?? 0) >= MAX_ACTIVE_DECKS;

  // Tabs: one per CEFR level that has decks, then YDS.
  const tabs = [
    ...[...new Set(decks.filter((d) => d.category === "general").map((d) => d.level!))].sort(),
    ...(decks.some((d) => d.category === "yds") ? ["YDS"] : []),
  ];
  const decksFor = (tab: string) =>
    decks.filter((d) => (tab === "YDS" ? d.category === "yds" : d.level === tab));

  return (
    <Tabs defaultValue={tabs[0]}>
      <TabsList>
        {tabs.map((t) => (
          <TabsTrigger key={t} value={t}>
            {t}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((t) => (
        <TabsContent key={t} value={t} className="mt-4 grid gap-3">
          {decksFor(t).map((deck) => {
            const total = deck.deck_words[0]?.count ?? 0;
            const row = activeByDeck.get(deck.id);
            const isLearned = learned.has(deck.id);
            const knownCount = row?.known_word_ids.length ?? 0;
            const wait = row ? msUntil(row.next_review_at) : 0;

            return (
              <Card key={deck.id}>
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle>{deck.title}</CardTitle>
                  {isLearned ? (
                    <Badge variant="secondary">Learned</Badge>
                  ) : row ? (
                    <Badge variant={wait <= 0 ? "default" : "outline"}>
                      {wait <= 0 ? "Review due" : `Next ${formatWait(wait)}`}
                    </Badge>
                  ) : null}
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground">{total} words</p>
                  {row && <Progress value={total ? (knownCount / total) * 100 : 0} />}
                  {row ? (
                    <Button nativeButton={false} render={<Link href={`/words/${deck.id}`} />}>Study</Button>
                  ) : !isLearned ? (
                    <form action={startDeck.bind(null, deck.id)}>
                      <Button type="submit" className="w-full" disabled={limitReached}>
                        {limitReached ? `Max ${MAX_ACTIVE_DECKS} active decks` : "Start deck"}
                      </Button>
                    </form>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      ))}
    </Tabs>
  );
}
