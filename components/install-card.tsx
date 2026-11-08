"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { FiDownload, FiShare } from "react-icons/fi";
import { Button } from "@/components/ui/button";

// Chrome's install event; not part of the standard DOM typings.
type InstallEvent = Event & { prompt: () => Promise<void> };

/**
 * "Add to home screen". Android / desktop Chrome get a button, iPhones get the
 * manual steps (Safari has no install prompt). Hidden once the app is installed.
 */
type Platform = "ios" | "other" | "installed";

const noSubscribe = () => () => {};

function readPlatform(): Platform {
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  if (standalone) return "installed";
  return /iphone|ipad|ipod/i.test(navigator.userAgent) ? "ios" : "other";
}

export function InstallCard() {
  const [installEvent, setInstallEvent] = useState<InstallEvent | null>(null);
  // null while rendering on the server, so nothing flashes before the browser is known
  const platform = useSyncExternalStore<Platform | null>(noSubscribe, readPlatform, () => null);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as InstallEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (platform === null || platform === "installed") return null;
  if (platform === "other" && !installEvent) return null;

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-primary/10 p-4">
      <p className="font-bold">Ana ekrana ekle</p>
      {platform === "ios" ? (
        <p className="text-sm text-muted-foreground">
          Safari&apos;de <FiShare className="inline size-4 align-text-bottom" aria-label="Paylaş" />{" "}
          simgesine dokun, sonra &quot;Ana Ekrana Ekle&quot;yi seç. Uygulama gibi tam ekran açılır.
        </p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Uygulamayı telefonuna yükle, tam ekran ve tek dokunuşla aç.
          </p>
          <Button
            onClick={async () => {
              await installEvent?.prompt();
              setInstallEvent(null);
            }}
          >
            <FiDownload /> Yükle
          </Button>
        </>
      )}
    </div>
  );
}
