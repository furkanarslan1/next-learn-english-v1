import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { FiBookOpen, FiEdit3, FiLogOut, FiZap } from "react-icons/fi";
import { signout } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { formatWait, msUntil } from "@/lib/srs";
import { createClient } from "@/lib/supabase/server";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 p-4 pt-6">
      <header className="flex items-center justify-between gap-2">
        <Suspense fallback={<h1 className="text-2xl font-extrabold">Merhaba</h1>}>
          <Greeting />
        </Suspense>
        <form action={signout}>
          <Button variant="ghost" size="icon" type="submit" aria-label="Çıkış yap">
            <FiLogOut />
          </Button>
        </form>
      </header>

      <Suspense fallback={<div className="h-44 animate-pulse rounded-3xl bg-muted" />}>
        <TodayCard />
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

/** What to do next: due reviews, or a way to get started. */
async function TodayCard() {
  await connection();
  const supabase = await createClient();
  const { data: decks } = await supabase.from("user_decks").select("next_review_at");

  const waits = (decks ?? []).map((d) => msUntil(d.next_review_at));
  const due = waits.filter((w) => w <= 0).length;
  const nextWait = waits.length > 0 ? Math.min(...waits) : 0;

  const content =
    waits.length === 0
      ? { title: "Bir deste seç ve başla", action: "Desteleri gör", href: "/words" }
      : due > 0
        ? { title: `${due} deste tekrar bekliyor`, action: "Tekrara başla", href: "/words" }
        : {
            title: `Bugünlük tekrarların bitti. Sıradaki tekrar ${formatWait(nextWait)}.`,
            action: "Genel pratik yap",
            href: "/practice",
          };

  return (
    <section className="flex flex-col items-start gap-5 rounded-3xl bg-primary p-6 text-primary-foreground">
      <h2 className="text-2xl font-extrabold leading-tight tracking-tight">
        {content.title}
      </h2>
      <Button
        size="lg"
        className="bg-card text-foreground hover:bg-card/90"
        nativeButton={false}
        render={<Link href={content.href} />}
      >
        {content.action}
      </Button>
    </section>
  );
}
