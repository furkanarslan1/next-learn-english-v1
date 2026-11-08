import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestChooserPage({
  params,
}: PageProps<"/words/[deckId]/test">) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 p-4">
      <Suspense>
        <Chooser params={params} />
      </Suspense>
    </main>
  );
}

async function Chooser({ params }: { params: Promise<{ deckId: string }> }) {
  const deckId = Number((await params).deckId);
  if (!Number.isInteger(deckId)) notFound();

  return (
    <>
      <header className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          nativeButton={false}
          render={<Link href={`/words/${deckId}`} aria-label="Geri" />}
        >
          <FiArrowLeft />
        </Button>
        <h1 className="text-xl font-semibold">Test seç</h1>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Bu desteyi test et</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button nativeButton={false} render={<Link href={`/words/${deckId}/test/fill`} />}>
            Boşluk doldurma
          </Button>
          <Button variant="outline" nativeButton={false} render={<Link href={`/words/${deckId}/test/tf`} />}>
            Doğru / Yanlış
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
