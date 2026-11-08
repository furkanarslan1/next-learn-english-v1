import { FiWifiOff } from "react-icons/fi";

export const metadata = { title: "Çevrimdışı" };

export default function OfflinePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <span className="flex size-16 items-center justify-center rounded-3xl bg-muted">
        <FiWifiOff className="size-8 text-muted-foreground" aria-hidden />
      </span>
      <h1 className="text-2xl font-extrabold tracking-tight">İnternet bağlantısı yok</h1>
      <p className="max-w-xs text-muted-foreground">
        Kelimeler ve ilerlemen internetten geliyor. Bağlantın gelince sayfayı yenile.
      </p>
    </main>
  );
}
