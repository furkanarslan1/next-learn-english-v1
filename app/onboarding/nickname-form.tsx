"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setNickname, type NicknameState } from "../(auth)/actions";

export function NicknameForm() {
  const [state, action, pending] = useActionState<NicknameState, FormData>(
    setNickname,
    undefined,
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="nickname">Nickname</Label>
        <Input
          id="nickname"
          name="nickname"
          autoComplete="nickname"
          minLength={3}
          maxLength={20}
          pattern="[a-zA-Z0-9_]+"
          required
        />
        <p className="text-xs text-muted-foreground">
          3-20 karakter: harf, rakam ve alt çizgi. Diğer oyuncular bu ismi
          görecek.
        </p>
      </div>
      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Kaydediliyor…" : "Devam et"}
      </Button>
    </form>
  );
}
