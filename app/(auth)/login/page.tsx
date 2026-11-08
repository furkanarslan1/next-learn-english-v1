import { Suspense } from "react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signInWithGoogle } from "../actions";

const ERRORS: Record<string, string> = {
  confirmation_failed: "Sign-in failed. Please try again.",
  oauth_failed: "Could not start Google sign-in. Please try again.",
  missing_origin: "Could not start Google sign-in. Please try again.",
};

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Learn English</CardTitle>
        <CardDescription>
          Sign in to build your vocabulary and practice grammar.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form action={signInWithGoogle}>
          <Button type="submit" variant="outline" className="w-full">
            <FcGoogle /> Continue with Google
          </Button>
        </form>
        <Suspense>
          <ErrorMessage searchParams={searchParams} />
        </Suspense>
      </CardContent>
    </Card>
  );
}

async function ErrorMessage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { error } = await searchParams;
  const message = typeof error === "string" ? ERRORS[error] : undefined;
  if (!message) return null;
  return (
    <p role="alert" className="text-sm text-destructive">
      {message}
    </p>
  );
}
