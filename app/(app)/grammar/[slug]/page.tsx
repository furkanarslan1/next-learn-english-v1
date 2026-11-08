import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { FiArrowLeft } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { parseGrammarContent } from "@/lib/grammar";
import { formatWait, msUntil } from "@/lib/srs";
import { createClient } from "@/lib/supabase/server";

// Only these three labels read naturally with "cümle" appended.
const STANDARD_LABELS = ["Olumlu", "Olumsuz", "Soru"];

export default function GrammarTopicPage({
  params,
}: PageProps<"/grammar/[slug]">) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4">
      <header className="flex items-center gap-2">
        <Button variant="ghost" size="icon" nativeButton={false} render={<Link href="/grammar" aria-label="Geri" />}>
          <FiArrowLeft />
        </Button>
      </header>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Konu yükleniyor…</p>}>
        <Topic params={params} />
      </Suspense>
    </main>
  );
}

async function Topic({ params }: { params: Promise<{ slug: string }> }) {
  await connection(); // session + time checks must run at request time
  const { slug } = await params;
  const supabase = await createClient();
  const { data: topic } = await supabase
    .from("grammar_topics")
    .select("id, title, level, content")
    .eq("slug", slug)
    .maybeSingle();
  if (!topic) notFound();

  const { data: review } = await supabase
    .from("user_grammar")
    .select("next_review_at")
    .eq("topic_id", topic.id)
    .maybeSingle();
  const wait = review ? msUntil(review.next_review_at) : null;

  const c = parseGrammarContent(topic.content);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">{topic.title}</h1>
        <Badge variant="outline">{topic.level}</Badge>
      </div>
      {c.summary && <p className="text-muted-foreground">{c.summary}</p>}

      {c.exercises.length > 0 && (
        <Card className="bg-primary/10 ring-0">
          <CardContent className="flex flex-col gap-3">
            <p className="font-semibold">
              {wait === null
                ? "Konuyu okudun mu? Kendini test et, tekrar takvimine eklenir."
                : wait <= 0
                  ? "Bu konunun tekrar zamanı geldi."
                  : `Sıradaki tekrar ${formatWait(wait)}.`}
            </p>
            <Button nativeButton={false} render={<Link href={`/grammar/${slug}/test`} />}>
              {wait === null ? "Testi çöz" : "Tekrar testi çöz"}
            </Button>
          </CardContent>
        </Card>
      )}

      {c.rules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Kurallar</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            {c.rules.map((r) => (
              <div key={r.title}>
                <p className="font-medium">{r.title}</p>
                <p className="text-muted-foreground">{r.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {c.forms.map((f) => (
        <Card key={f.label}>
          <CardHeader>
            <CardTitle>{STANDARD_LABELS.includes(f.label) ? `${f.label} cümle` : f.label}</CardTitle>
            <code className="w-fit rounded bg-muted px-2 py-1 text-sm">{f.formula}</code>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {f.examples.map((ex) => (
              <div key={ex.en} className="text-sm">
                <p className="font-medium">{ex.en}</p>
                <p className="text-muted-foreground">{ex.tr}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {c.signals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>İşaret kelimeler</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {c.signals.map((s) => (
              <Badge key={s} variant="secondary">
                {s}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}

      {c.notes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Notlar</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex list-disc flex-col gap-2 pl-5 text-sm text-muted-foreground">
              {c.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
