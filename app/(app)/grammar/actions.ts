"use server";

import { redirect } from "next/navigation";
import {
  formatWait,
  msUntil,
  PASS_RATIO,
  scheduleNext,
  scheduleRetry,
} from "@/lib/srs";
import { createClient } from "@/lib/supabase/server";

/**
 * Saves the result of a grammar test. The review schedule only moves when the
 * topic is due (or has never been studied), so extra practice can't skip ahead.
 */
export async function completeGrammarTest(
  topicId: number,
  correct: number,
  total: number,
): Promise<{ message: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  if (!(total > 0) || correct < 0 || correct > total) {
    return { message: "Sonuç kaydedilemedi." };
  }

  await supabase.rpc("touch_streak");

  const { data: row } = await supabase
    .from("user_grammar")
    .select("*")
    .eq("user_id", user.id)
    .eq("topic_id", topicId)
    .maybeSingle();

  if (row && msUntil(row.next_review_at) > 0) {
    return {
      message: `Bu konunun tekrar zamanı henüz gelmedi (${formatWait(msUntil(row.next_review_at))}). Takvim değişmedi.`,
    };
  }

  const passed = correct / total >= PASS_RATIO;
  const stage = row?.stage ?? 0;
  const next = passed ? scheduleNext(stage) : scheduleRetry(stage);

  const { error } = await supabase.from("user_grammar").upsert({
    user_id: user.id,
    topic_id: topicId,
    stage: next.stage,
    next_review_at: next.next_review_at,
    success_count: (row?.success_count ?? 0) + (passed ? 1 : 0),
  });
  if (error) return { message: "Sonuç kaydedilemedi." };

  const when = formatWait(msUntil(next.next_review_at));
  return {
    message: passed
      ? `Tebrikler! Bu konuyu ${when} tekrar edeceksin.`
      : `Biraz daha çalışman gerek. Bu konu ${when} tekrar karşına çıkacak.`,
  };
}
