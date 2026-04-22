"use client";

import { useState, useEffect } from "react";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: string;
  isActive: boolean;
  createdAt: string;
  _count: {
    users: number;
    assistants: number;
    callLogs: number;
  };
}

export default function ClientsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", plan: "STARTER" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    const res = await fetch("/api/admin/clients");
    const data = await res.json();
    setTenants(data);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/admin/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", email: "", password: "", plan: "STARTER" });
    setShowForm(false);
    setLoading(false);
    fetchClients();
  }

  const planColors: Record<string, string> = {
    STARTER: "#7ec8e3",
    GROWTH: "#2dd4bf",
    AGENCY: "#a78bfa",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Clients</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2.5 bg-[#7ec8e3] text-[#0b1219] font-semibold rounded-full hover:bg-white transition text-sm"
        >
          + Add Client
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-[#111d2a] border border-[rgba(120,200,220,0.12)] rounded-xl p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-white mb-4">New Client</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-[#a2d9ed]/60 mb-1">Business Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#0b1219] border border-[rgba(120,200,220,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#7ec8e3]/40"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-[#a2d9ed]/60 mb-1">Login Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#0b1219] border border-[rgba(120,200,220,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#7ec8e3]/40"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-[#a2d9ed]/60 mb-1">Password</label>
              <input
                type="text"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#0b1219] border border-[rgba(120,200,220,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#7ec8e3]/40"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-[#a2d9ed]/60 mb-1">Plan</label>
              <select
                value={form.plan}
                onChange={(e) => setForm({ ...form, plan: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#0b1219] border border-[rgba(120,200,220,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#7ec8e3]/40"
              >
                <option value="STARTER">Starter - £297/mo</option>
                <option value="GROWTH">Growth - £497/mo</option>
                <option value="AGENCY">Agency - £997/mo</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#7ec8e3] text-[#0b1219] font-semibold rounded-full hover:bg-white transition text-sm disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Client"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 border border-[rgba(120,200,220,0.2)] text-[#a2d9ed]/70 rounded-full hover:text-white transition text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-[#111d2a] border border-[rgba(120,200,220,0.12)] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(120,200,220,0.08)]">
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#a2d9ed]/40 uppercase tracking-wider">Client</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#a2d9ed]/40 uppercase tracking-wider">Plan</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#a2d9ed]/40 uppercase tracking-wider">Assistants</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#a2d9ed]/40 uppercase tracking-wider">Calls</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#a2d9ed]/40 uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#a2d9ed]/40 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-[#a2d9ed]/30 text-sm">
                  No clients yet. Click &quot;+ Add Client&quot; to get started.
                </td>
              </tr>
            ) : (
              tenants.map((tenant) => (
                <tr
                  key={tenant.id}
                  className="border-b border-[rgba(120,200,220,0.06)] hover:bg-[rgba(120,200,220,0.03)]"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-white">{tenant.name}</p>
                    <p className="text-xs text-[#a2d9ed]/30">{tenant.slug}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{
                        color: planColors[tenant.plan] || "#7ec8e3",
                        background: `${planColors[tenant.plan] || "#7ec8e3"}15`,
                      }}
                    >
                      {tenant.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#a2d9ed]/60">
                    {tenant._count.assistants}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#a2d9ed]/60">
                    {tenant._count.callLogs}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        tenant.isActive
                          ? "text-green-400 bg-green-400/10"
                          : "text-red-400 bg-red-400/10"
                      }`}
                    >
                      {tenant.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`/admin/clients/${tenant.id}`}
                      className="text-sm text-[#7ec8e3] hover:text-white transition"
                    >
                      Manage →
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
