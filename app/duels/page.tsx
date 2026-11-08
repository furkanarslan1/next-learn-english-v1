import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { FiArrowLeft } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { duelOutcome, OUTCOME_LABEL } from "@/lib/duel";
import { createClient } from "@/lib/supabase/server";
import { NewDuelForm } from "./new-duel-form";

export default function DuelsPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4">
      <header className="flex items-center gap-2">
        <Button variant="ghost" size="icon" nativeButton={false} render={<Link href="/" aria-label="Geri" />}>
          <FiArrowLeft />
        </Button>
        <h1 className="text-xl font-semibold">Düello</h1>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Yeni düello</CardTitle>
          <CardDescription>
            Aynı 10 soruyu ikiniz de kendi zamanınızda çözersiniz. Çok doğru yapan
            kazanır, eşitlikte hızlı olan kazanır.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewDuelForm />
        </CardContent>
      </Card>

      <Suspense fallback={<p className="text-sm text-muted-foreground">Düellolar yükleniyor…</p>}>
        <DuelList />
      </Suspense>
    </main>
  );
}

async function DuelList() {
  await connection(); // session + time checks must run at request time
  const supabase = await createClient();
  const { data: duels } = await supabase.rpc("my_duels");

  if (!duels?.length) {
    return <p className="text-sm text-muted-foreground">Henüz düellon yok.</p>;
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-medium">Düellolarım</h2>
      {duels.map((d) => {
        const outcome = duelOutcome(d);
        return (
          <Link key={d.id} href={`/duels/${d.id}`}>
            <Card className="transition-colors hover:bg-muted">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>{d.opponent_nickname}</CardTitle>
                <Badge
                  variant={
                    outcome === "my_turn" ? "default" : outcome === "won" ? "secondary" : "outline"
                  }
                >
                  {OUTCOME_LABEL[outcome]}
                </Badge>
              </CardHeader>
            </Card>
          </Link>
        );
      })}
    </section>
  );
}
