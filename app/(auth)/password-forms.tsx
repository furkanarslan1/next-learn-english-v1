"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset, updatePassword, type AuthState } from "./actions";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    requestPasswordReset,
    undefined,
  );

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Şifreni sıfırla</CardTitle>
        <CardDescription>
          E-postanı yaz, sana yeni şifre belirleyebileceğin bir bağlantı gönderelim.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">E-posta</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          {state?.error && (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          )}
          {state?.message && <p className="text-sm">{state.message}</p>}
          <Button type="submit" disabled={pending}>
            {pending ? "Gönderiliyor…" : "Bağlantı gönder"}
          </Button>
          <Link
            href="/login"
            className="text-center text-sm text-muted-foreground underline underline-offset-4"
          >
            Girişe dön
          </Link>
        </form>
      </CardContent>
    </Card>
  );
}

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    updatePassword,
    undefined,
  );

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Yeni şifre belirle</CardTitle>
        <CardDescription>En az 8 karakter olsun.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Yeni şifre</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirm">Yeni şifre (tekrar)</Label>
            <Input
              id="confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>
          {state?.error && (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          )}
          <Button type="submit" disabled={pending}>
            {pending ? "Kaydediliyor…" : "Şifreyi kaydet"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
