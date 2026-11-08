import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { FaFire } from "react-icons/fa6";
import { FiBookOpen, FiEdit3, FiLogOut, FiZap } from "react-icons/fi";
import { signout } from "@/app/(auth)/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatWait, MAX_ACTIVE_DECKS, msUntil } from "@/lib/srs";
import { streakStatus, todayInTurkey } from "@/lib/streak";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 p-4 pt-6">
      <header className="flex items-center justify-between gap-2">
        <Suspense fallback={<h1 className="text-2xl font-extrabold">Merhaba</h1>}>
          <Greeting />
        </Suspense>
        <div className="flex items-center gap-1">
          <Suspense fallback={null}>
            <StreakBadge />
          </Suspense>
          <form action={signout}>
            <Button variant="ghost" size="icon" type="submit" aria-label="Çıkış yap">
              <FiLogOut />
            </Button>
          </form>
        </div>
      </header>

      <Suspense fallback={null}>
        <MyDecks />
      </Suspense>

      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/words"
          className="col-span-2 flex items-center gap-4 rounded-3xl bg-secondary p-5 transition-colors hover:bg-secondary/70"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <FiBookOpen className="size-6" />
          </span>
          <span>
            <span className="block text-lg font-extrabold">Kelime öğren</span>
            <span className="block text-sm text-muted-foreground">
              Destelerini çalış, kendini test et.
            </span>
          </span>
        </Link>
        <Link
          href="/grammar"
          className="flex flex-col gap-3 rounded-3xl bg-amber/20 p-5 transition-colors hover:bg-amber/30"
        >
          <FiEdit3 className="size-6 text-amber-foreground" />
          <span>
            <span className="block text-lg font-extrabold">Gramer</span>
            <span className="block text-sm text-muted-foreground">Kurallar ve örnekler</span>
          </span>
        </Link>
        <Link
          href="/duels"
          className="flex flex-col gap-3 rounded-3xl bg-primary/10 p-5 transition-colors hover:bg-primary/15"
        >
          <FiZap className="size-6 text-primary" />
          <span>
            <span className="block text-lg font-extrabold">Düello</span>
            <span className="block text-sm text-muted-foreground">Arkadaşına meydan oku</span>
          </span>
        </Link>
      </div>
    </main>
  );
}

async function Greeting() {
  await connection(); // reads the session (uses the current time), so render at request time only
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .maybeSingle();

  // Signed in but no nickname yet.
  if (!profile?.username) redirect("/onboarding");

  return (
    <h1 className="text-2xl font-extrabold tracking-tight">
      Merhaba, {profile.username}
    </h1>
  );
}

/** Days in a row with a completed activity. Muted until today's activity is done. */
async function StreakBadge() {
  await connection();
  const supabase = await createClient();
  const { data: p } = await supabase
    .from("profiles")
    .select("streak_count, streak_last_date")
    .maybeSingle();

  const { count, doneToday } = streakStatus(
    p?.streak_count ?? 0,
    p?.streak_last_date ?? null,
    todayInTurkey(),
  );

  return (
    <span
      className={cn(
        "flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-extrabold",
        doneToday ? "bg-amber/25 text-amber-foreground" : "bg-muted text-muted-foreground",
      )}
      title={doneToday ? "Bugün tamamlandı" : "Seriyi sürdürmek için bugün bir etkinlik tamamla"}
    >
      <FaFire className={cn("size-4", doneToday && "text-amber")} aria-hidden />
      {count} gün
    </span>
  );
}

/** The decks being studied right now, one tap away from studying. */
async function MyDecks() {
  await connection();
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_decks")
    .select(
      "deck_id, next_review_at, known_word_ids, decks(title, category, level, deck_words(count))",
    );

  const decks = (data ?? [])
    .flatMap((row) => {
      const deck = row.decks;
      if (!deck) return [];
      return [
        {
          id: row.deck_id,
          title: deck.title,
          label: deck.category === "yds" ? "YDS" : (deck.level ?? ""),
          total: deck.deck_words[0]?.count ?? 0,
          known: row.known_word_ids.length,
          wait: msUntil(row.next_review_at),
        },
      ];
    })
    // Decks that are due come first.
    .sort((a, b) => a.wait - b.wait);

  // Nothing to show: the card above already points to the deck list.
  if (decks.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-extrabold">Destelerim</h2>
        <Link href="/words" className="text-sm font-semibold text-primary">
          {decks.length}/{MAX_ACTIVE_DECKS} · Tüm desteler
        </Link>
      </div>
      {decks.map((deck) => (
        <Link
          key={deck.id}
          href={`/words/${deck.id}`}
          className="flex flex-col gap-3 rounded-3xl bg-card p-4 ring-1 ring-border transition-colors hover:bg-muted"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 font-bold">
              {deck.title}
              {deck.label && <Badge variant="outline">{deck.label}</Badge>}
            </span>
            <Badge variant={deck.wait <= 0 ? "default" : "secondary"}>
              {deck.wait <= 0 ? "Tekrar zamanı" : formatWait(deck.wait)}
            </Badge>
          </div>
          <Progress value={deck.total ? (deck.known / deck.total) * 100 : 0} />
          <span className="text-xs text-muted-foreground">
            {deck.known}/{deck.total} kelime biliniyor
          </span>
        </Link>
      ))}
    </section>
  );
}
