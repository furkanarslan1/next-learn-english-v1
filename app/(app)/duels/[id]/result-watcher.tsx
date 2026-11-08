"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LIVE_FLAG } from "@/lib/duel";
import { createClient } from "@/lib/supabase/client";

const MAX_WAIT_MS = 3 * 60 * 1000;

/**
 * Shown while waiting for the opponent. If this duel was played live, it listens
 * briefly for the opponent's "done" message and refreshes. Otherwise (or after
 * 3 minutes) it costs nothing and the player uses the refresh button.
 */
export function ResultWatcher({ duelId }: { duelId: string }) {
  const router = useRouter();

  useEffect(() => {
    let wasLive = false;
    try {
      wasLive = sessionStorage.getItem(LIVE_FLAG(duelId)) === "1";
    } catch {
      return;
    }
    if (!wasLive) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`duel:${duelId}`)
      .on("broadcast", { event: "done" }, () => {
        try {
          sessionStorage.removeItem(LIVE_FLAG(duelId));
        } catch {
          // ignore
        }
        router.refresh();
      })
      .subscribe();
    const timeout = setTimeout(() => supabase.removeChannel(channel), MAX_WAIT_MS);

    return () => {
      clearTimeout(timeout);
      supabase.removeChannel(channel);
    };
  }, [duelId, router]);

  return (
    <Button variant="outline" onClick={() => router.refresh()}>
      Sonucu yenile
    </Button>
  );
}
