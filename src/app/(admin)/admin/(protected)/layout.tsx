import { redirect } from "next/navigation";
import { auth } from "@/backend/lib/auth";
import { AdminSidebar } from "@/frontend/components/admin/AdminSidebar";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user) {
    redirect("/admin/login"); // not logged in → show login
  }
  if (role !== "ADMIN") {
    redirect("/"); // logged in as customer → hide admin existence
  }

  return (
    <div className="flex min-h-screen bg-[#080808]">
      <AdminSidebar />
      <main className="flex-1 ml-0 lg:ml-64 min-h-screen">{children}</main>
    </div>
  );
}
