import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { FiBookOpen, FiLogOut, FiZap } from "react-icons/fi";
import { MdOutlineSpellcheck } from "react-icons/md";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { signout } from "./(auth)/actions";

const sections = [
  { href: "/words", title: "Kelime öğren", description: "Kelime desteni çalış.", icon: FiBookOpen },
  { href: "/grammar", title: "Gramer çalış", description: "Seviyeye göre kurallar ve örnekler.", icon: MdOutlineSpellcheck },
  { href: "/duels", title: "Düello", description: "Diğer öğrencilere meydan oku.", icon: FiZap },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-4">
      <header className="flex items-center justify-between">
        <Suspense fallback={<h1 className="text-xl font-semibold">Hoş geldin</h1>}>
          <Greeting />
        </Suspense>
        <form action={signout}>
          <Button variant="outline" size="sm" type="submit">
            <FiLogOut /> Çıkış yap
          </Button>
        </form>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {sections.map(({ href, title, description, icon: Icon }) => (
          <Link key={href} href={href}>
            <Card className="h-full transition-colors hover:bg-muted">
              <CardHeader>
                <Icon className="mb-2 size-6" />
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}

async function Greeting() {
  // Reads the session (uses the current time), so render at request time only.
  await connection();
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .maybeSingle();

  // Signed in with Google but no nickname yet.
  if (!profile?.username) redirect("/onboarding");

  return <h1 className="text-xl font-semibold">Hoş geldin, {profile.username}</h1>;
}
