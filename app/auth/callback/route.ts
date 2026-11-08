import { NextResponse, type NextRequest } from "next/server";
import { safeNextPath } from "@/lib/safe-redirect";
import { createClient } from "@/lib/supabase/server";

// Email links (confirmation, password reset) come back here with a one-time code.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"), "");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // e.g. the password reset link continues to /reset-password.
      if (next) return NextResponse.redirect(`${origin}${next}`);

      // New users have to pick a nickname first.
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .maybeSingle();
      return NextResponse.redirect(
        `${origin}${profile?.username ? "/" : "/onboarding"}`,
      );
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=${next === "/reset-password" ? "reset_failed" : "confirmation_failed"}`,
  );
}
