import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || !session.tenantId) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#0b1219] flex">
      <aside className="w-64 bg-[#0f1923] border-r border-[rgba(120,200,220,0.12)] flex flex-col">
        <div className="p-6 border-b border-[rgba(120,200,220,0.12)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#7ec8e3] rounded-lg flex items-center justify-center text-[#0b1219] font-bold text-xs">
              W
            </div>
            <span className="text-lg font-bold text-white">WavesAI</span>
          </div>
          <p className="text-xs text-[#7ec8e3]/40 mt-1">Client Dashboard</p>
        </div>

        <nav className="flex-1 p-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 text-sm text-[#a2d9ed]/70 hover:text-white hover:bg-[rgba(120,200,220,0.06)] rounded-lg transition mb-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Overview
          </Link>
          <Link
            href="/dashboard/assistants"
            className="flex items-center gap-3 px-4 py-3 text-sm text-[#a2d9ed]/70 hover:text-white hover:bg-[rgba(120,200,220,0.06)] rounded-lg transition mb-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            AI Assistants
          </Link>
          <Link
            href="/dashboard/calls"
            className="flex items-center gap-3 px-4 py-3 text-sm text-[#a2d9ed]/70 hover:text-white hover:bg-[rgba(120,200,220,0.06)] rounded-lg transition mb-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Call Logs
          </Link>
          <Link
            href="/dashboard/bookings"
            className="flex items-center gap-3 px-4 py-3 text-sm text-[#a2d9ed]/70 hover:text-white hover:bg-[rgba(120,200,220,0.06)] rounded-lg transition mb-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Bookings
          </Link>
          <Link
            href="/dashboard/widgets"
            className="flex items-center gap-3 px-4 py-3 text-sm text-[#a2d9ed]/70 hover:text-white hover:bg-[rgba(120,200,220,0.06)] rounded-lg transition mb-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Embed Widget
          </Link>

          <div className="mt-4 mb-2 px-4">
            <p className="text-xs text-[#a2d9ed]/20 uppercase tracking-wider font-semibold">More Systems</p>
          </div>
          <Link
            href="/dashboard/leads"
            className="flex items-center gap-3 px-4 py-3 text-sm text-[#a2d9ed]/70 hover:text-white hover:bg-[rgba(120,200,220,0.06)] rounded-lg transition mb-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Lead Gen
          </Link>
          <Link
            href="/dashboard/seo"
            className="flex items-center gap-3 px-4 py-3 text-sm text-[#a2d9ed]/70 hover:text-white hover:bg-[rgba(120,200,220,0.06)] rounded-lg transition mb-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            SEO Content
          </Link>
          <Link
            href="/dashboard/embedded-seo"
            className="flex items-center gap-3 px-4 py-3 text-sm text-[#a2d9ed]/70 hover:text-white hover:bg-[rgba(120,200,220,0.06)] rounded-lg transition mb-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            Embedded SEO
          </Link>
          <Link
            href="/dashboard/ads"
            className="flex items-center gap-3 px-4 py-3 text-sm text-[#a2d9ed]/70 hover:text-white hover:bg-[rgba(120,200,220,0.06)] rounded-lg transition mb-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            Ad Copy
          </Link>
        </nav>

        <div className="p-4 border-t border-[rgba(120,200,220,0.12)]">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 bg-[#7ec8e3]/20 rounded-full flex items-center justify-center text-[#7ec8e3] text-xs font-medium">
              {session.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm text-white font-medium">{session.name}</p>
              <p className="text-xs text-[#7ec8e3]/40">Client</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
