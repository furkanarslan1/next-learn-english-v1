"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiBookOpen, FiEdit3, FiHome, FiZap } from "react-icons/fi";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/", label: "Ana sayfa", icon: FiHome, match: (p: string) => p === "/" },
  {
    href: "/words",
    label: "Kelime",
    icon: FiBookOpen,
    match: (p: string) => p.startsWith("/words") || p.startsWith("/practice"),
  },
  { href: "/grammar", label: "Gramer", icon: FiEdit3, match: (p: string) => p.startsWith("/grammar") },
  { href: "/duels", label: "Düello", icon: FiZap, match: (p: string) => p.startsWith("/duels") },
];

/** Floating bottom dock. Same layout on phones and desktop. */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Ana gezinme"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-center justify-between rounded-full bg-card p-1.5 shadow-lg ring-1 ring-border"
    >
      {ITEMS.map(({ href, label, icon: Icon, match }) => {
        const active = match(pathname);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-5 shrink-0" aria-hidden />
            {active && <span>{label}</span>}
            {!active && <span className="sr-only">{label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
