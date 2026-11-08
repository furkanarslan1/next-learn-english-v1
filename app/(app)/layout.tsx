import { Suspense } from "react";
import { BottomNav } from "@/components/bottom-nav";

// Shared shell for every signed-in page: content + the floating bottom dock.
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <div className="flex flex-1 flex-col pb-28">{children}</div>
      <Suspense fallback={null}>
        <BottomNav />
      </Suspense>
    </>
  );
}
