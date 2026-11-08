import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PracticePage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 p-4">
      <header className="flex items-center gap-2">
        <Button variant="ghost" size="icon" nativeButton={false} render={<Link href="/words" aria-label="Geri" />}>
          <FiArrowLeft />
        </Button>
        <h1 className="text-xl font-semibold">Genel pratik</h1>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Öğrendiğin kelimelerden test</CardTitle>
          <CardDescription>
            &quot;Biliyorum&quot; dediğin ve öğrendiğin desteler arasından rastgele 10 kelime
            sorulur. Hiçbir şey kaydedilmez.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button nativeButton={false} render={<Link href="/practice/fill" />}>
            Boşluk doldurma
          </Button>
          <Button variant="outline" nativeButton={false} render={<Link href="/practice/tf" />}>
            Doğru / Yanlış
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
