import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Providers } from "@/shared/components/layout/Providers";
import { Sidebar } from "@/shared/components/layout/Sidebar";
import { Topbar } from "@/shared/components/layout/Topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <Providers>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </Providers>
  );
}
