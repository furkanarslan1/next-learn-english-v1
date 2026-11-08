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
import { login, signup, type AuthState } from "./actions";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isLogin = mode === "login";
  const [state, action, pending] = useActionState<AuthState, FormData>(
    isLogin ? login : signup,
    undefined,
  );

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{isLogin ? "Tekrar hoş geldin" : "Hesap oluştur"}</CardTitle>
        <CardDescription>
          {isLogin
            ? "Öğrenmeye devam etmek için giriş yap."
            : "Kelime hazneni geliştirmeye başla."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Şifre</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              minLength={isLogin ? undefined : 8}
              required
            />
          </div>

          {state?.error && (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          )}
          {state?.message && <p className="text-sm">{state.message}</p>}

          <Button type="submit" disabled={pending}>
            {pending ? "Lütfen bekle…" : isLogin ? "Giriş yap" : "Kayıt ol"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Hesabın yok mu? " : "Zaten hesabın var mı? "}
            <Link
              href={isLogin ? "/signup" : "/login"}
              className="underline underline-offset-4"
            >
              {isLogin ? "Kayıt ol" : "Giriş yap"}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
