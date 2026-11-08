"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type DuelState = { error?: string } | undefined;

const ERRORS: Record<string, string> = {
  opponent_not_found: "Bu nickname ile bir oyuncu bulunamadı.",
  cannot_duel_self: "Kendine meydan okuyamazsın.",
  not_enough_words: "Düello için yeterli kelime yok.",
};

export async function createDuel(
  _prev: DuelState,
  formData: FormData,
): Promise<DuelState> {
  const nickname = String(formData.get("nickname") ?? "").trim();
  if (!nickname) return { error: "Rakibin nickname'ini yaz." };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_duel", {
    p_opponent_nickname: nickname,
  });

  if (error || !data) {
    return {
      error: ERRORS[error?.message ?? ""] ?? "Düello oluşturulamadı. Lütfen tekrar dene.",
    };
  }

  redirect(`/duels/${data}`);
}

export async function submitDuel(
  duelId: string,
  answers: number[],
  timeMs: number,
) {
  const supabase = await createClient();
  await supabase.rpc("submit_duel", {
    p_duel_id: duelId,
    p_answers: answers,
    p_time_ms: Math.round(timeMs),
  });
  redirect(`/duels/${duelId}`);
}
