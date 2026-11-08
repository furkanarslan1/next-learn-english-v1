"use client";

import { useImperativeHandle, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type SwipeDirection = "left" | "right";
export type SwipeCardHandle = { swipe: (direction: SwipeDirection) => void };

const DISTANCE_THRESHOLD = 100; // px: dragged this far, the card leaves
const FLICK_DISTANCE = 40; // px: a fast flick needs less distance...
const FLICK_SPEED = 0.6; // ...as long as it is at least this fast (px/ms)
const LEAVE_MS = 200;
const RESISTANCE = 0.25; // dragging towards a direction that isn't allowed feels heavy

const now = () => performance.now();

/**
 * A card that follows the finger left or right. Past the threshold (or with a
 * quick flick) it flies off; otherwise it springs back. Buttons can trigger the
 * same animation through the `ref` handle.
 */
export function SwipeCard({
  ref,
  onSwipe,
  canSwipeLeft = true,
  canSwipeRight = true,
  children,
  className,
}: {
  ref?: React.Ref<SwipeCardHandle>;
  onSwipe: (direction: SwipeDirection) => void;
  canSwipeLeft?: boolean;
  canSwipeRight?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [leaving, setLeaving] = useState<SwipeDirection | null>(null);
  const start = useRef<{ x: number; t: number } | null>(null);

  const allowed = (direction: SwipeDirection) =>
    direction === "left" ? canSwipeLeft : canSwipeRight;

  const fly = (direction: SwipeDirection) => {
    if (leaving || !allowed(direction)) return;
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

  return (
    <div
      className={cn(
        "touch-pan-y select-none rounded-3xl bg-card ring-1 ring-border motion-reduce:transition-none",
        dragging ? "cursor-grabbing" : "cursor-grab",
        className,
      )}
      style={{
        transform: `translate3d(${x}px, 0, 0) rotate(${x / 25}deg)`,
        opacity: leaving ? 0 : 1,
        transition: dragging ? "none" : `transform ${LEAVE_MS}ms ease-out, opacity ${LEAVE_MS}ms ease-out`,
      }}
      onPointerDown={(e) => {
        if (leaving) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        start.current = { x: e.clientX, t: now() };
        setDragging(true);
      }}
      onPointerMove={(e) => {
        if (!start.current) return;
        const raw = e.clientX - start.current.x;
        setDx(allowed(raw > 0 ? "right" : "left") ? raw : raw * RESISTANCE);
      }}
      onPointerUp={() => {
        if (!start.current) return;
        const distance = dx;
        const speed = Math.abs(distance) / Math.max(now() - start.current.t, 1);
        start.current = null;
        setDragging(false);
        const direction: SwipeDirection = distance > 0 ? "right" : "left";
        const far = Math.abs(distance) >= DISTANCE_THRESHOLD;
        const flick = Math.abs(distance) >= FLICK_DISTANCE && speed >= FLICK_SPEED;
        if ((far || flick) && allowed(direction)) fly(direction);
        else setDx(0);
      }}
      onPointerCancel={() => {
        start.current = null;
        setDragging(false);
        setDx(0);
      }}
    >
      {children}
    </div>
  );
}
