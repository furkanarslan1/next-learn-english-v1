import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NicknameForm } from "./nickname-form";

export default function OnboardingPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Choose your nickname</CardTitle>
          <CardDescription>
            Pick a unique nickname. You&apos;ll use it in duels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NicknameForm />
        </CardContent>
      </Card>
    </main>
  );
}
