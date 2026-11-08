"use client";

import { useImperativeHandle, useRef, useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { cn } from "@/lib/utils";

export type SwipeDirection = "left" | "right";
export type SwipeCardHandle = { swipe: (direction: SwipeDirection) => void };

const DISTANCE_THRESHOLD = 110; // px: dragged this far, the card leaves
const FLICK_DISTANCE = 40; // px: a fast flick needs less distance...
const FLICK_SPEED = 0.6; // ...as long as it is at least this fast (px/ms)
const LEAVE_MS = 200;

const now = () => performance.now();

/**
 * A card that follows the finger. Drag right = "I know it", drag left = "not yet".
 * Past the threshold (or with a quick flick) it flies off; otherwise it springs back.
 * Buttons can trigger the same animation through the `ref` handle.
 */
export function SwipeCard({
  ref,
  onSwipe,
  children,
  className,
}: {
  ref?: React.Ref<SwipeCardHandle>;
  onSwipe: (direction: SwipeDirection) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [leaving, setLeaving] = useState<SwipeDirection | null>(null);
  const start = useRef<{ x: number; t: number } | null>(null);

  const fly = (direction: SwipeDirection) => {
    if (leaving) return;
    setLeaving(direction);
    setDragging(false);
    try {
      navigator.vibrate?.(10); // small tap on phones that support it
    } catch {
      // not supported
    }
    setTimeout(() => onSwipe(direction), LEAVE_MS);
  };

  useImperativeHandle(ref, () => ({ swipe: fly }));

  const x = leaving ? (leaving === "right" ? 700 : -700) : dx;
  const strength = Math.min(Math.abs(x) / DISTANCE_THRESHOLD, 1);

  return (
    <div
      className={cn(
        "relative touch-pan-y select-none rounded-3xl bg-card ring-1 ring-border motion-reduce:transition-none",
        dragging ? "cursor-grabbing" : "cursor-grab transition-transform duration-200 ease-out",
        className,
      )}
      style={{
        transform: `translate3d(${x}px, 0, 0) rotate(${x / 22}deg)`,
        opacity: leaving ? 0 : 1,
        transitionProperty: dragging ? "none" : "transform, opacity",
      }}
      onPointerDown={(e) => {
        if (leaving) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        start.current = { x: e.clientX, t: now() };
        setDragging(true);
      }}
      onPointerMove={(e) => {
        if (!start.current) return;
        setDx(e.clientX - start.current.x);
      }}
      onPointerUp={() => {
        if (!start.current) return;
        const distance = dx;
        const speed = Math.abs(distance) / Math.max(now() - start.current.t, 1);
        start.current = null;
        setDragging(false);
        const far = Math.abs(distance) >= DISTANCE_THRESHOLD;
        const flick = Math.abs(distance) >= FLICK_DISTANCE && speed >= FLICK_SPEED;
        if (far || flick) fly(distance > 0 ? "right" : "left");
        else setDx(0);
      }}
      onPointerCancel={() => {
        start.current = null;
        setDragging(false);
        setDx(0);
      }}
    >
      {children}

      {/* Colour hint that grows while dragging. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 rounded-3xl",
          x > 0 ? "bg-success/15" : "bg-amber/20",
        )}
        style={{ opacity: strength }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-4 top-4 flex -rotate-6 items-center gap-1.5 rounded-full bg-success px-3 py-1.5 text-sm font-extrabold text-white"
        style={{ opacity: x > 0 ? strength : 0 }}
      >
        <FiCheck /> Biliyorum
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 top-4 flex rotate-6 items-center gap-1.5 rounded-full bg-amber px-3 py-1.5 text-sm font-extrabold text-amber-foreground"
        style={{ opacity: x < 0 ? strength : 0 }}
      >
        Henüz değil <FiX />
      </span>
    </div>
  );
}
