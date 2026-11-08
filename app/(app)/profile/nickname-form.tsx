"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateNickname, type ProfileState } from "./actions";

export function NicknameForm({ current }: { current: string }) {
  const [state, action, pending] = useActionState<ProfileState, FormData>(
    updateNickname,
    undefined,
  );

  return (
    <form action={action} className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <Label htmlFor="nickname">Nickname</Label>
        <Input
          id="nickname"
          name="nickname"
          defaultValue={current}
          autoComplete="off"
          autoCapitalize="none"
          minLength={3}
          maxLength={20}
          pattern="[a-zA-Z0-9_]+"
          required
        />
      </div>
      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      {state?.message && (
        <p role="status" className="text-sm text-success">
          {state.message}
        </p>
      )}
      <Button type="submit" variant="outline" disabled={pending}>
        {pending ? "Kaydediliyor…" : "Nickname'i kaydet"}
      </Button>
    </form>
  );
}
