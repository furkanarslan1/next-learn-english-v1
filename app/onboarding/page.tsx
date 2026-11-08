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
          <CardTitle>Nickname seç</CardTitle>
          <CardDescription>
            Benzersiz bir nickname seç. Düellolarda bu isimle görüneceksin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NicknameForm />
        </CardContent>
      </Card>
    </main>
  );
}
