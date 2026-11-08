"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string } | undefined;
export type NicknameState = { error?: string } | undefined;

const NICKNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;

export async function login(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "E-posta ve şifre gerekli." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "E-posta veya şifre hatalı." };
  }

  redirect("/");
}

export async function signup(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "E-posta ve şifre gerekli." };
  }
  if (password.length < 8) {
    return { error: "Şifre en az 8 karakter olmalı." };
  }

  const origin = (await headers()).get("origin");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: origin ? `${origin}/auth/callback` : undefined,
    },
  });

  if (error) {
    return {
      error:
        error.code === "user_already_exists"
          ? "Bu e-posta ile zaten bir hesap var."
          : error.code === "weak_password"
            ? "Şifre çok zayıf. Daha güçlü bir şifre seç."
            : "Kayıt olunamadı. Lütfen tekrar dene.",
    };
  }

  // With email confirmation enabled there is no session yet.
  if (!data.session) {
    return { message: "Hesabını onaylamak için e-postanı kontrol et." };
  }

  // New users pick a nickname next.
  redirect("/onboarding");
}

export async function requestPasswordReset(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "E-posta gerekli." };

  const origin = (await headers()).get("origin");
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: origin ? `${origin}/auth/callback?next=/reset-password` : undefined,
  });

  // Same answer whether or not the address has an account, so nobody can probe for accounts.
  return {
    message: "Bu e-posta ile bir hesap varsa, şifre sıfırlama bağlantısı gönderdik. Gelen kutunu kontrol et.",
  };
}

export async function updatePassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 8) return { error: "Şifre en az 8 karakter olmalı." };
  if (password !== confirm) return { error: "Şifreler aynı değil." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?error=reset_failed");

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return {
      error:
        error.code === "same_password"
          ? "Yeni şifre eskisiyle aynı olamaz."
          : error.code === "weak_password"
            ? "Şifre çok zayıf. Daha güçlü bir şifre seç."
            : "Şifre güncellenemedi. Lütfen tekrar dene.",
    };
  }

  redirect("/");
}

export async function setNickname(
  _prev: NicknameState,
  formData: FormData,
): Promise<NicknameState> {
  const nickname = String(formData.get("nickname") ?? "").trim();

  if (!NICKNAME_PATTERN.test(nickname)) {
    return {
      error: "Nickname 3-20 karakter olmalı: yalnızca harf, rakam ve alt çizgi.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("profiles")
    .update({ username: nickname })
    .eq("id", user.id);

  if (error) {
    // 23505 = unique violation
    return {
      error:
        error.code === "23505"
          ? "Bu nickname zaten alınmış."
          : "Nickname kaydedilemedi. Lütfen tekrar dene.",
    };
  }

  redirect("/");
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
