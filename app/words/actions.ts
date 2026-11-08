"use server";

import { redirect } from "next/navigation";
import { MAX_ACTIVE_DECKS, msUntil, scheduleNext } from "@/lib/srs";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function startDeck(deckId: number) {
  const { supabase, user } = await requireUser();

  const [{ count }, { data: profile }] = await Promise.all([
    supabase
      .from("user_decks")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase.from("profiles").select("learned_deck_ids").single(),
  ]);

  const alreadyLearned = profile?.learned_deck_ids.includes(deckId);
  if ((count ?? 0) >= MAX_ACTIVE_DECKS || alreadyLearned) {
    redirect("/words");
  }

  await supabase
    .from("user_decks")
    .upsert(
      { user_id: user.id, deck_id: deckId },
      { onConflict: "user_id,deck_id", ignoreDuplicates: true },
    );

  redirect(`/words/${deckId}`);
}

/** Saves the result of one study session with a single update. */
export async function completeSession(deckId: number, markedKnown: number[]) {
  const { supabase, user } = await requireUser();

  const [{ data: row }, { data: deckWords }] = await Promise.all([
    supabase
      .from("user_decks")
      .select("*")
      .eq("user_id", user.id)
      .eq("deck_id", deckId)
      .maybeSingle(),
    supabase.from("deck_words").select("word_id").eq("deck_id", deckId),
  ]);
  if (!row || !deckWords) redirect("/words");

  const deckWordIds = deckWords.map((w) => w.word_id);
  const known = [
    ...new Set([
      ...row.known_word_ids,
      ...markedKnown.filter((id) => deckWordIds.includes(id)),
    ]),
  ];

  // Every word is known: the deck is learned.
  if (deckWordIds.every((id) => known.includes(id))) {
    await supabase.rpc("learn_deck", { p_deck_id: deckId });
    redirect("/words");
  }

  // The schedule only advances when the review was actually due.
  const isDue = msUntil(row.next_review_at) <= 0;
  await supabase
    .from("user_decks")
    .update(
      isDue
        ? {
            ...scheduleNext(row.stage),
            success_count: row.success_count + 1,
            known_word_ids: known,
          }
        : { known_word_ids: known },
    )
    .eq("user_id", user.id)
    .eq("deck_id", deckId);

  redirect("/words");
}

export async function learnDeck(deckId: number) {
  const { supabase } = await requireUser();
  await supabase.rpc("learn_deck", { p_deck_id: deckId });
  redirect("/words");
}
