export const dynamic = "force-dynamic";

import { prisma } from "@/backend/lib/prisma";
import { formatDate } from "@/backend/lib/utils";
import { Users } from "lucide-react";

async function getUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      accounts: {
        select: { provider: true },
        take: 1,
      },
    },
  });
}

const PROVIDER_LABEL: Record<string, { label: string; color: string }> = {
  google:      { label: "Google",      color: "#4285F4" },
  facebook:    { label: "Facebook",    color: "#1877F2" },
  credentials: { label: "Email",       color: "#06B6D4" },
};

const ROLE_COLOR: Record<string, string> = {
  ADMIN:    "#c9a84c",
  CUSTOMER: "#22c55e",
};

function Initials({ name, email }: { name: string | null; email: string }) {
  const src = name ?? email;
  const parts = src.trim().split(/\s+/);
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : src.slice(0, 2).toUpperCase();
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black shrink-0"
      style={{ background: "#06B6D4" }}
    >
      {initials}
    </div>
  );
}

export default async function AdminUsersPage() {
  const raw = await getUsers();
  const users = raw.map((u) => ({
    ...u,
    provider: u.accounts[0]?.provider ?? "credentials",
  }));

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#06B6D4]/10 border border-[#06B6D4]/20 flex items-center justify-center">
          <Users className="w-5 h-5 text-[#06B6D4]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Registered Users</h1>
          <p className="text-zinc-500 text-sm">{users.length} account{users.length !== 1 ? "s" : ""} total</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl overflow-hidden">
        {users.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Users className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-600 text-sm">No registered users yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1a1a1a]">
                  <th className="text-left px-6 py-4 text-zinc-500 font-medium text-xs uppercase tracking-wider">User</th>
                  <th className="text-left px-6 py-4 text-zinc-500 font-medium text-xs uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-4 text-zinc-500 font-medium text-xs uppercase tracking-wider">Provider</th>
                  <th className="text-left px-6 py-4 text-zinc-500 font-medium text-xs uppercase tracking-wider">Role</th>
                  <th className="text-left px-6 py-4 text-zinc-500 font-medium text-xs uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {users.map((user) => {
                  const prov = PROVIDER_LABEL[user.provider] ?? { label: user.provider, color: "#888" };
                  const roleColor = ROLE_COLOR[user.role] ?? "#888";
                  return (
                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Initials name={user.name} email={user.email} />
                          <span className="text-white font-medium truncate max-w-[160px]">
                            {user.name ?? "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-400 truncate max-w-[200px]">{user.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold"
                          style={{
                            background: `${prov.color}15`,
                            color: prov.color,
                            border: `1px solid ${prov.color}30`,
                          }}
                        >
                          {prov.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold"
                          style={{
                            background: `${roleColor}15`,
                            color: roleColor,
                            border: `1px solid ${roleColor}30`,
                          }}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-500 text-xs">{formatDate(user.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
