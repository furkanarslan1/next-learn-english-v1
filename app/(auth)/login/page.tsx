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
  const { error, deleted } = await searchParams;
  if (deleted === "1") {
    return (
      <p role="status" className="text-center text-sm text-muted-foreground">
        Hesabın silindi.
      </p>
    );
  }
  const message =
    error === "confirmation_failed"
      ? "E-posta onayı başarısız oldu. Lütfen tekrar dene."
      : error === "reset_failed"
        ? "Şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş. Yeni bir bağlantı iste."
        : null;
  if (!message) return null;
  return (
    <p role="alert" className="text-center text-sm text-destructive">
      {message}
    </p>
  );
}
