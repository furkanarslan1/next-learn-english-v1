import { Suspense } from "react";
import { AuthForm } from "../auth-form";

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <AuthForm mode="login" />
      <Suspense>
        <ErrorMessage searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

// Shown when the confirmation link in the email fails.
async function ErrorMessage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { error } = await searchParams;
  if (error !== "confirmation_failed") return null;
  return (
    <p role="alert" className="text-center text-sm text-destructive">
      E-posta onayı başarısız oldu. Lütfen tekrar dene.
    </p>
  );
}
