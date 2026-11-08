import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { FiArrowLeft } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { parseGrammarContent } from "@/lib/grammar";
import { createClient } from "@/lib/supabase/server";
import { GrammarQuiz } from "./grammar-quiz";

export default function GrammarTestPage({
  params,
}: PageProps<"/grammar/[slug]/test">) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 p-4">
      <Suspense fallback={<p className="text-sm text-muted-foreground">Test hazırlanıyor…</p>}>
        <GrammarTest params={params} />
      </Suspense>
    </main>
  );
}

async function GrammarTest({ params }: { params: Promise<{ slug: string }> }) {
  await connection(); // session + time checks must run at request time
  const { slug } = await params;
  const supabase = await createClient();
  const { data: topic } = await supabase
    .from("grammar_topics")
    .select("id, title, content")
    .eq("slug", slug)
    .maybeSingle();
  if (!topic) notFound();

  const { exercises } = parseGrammarContent(topic.content);
  const backHref = `/grammar/${slug}`;

  return (
    <>
      <header className="flex items-center gap-2">
        <Button variant="ghost" size="icon" nativeButton={false} render={<Link href={backHref} aria-label="Geri" />}>
          <FiArrowLeft />
        </Button>
        <h1 className="text-xl font-semibold">{topic.title} · Test</h1>
      </header>
      {exercises.length === 0 ? (
        <p className="text-sm text-muted-foreground">Bu konu için henüz soru yok.</p>
      ) : (
        <GrammarQuiz topicId={topic.id} exercises={exercises} backHref={backHref} />
      )}
    </>
  );
}
