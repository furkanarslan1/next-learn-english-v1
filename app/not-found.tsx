import Link from "next/link";
import { FiCompass } from "react-icons/fi";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <span className="flex size-16 items-center justify-center rounded-3xl bg-muted">
        <FiCompass className="size-8 text-muted-foreground" aria-hidden />
      </span>
      <h1 className="text-2xl font-extrabold tracking-tight">Sayfa bulunamadı</h1>
      <p className="max-w-xs text-muted-foreground">
        Aradığın sayfa yok ya da taşınmış olabilir.
      </p>
      <Button nativeButton={false} render={<Link href="/" />}>
        Ana sayfaya dön
      </Button>
    </main>
  );
}
