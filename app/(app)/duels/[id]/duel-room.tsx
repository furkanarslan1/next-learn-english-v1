"use client";

import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LIVE_FLAG } from "@/lib/duel";
import { createClient } from "@/lib/supabase/client";
import { Play } from "./play";

type Question = { english: string; options: string[] };
type Phase = "choose" | "waiting" | "playing";
type PresenceMeta = { ready?: boolean };

// Cost control: a realtime connection is only opened when the player chooses
// live mode, only carries small Broadcast/Presence messages, and is closed on
// timeout, on finish and on leaving the page.
const LOBBY_TIMEOUT_MS = 2 * 60 * 1000;

export function DuelRoom({
  duelId,
  userId,
  opponentNickname,
  questions,
}: {
  duelId: string;
  userId: string;
  opponentNickname: string;
  questions: Question[];
}) {
  const [phase, setPhase] = useState<Phase>("choose");
  const [notice, setNotice] = useState<string | null>(null);
  const [opponentOnline, setOpponentOnline] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  const [iAmReady, setIAmReady] = useState(false);
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [opponentLeft, setOpponentLeft] = useState(false);
  const [live, setLive] = useState(false);

  const supabaseRef = useRef<SupabaseClient | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const wasOnline = useRef(false);

  const disconnect = useCallback(() => {
    const channel = channelRef.current;
    channelRef.current = null;
    if (channel) supabaseRef.current?.removeChannel(channel);
  }, []);

  // Always close the connection when leaving the page.
  useEffect(() => disconnect, [disconnect]);

  // Give up waiting for the opponent after 2 minutes.
  useEffect(() => {
    if (phase !== "waiting") return;
    const t = setTimeout(() => {
      disconnect();
      setPhase("choose");
      setIAmReady(false);
      setOpponentOnline(false);
      setOpponentReady(false);
      setNotice("Rakip gelmedi, canlı bağlantı kapatıldı. Tek başına oynayabilirsin.");
    }, LOBBY_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [phase, disconnect]);

  const goLive = () => {
    setNotice(null);
    supabaseRef.current ??= createClient();
    const supabase = supabaseRef.current;

    const channel = supabase.channel(`duel:${duelId}`, {
      config: { presence: { key: userId } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const others = Object.entries(
          channel.presenceState<PresenceMeta>(),
        ).filter(([key]) => key !== userId);
        const online = others.length > 0;
        setOpponentOnline(online);
        setOpponentReady(others.some(([, metas]) => metas.some((m) => m.ready)));
        if (online) wasOnline.current = true;
        else if (wasOnline.current) setOpponentLeft(true);
      })
      .on("broadcast", { event: "progress" }, ({ payload }) => {
        // Messages can arrive out of order: progress never goes backwards.
        setOpponentProgress((p) => Math.max(p, Number(payload.count) || 0));
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          channel.track({ ready: false });
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          disconnect();
          setPhase("choose");
          setNotice("Canlı mod şu an kullanılamıyor. Tek başına oynayabilirsin.");
        }
      });

    channelRef.current = channel;
    setLive(true);
    setPhase("waiting");
    try {
      sessionStorage.setItem(LIVE_FLAG(duelId), "1");
    } catch {
      // storage can be unavailable; live result refresh just falls back to the button
    }
  };

  const markReady = () => {
    setIAmReady(true);
    channelRef.current?.track({ ready: true });
  };

  const sendProgress = (answered: number) => {
    channelRef.current?.send({
      type: "broadcast",
      event: "progress",
      payload: { count: answered },
    });
  };

  const finished = () => {
    // Tell the opponent only after the score is saved, then free the connection.
    const channel = channelRef.current;
    channel?.send({ type: "broadcast", event: "done", payload: {} });
    setTimeout(disconnect, 500);
  };

  if (phase === "playing") {
    return (
      <div className="flex flex-col gap-4">
        {live && (
          <p className="rounded-xl bg-muted p-3 text-sm">
            {opponentLeft ? (
              <>{opponentNickname} ayrıldı. Sen devam edebilirsin.</>
            ) : (
              <>
                {opponentNickname}: <strong>{opponentProgress}</strong>/{questions.length} soru
              </>
            )}
          </p>
        )}
        <Play
          duelId={duelId}
          questions={questions}
          autoStart={live}
          onAnswer={live ? sendProgress : undefined}
          onFinished={live ? finished : undefined}
        />
      </div>
    );
  }

  if (phase === "waiting") {
    const bothReady = iAmReady && opponentReady;
    return (
      <Card>
        <CardContent className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Canlı düello</h2>
          {bothReady ? (
            <Countdown onDone={() => setPhase("playing")} />
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                {opponentOnline
                  ? `${opponentNickname} burada. Hazır olunca başlayın.`
                  : `${opponentNickname} canlı moda girince başlayabilirsiniz. 2 dakika içinde gelmezse bağlantı kapanır.`}
              </p>
              <Button onClick={markReady} disabled={!opponentOnline || iAmReady}>
                {iAmReady ? "Rakip bekleniyor…" : "Hazırım"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  disconnect();
                  setPhase("choose");
                  setIAmReady(false);
                  setOpponentOnline(false);
                  setOpponentReady(false);
                  setLive(false);
                }}
              >
                Vazgeç
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {notice && (
        <p role="status" className="rounded-xl bg-muted p-3 text-sm">
          {notice}
        </p>
      )}
      <Card>
        <CardContent className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Nasıl oynamak istersin?</h2>
          <Button
            onClick={() => {
              setLive(false);
              setPhase("playing");
            }}
          >
            Tek başına oyna
          </Button>
          <p className="text-sm text-muted-foreground">
            Sorular sende, istediğin zaman çözersin. Rakip de kendi zamanında çözer.
          </p>
          <Button variant="outline" onClick={goLive}>
            Canlı oyna
          </Button>
          <p className="text-sm text-muted-foreground">
            Rakibinle aynı anda başlarsınız ve birbirinizin kaçıncı soruda olduğunu
            görürsünüz. İkiniz de &quot;Canlı oyna&quot;ya basmalısınız.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function Countdown({ onDone }: { onDone: () => void }) {
  const [left, setLeft] = useState(3);
  const onDoneRef = useRef(onDone);
  const remaining = useRef(3);

  useEffect(() => {
    onDoneRef.current = onDone;
  });

  // Runs once: parent re-renders (presence updates) must not restart the countdown.
  useEffect(() => {
    const t = setInterval(() => {
      remaining.current -= 1;
      setLeft(remaining.current);
      if (remaining.current <= 0) {
        clearInterval(t);
        onDoneRef.current();
      }
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <p className="text-center text-6xl font-extrabold text-primary" aria-live="assertive">
      {left > 0 ? left : "Başla!"}
    </p>
  );
}
