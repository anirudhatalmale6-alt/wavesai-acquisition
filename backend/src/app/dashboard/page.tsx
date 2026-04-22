import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function DashboardOverview() {
  const session = await getSession();
  if (!session || !session.tenantId) redirect("/login");

  const tenantId = session.tenantId;

  const [assistantCount, callCount, totalDuration, recentCalls] =
    await Promise.all([
      prisma.voiceAssistant.count({ where: { tenantId } }),
      prisma.callLog.count({ where: { tenantId } }),
      prisma.callLog.aggregate({
        where: { tenantId },
        _sum: { duration: true },
      }),
      prisma.callLog.findMany({
        where: { tenantId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { assistant: true },
      }),
    ]);

  const totalMinutes = Math.round((totalDuration._sum.duration || 0) / 60);

  const stats = [
    { label: "AI Assistants", value: assistantCount, color: "#7ec8e3" },
    { label: "Total Calls", value: callCount, color: "#2dd4bf" },
    { label: "Minutes Used", value: totalMinutes, color: "#a78bfa" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#111d2a] border border-[rgba(120,200,220,0.12)] rounded-xl p-6"
          >
            <p className="text-sm text-[#a2d9ed]/50 mb-2">{stat.label}</p>
            <p className="text-3xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-[#111d2a] border border-[rgba(120,200,220,0.12)] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Calls</h2>
        {recentCalls.length === 0 ? (
          <p className="text-[#a2d9ed]/30 text-sm">
            No calls yet. Once your AI assistant starts receiving calls, they will appear here.
          </p>
        ) : (
          <div className="space-y-3">
            {recentCalls.map((call) => (
              <div
                key={call.id}
                className="flex items-center justify-between py-3 border-b border-[rgba(120,200,220,0.06)] last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      call.status === "completed"
                        ? "bg-green-400"
                        : call.status === "failed"
                        ? "bg-red-400"
                        : "bg-yellow-400"
                    }`}
                  />
                  <div>
                    <p className="text-sm text-white">
                      {call.callerNumber || "Unknown"}
                    </p>
                    <p className="text-xs text-[#a2d9ed]/30">
                      {call.assistant?.name || "—"} · {call.direction}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#a2d9ed]/60">
                    {call.duration ? `${Math.round(call.duration / 60)}m ${call.duration % 60}s` : "—"}
                  </p>
                  <p className="text-xs text-[#a2d9ed]/30">
                    {new Date(call.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
