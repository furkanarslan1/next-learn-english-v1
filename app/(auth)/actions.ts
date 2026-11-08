"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type NicknameState = { error?: string } | undefined;

const NICKNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;

export async function signInWithGoogle() {
  const origin = (await headers()).get("origin");
  if (!origin) redirect("/login?error=missing_origin");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback` },
  });

  if (error || !data.url) redirect("/login?error=oauth_failed");
  redirect(data.url);
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
