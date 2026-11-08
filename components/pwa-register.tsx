"use client";

import { useEffect } from "react";

/** Registers the service worker (production only). */
export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => {
      // The app works without it; the offline page is just a bonus.
    });
  }, []);

  return null;
}
