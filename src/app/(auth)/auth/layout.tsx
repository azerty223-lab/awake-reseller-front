import { redirect } from "next/navigation";
import { auth } from "@/backend/lib/auth";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session) redirect("/tickets");

  return (
    <div className="min-h-screen bg-[#020203] flex items-center justify-center px-4 py-12">
      {children}
    </div>
  );
}
