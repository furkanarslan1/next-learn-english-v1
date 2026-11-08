import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Google redirects back here (through Supabase) with a one-time code.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
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

  return NextResponse.redirect(`${origin}/login?error=confirmation_failed`);
}
