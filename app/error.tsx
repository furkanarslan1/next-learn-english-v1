"use client";

import { useEffect } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { Button } from "@/components/ui/button";

// Shown when something unexpected breaks while a page is rendering.
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <span className="flex size-16 items-center justify-center rounded-3xl bg-destructive/10">
        <FiAlertTriangle className="size-8 text-destructive" aria-hidden />
      </span>
      <h1 className="text-2xl font-extrabold tracking-tight">Bir şeyler ters gitti</h1>
      <p className="max-w-xs text-muted-foreground">
        Beklenmedik bir hata oluştu. Tekrar denersen genelde düzelir.
      </p>
      <Button onClick={() => retry()}>Tekrar dene</Button>
    </main>
  );
}
