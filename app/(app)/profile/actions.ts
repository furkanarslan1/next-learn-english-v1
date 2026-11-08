"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ProfileState = { error?: string; message?: string } | undefined;

const NICKNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;

export async function updateNickname(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const nickname = String(formData.get("nickname") ?? "").trim();
  if (!NICKNAME_PATTERN.test(nickname)) {
    return { error: "Nickname 3-20 karakter olmalı: yalnızca harf, rakam ve alt çizgi." };
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
  return { message: "Nickname güncellendi." };
}

/** Permanently deletes the account and all of its data. */
export async function deleteAccount() {
  const supabase = await createClient();
  const { error } = await supabase.rpc("delete_my_account");
  if (error) redirect("/profile?error=delete_failed");

  await supabase.auth.signOut();
  redirect("/login?deleted=1");
}
