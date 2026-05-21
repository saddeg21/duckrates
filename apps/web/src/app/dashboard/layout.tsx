import { redirect } from "next/navigation";
import { getSessionId, getUserId } from "@lib/session";
import { Sidebar } from "@components/dashboard/Sidebar";
import { MobileMenuButton } from "@components/dashboard/MobileMenuButton";
import { EuphratLogo } from "@components/EuphratLogo";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionId = await getSessionId();
  const userId = await getUserId();
  if (!sessionId || !userId) redirect("/login");

  return (
    <div className="flex h-screen bg-surface overflow-hidden font-sans">
      <Sidebar userId={userId} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-surface-low shrink-0">
          <MobileMenuButton />
          <EuphratLogo size={24} />
        </header>

        <main className="flex-1 flex flex-col min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}
