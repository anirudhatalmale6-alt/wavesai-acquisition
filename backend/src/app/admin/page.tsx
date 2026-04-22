import { prisma } from "@/lib/db";

export default async function AdminDashboard() {
  const [totalClients, activeClients, totalAssistants, totalCalls] =
    await Promise.all([
      prisma.tenant.count(),
      prisma.tenant.count({ where: { isActive: true } }),
      prisma.voiceAssistant.count(),
      prisma.callLog.count(),
    ]);

  const stats = [
    { label: "Total Clients", value: totalClients, color: "#7ec8e3" },
    { label: "Active Clients", value: activeClients, color: "#2dd4bf" },
    { label: "Voice Assistants", value: totalAssistants, color: "#a78bfa" },
    { label: "Total Calls", value: totalCalls, color: "#f59e0b" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#111d2a] border border-[rgba(120,200,220,0.12)] rounded-xl p-6"
          >
            <p className="text-sm text-[#a2d9ed]/50 mb-2">{stat.label}</p>
            <p
              className="text-3xl font-bold"
              style={{ color: stat.color }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-[#111d2a] border border-[rgba(120,200,220,0.12)] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Quick Actions
        </h2>
        <div className="flex gap-4">
          <a
            href="/admin/clients"
            className="px-6 py-3 bg-[#7ec8e3] text-[#0b1219] font-semibold rounded-full hover:bg-white transition text-sm"
          >
            Manage Clients
          </a>
        </div>
      </div>
    </div>
  );
}
