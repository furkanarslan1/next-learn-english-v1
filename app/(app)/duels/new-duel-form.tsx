"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createDuel, type DuelState } from "./actions";

export function NewDuelForm() {
  const [state, action, pending] = useActionState<DuelState, FormData>(
    createDuel,
    undefined,
  );

  return (
    <form action={action} className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <Label htmlFor="nickname">Rakibin nickname&apos;i</Label>
        <Input
          id="nickname"
          name="nickname"
          autoComplete="off"
          autoCapitalize="none"
          required
        />
      </div>
      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Hazırlanıyor…" : "Meydan oku"}
      </Button>
    </form>
  );
}
