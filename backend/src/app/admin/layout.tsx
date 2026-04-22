import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#0b1219] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f1923] border-r border-[rgba(120,200,220,0.12)] flex flex-col">
        <div className="p-6 border-b border-[rgba(120,200,220,0.12)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#7ec8e3] rounded-lg flex items-center justify-center text-[#0b1219] font-bold text-xs">
              AY
            </div>
            <span className="text-lg font-bold text-white">WavesAI</span>
          </div>
          <p className="text-xs text-[#7ec8e3]/40 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 text-sm text-[#a2d9ed]/70 hover:text-white hover:bg-[rgba(120,200,220,0.06)] rounded-lg transition mb-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>
          <Link
            href="/admin/clients"
            className="flex items-center gap-3 px-4 py-3 text-sm text-[#a2d9ed]/70 hover:text-white hover:bg-[rgba(120,200,220,0.06)] rounded-lg transition mb-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Clients
          </Link>
        </nav>

        <div className="p-4 border-t border-[rgba(120,200,220,0.12)]">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 bg-[#7ec8e3]/20 rounded-full flex items-center justify-center text-[#7ec8e3] text-xs font-medium">
              {session.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm text-white font-medium">{session.name}</p>
              <p className="text-xs text-[#7ec8e3]/40">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
