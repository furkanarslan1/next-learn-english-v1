import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { FiArrowLeft } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { duelOutcome, formatSeconds, OUTCOME_LABEL } from "@/lib/duel";
import { createClient } from "@/lib/supabase/server";
import { Play } from "./play";

export default function DuelPage({ params }: PageProps<"/duels/[id]">) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 p-4">
      <header className="flex items-center gap-2">
        <Button variant="ghost" size="icon" nativeButton={false} render={<Link href="/duels" aria-label="Geri" />}>
          <FiArrowLeft />
        </Button>
        <h1 className="text-xl font-semibold">Düello</h1>
      </header>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Yükleniyor…</p>}>
        <Duel params={params} />
      </Suspense>
    </main>
  );
}

const UUID = /^[0-9a-f-]{36}$/i;

async function Duel({ params }: { params: Promise<{ id: string }> }) {
  await connection(); // session + time checks must run at request time
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const supabase = await createClient();
  const { data: rows } = await supabase.rpc("my_duels", { p_duel_id: id });
  const duel = rows?.[0];
  if (!duel) notFound();

  const outcome = duelOutcome(duel);

  if (outcome === "my_turn") {
    const { data } = await supabase.from("duels").select("questions").eq("id", id).single();
    const questions = (data?.questions ?? []) as { english: string; options: string[] }[];
    return (
      <div className="flex flex-col gap-4">
        <p className="text-muted-foreground">
          Rakip: <strong>{duel.opponent_nickname}</strong>
        </p>
        <Play duelId={id} questions={questions} />
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <p className="text-muted-foreground">
          Rakip: <strong>{duel.opponent_nickname}</strong>
        </p>
        <h2 className="text-2xl font-bold">{OUTCOME_LABEL[outcome]}</h2>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="rounded-md bg-muted p-3">
            <p className="text-sm text-muted-foreground">Sen</p>
            <p className="text-2xl font-bold">
              {duel.my_score}/{duel.question_count}
            </p>
            <p className="text-xs text-muted-foreground">{formatSeconds(duel.my_time_ms)}</p>
          </div>
          <div className="rounded-md bg-muted p-3">
            <p className="text-sm text-muted-foreground">{duel.opponent_nickname}</p>
            <p className="text-2xl font-bold">
              {outcome === "waiting" ? "?" : `${duel.their_score}/${duel.question_count}`}
            </p>
            <p className="text-xs text-muted-foreground">
              {outcome === "waiting" ? "henüz oynamadı" : formatSeconds(duel.their_time_ms)}
            </p>
          </div>
        </div>
        <Button variant="outline" nativeButton={false} render={<Link href="/duels" />}>
          Düellolarıma dön
        </Button>
      </CardContent>
    </Card>
  );
}
