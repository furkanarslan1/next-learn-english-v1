import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { FaFire } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { signout } from "@/app/(auth)/actions";
import { InstallCard } from "@/components/install-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { duelOutcome } from "@/lib/duel";
import { MAX_ACTIVE_DECKS } from "@/lib/srs";
import { streakStatus, todayInTurkey } from "@/lib/streak";
import { createClient } from "@/lib/supabase/server";
import { DeleteAccount } from "./delete-account";
import { NicknameForm } from "./nickname-form";

export default function ProfilePage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 p-4 pt-6">
      <Suspense fallback={<div className="h-40 animate-pulse rounded-3xl bg-muted" />}>
        <Profile />
      </Suspense>
    </main>
  );
}

async function Profile() {
  await connection(); // session + time checks must run at request time
  const supabase = await createClient();

  const [{ data: profile }, { data: decks }, { data: grammar }, { data: duels }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select(
          "username, streak_count, streak_best, streak_last_date, learned_word_ids, learned_deck_ids",
        )
        .maybeSingle(),
      supabase.from("user_decks").select("known_word_ids"),
      supabase.from("user_grammar").select("success_count"),
      supabase.rpc("my_duels"),
    ]);

  if (!profile?.username) redirect("/onboarding");

  // Words the user knows: learned decks plus words marked "I know this" in active decks.
  const knownWords = new Set([
    ...profile.learned_word_ids,
    ...(decks ?? []).flatMap((d) => d.known_word_ids),
  ]);
  const { count: streak } = streakStatus(
    profile.streak_count,
    profile.streak_last_date,
    todayInTurkey(),
  );
  const outcomes = (duels ?? []).map(duelOutcome);
  const wins = outcomes.filter((o) => o === "won").length;
  const losses = outcomes.filter((o) => o === "lost").length;
  const draws = outcomes.filter((o) => o === "draw").length;
  const topicsPassed = (grammar ?? []).filter((g) => g.success_count > 0).length;

  const stats = [
    { label: "Bildiğin kelime", value: knownWords.size },
    { label: "Tamamlanan deste", value: profile.learned_deck_ids.length },
    { label: "Aktif deste", value: `${decks?.length ?? 0}/${MAX_ACTIVE_DECKS}` },
    { label: "Geçtiğin gramer testi", value: topicsPassed },
    { label: "Düello (G-M-B)", value: `${wins}-${losses}-${draws}` },
    { label: "En uzun seri", value: `${profile.streak_best} gün` },
  ];

  return (
    <>
      <header className="flex items-center gap-4">
        <span className="flex size-16 items-center justify-center rounded-3xl bg-primary text-3xl font-extrabold text-primary-foreground">
          {profile.username.charAt(0).toUpperCase()}
        </span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">{profile.username}</h1>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <FaFire className="text-amber" aria-hidden /> {streak} günlük seri
          </p>
        </div>
      </header>

      <section aria-label="İstatistikler" className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-1 rounded-2xl bg-card p-4 ring-1 ring-border">
            <span className="text-2xl font-extrabold">{s.value}</span>
            <span className="text-sm text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </section>

      <InstallCard />

      <Card>
        <CardHeader>
          <CardTitle>Nickname</CardTitle>
        </CardHeader>
        <CardContent>
          <NicknameForm current={profile.username} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hesap</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <form action={signout}>
            <Button type="submit" variant="outline" className="w-full">
              <FiLogOut /> Çıkış yap
            </Button>
          </form>
          <DeleteAccount />
        </CardContent>
      </Card>
    </>
  );
}
