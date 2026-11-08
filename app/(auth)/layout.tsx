import { FiBookOpen } from "react-icons/fi";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <FiBookOpen className="size-6" />
        </span>
        <span className="text-2xl font-extrabold tracking-tight">İngilizce Öğren</span>
      </div>
      {children}
    </main>
  );
}
