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
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "Invalid email or password." };
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
    return { error: "Email and password are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
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
    return { error: error.message };
  }

  // With email confirmation enabled there is no session yet.
  if (!data.session) {
    return { message: "Check your email to confirm your account." };
  }

  // New users pick a nickname next.
  redirect("/onboarding");
}

export async function setNickname(
  _prev: NicknameState,
  formData: FormData,
): Promise<NicknameState> {
  const nickname = String(formData.get("nickname") ?? "").trim();

  if (!NICKNAME_PATTERN.test(nickname)) {
    return {
      error: "Use 3-20 characters: letters, numbers and underscores only.",
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
          ? "This nickname is already taken."
          : "Could not save your nickname. Please try again.",
    };
  }

  redirect("/");
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
