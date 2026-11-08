import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { FiArrowLeft } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatWait, msUntil } from "@/lib/srs";
import { createClient } from "@/lib/supabase/server";

export default function GrammarPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4">
      <header className="flex items-center gap-2">
        <Button variant="ghost" size="icon" nativeButton={false} render={<Link href="/" aria-label="Geri" />}>
          <FiArrowLeft />
        </Button>
        <h1 className="text-xl font-semibold">Gramer çalış</h1>
      </header>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Konular yükleniyor…</p>}>
        <Topics />
      </Suspense>
    </main>
  );
}

async function Topics() {
  await connection(); // session + time checks must run at request time
  const supabase = await createClient();
  const [{ data: topics }, { data: reviews }] = await Promise.all([
    supabase
      .from("grammar_topics")
      .select("id, slug, title, level, position, content")
      .order("position"),
    supabase.from("user_grammar").select("topic_id, next_review_at"),
  ]);
  const reviewByTopic = new Map((reviews ?? []).map((r) => [r.topic_id, r.next_review_at]));

  if (!topics?.length) {
    return <p className="text-sm text-muted-foreground">Henüz konu yok.</p>;
  }

  const levels = [...new Set(topics.map((t) => t.level))].sort();

  return (
    <Tabs defaultValue={levels[0]}>
      <TabsList>
        {levels.map((l) => (
          <TabsTrigger key={l} value={l}>
            {l}
          </TabsTrigger>
        ))}
      </TabsList>
      {levels.map((l) => (
        <TabsContent key={l} value={l} className="mt-4 grid gap-3">
          {topics
            .filter((t) => t.level === l)
            .map((t) => {
              const summary =
                typeof t.content === "object" && t.content && "summary" in t.content
                  ? String(t.content.summary)
                  : "";
              const nextAt = reviewByTopic.get(t.id);
              const wait = nextAt ? msUntil(nextAt) : null;
              return (
                <Link key={t.slug} href={`/grammar/${t.slug}`}>
                  <Card className="transition-colors hover:bg-muted">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between gap-2">
                        {t.title}
                        {wait !== null && (
                          <Badge variant={wait <= 0 ? "default" : "outline"}>
                            {wait <= 0 ? "Tekrar zamanı" : `Sonraki: ${formatWait(wait)}`}
                          </Badge>
                        )}
                      </CardTitle>
                      {summary && <CardDescription>{summary}</CardDescription>}
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
        </TabsContent>
      ))}
    </Tabs>
  );
}
