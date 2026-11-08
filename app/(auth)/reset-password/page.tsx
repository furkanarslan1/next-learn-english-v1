import { ResetPasswordForm } from "../password-forms";

// Reached from the link in the reset email; the callback has already signed the user in.
export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
