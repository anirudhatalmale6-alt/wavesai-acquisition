"use client";

import { useState, useEffect, use } from "react";

interface Assistant {
  id: string;
  name: string;
  vapiAssistantId: string | null;
  systemPrompt: string;
  firstMessage: string | null;
  voiceId: string;
  isActive: boolean;
  createdAt: string;
}

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tenantId } = use(params);
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    systemPrompt: "",
    firstMessage: "Hi there! Thanks for calling. How can I help you today?",
    voiceId: "Elliot",
  });

  useEffect(() => {
    fetchAssistants();
  }, [tenantId]);

  async function fetchAssistants() {
    const res = await fetch(`/api/admin/assistants?tenantId=${tenantId}`);
    const data = await res.json();
    setAssistants(data);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/assistants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tenantId }),
      });
      if (res.ok) {
        setForm({
          name: "",
          systemPrompt: "",
          firstMessage: "Hi there! Thanks for calling. How can I help you today?",
          voiceId: "Elliot",
        });
        setShowForm(false);
        fetchAssistants();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this assistant? This will also remove it from Vapi.")) return;
    await fetch("/api/admin/assistants", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchAssistants();
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <a href="/admin/clients" className="text-[#7ec8e3]/60 hover:text-[#7ec8e3] transition text-sm">
          ← Back to Clients
        </a>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Voice AI Assistants</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2.5 bg-[#7ec8e3] text-[#0b1219] font-semibold rounded-full hover:bg-white transition text-sm"
        >
          + Create Assistant
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-[#111d2a] border border-[rgba(120,200,220,0.12)] rounded-xl p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-white mb-4">
            New Voice AI Assistant
          </h2>

          <div className="mb-4">
            <label className="block text-sm text-[#a2d9ed]/60 mb-1">
              Assistant Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#0b1219] border border-[rgba(120,200,220,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#7ec8e3]/40"
              placeholder="e.g. Acme Corp Receptionist"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-[#a2d9ed]/60 mb-1">
              System Prompt (AI Instructions)
            </label>
            <textarea
              value={form.systemPrompt}
              onChange={(e) => setForm({ ...form, systemPrompt: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#0b1219] border border-[rgba(120,200,220,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#7ec8e3]/40 min-h-[200px]"
              placeholder={"You are an AI receptionist for [Business Name]. You answer calls, book appointments, and qualify leads.\n\nBusiness Info:\n- Services: ...\n- Pricing: ...\n- Hours: ...\n- FAQ: ..."}
              required
            />
            <p className="text-xs text-[#a2d9ed]/30 mt-1">
              Describe the business, services, pricing, and how the AI should handle calls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-[#a2d9ed]/60 mb-1">
                Greeting Message
              </label>
              <input
                type="text"
                value={form.firstMessage}
                onChange={(e) => setForm({ ...form, firstMessage: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#0b1219] border border-[rgba(120,200,220,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#7ec8e3]/40"
                placeholder="Hi there! Thanks for calling..."
              />
            </div>
            <div>
              <label className="block text-sm text-[#a2d9ed]/60 mb-1">
                Voice
              </label>
              <select
                value={form.voiceId}
                onChange={(e) => setForm({ ...form, voiceId: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#0b1219] border border-[rgba(120,200,220,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#7ec8e3]/40"
              >
                <option value="Elliot">Elliot (Male, Professional)</option>
                <option value="rachel">Rachel (Female, Warm)</option>
                <option value="drew">Drew (Male, Casual)</option>
                <option value="sarah">Sarah (Female, Professional)</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#7ec8e3] text-[#0b1219] font-semibold rounded-full hover:bg-white transition text-sm disabled:opacity-50"
            >
              {loading ? "Creating on Vapi..." : "Create Assistant"}
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

      {/* Assistants List */}
      <div className="space-y-4">
        {assistants.length === 0 ? (
          <div className="bg-[#111d2a] border border-[rgba(120,200,220,0.12)] rounded-xl p-12 text-center">
            <p className="text-[#a2d9ed]/30 text-sm">
              No assistants yet. Click &quot;+ Create Assistant&quot; to set up a Voice AI for this client.
            </p>
          </div>
        ) : (
          assistants.map((assistant) => (
            <div
              key={assistant.id}
              className="bg-[#111d2a] border border-[rgba(120,200,220,0.12)] rounded-xl p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[#7ec8e3]/10 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#7ec8e3]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{assistant.name}</h3>
                      <p className="text-xs text-[#a2d9ed]/30">
                        Voice: {assistant.voiceId} | Vapi ID: {assistant.vapiAssistantId || "N/A"}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ml-2 ${
                        assistant.isActive
                          ? "text-green-400 bg-green-400/10"
                          : "text-red-400 bg-red-400/10"
                      }`}
                    >
                      {assistant.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="text-sm text-[#a2d9ed]/50 mt-3 line-clamp-2">
                    {assistant.systemPrompt.substring(0, 200)}...
                  </p>

                  {assistant.firstMessage && (
                    <p className="text-xs text-[#7ec8e3]/40 mt-2">
                      Greeting: &quot;{assistant.firstMessage}&quot;
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(assistant.id)}
                  className="text-red-400/40 hover:text-red-400 transition ml-4"
                  title="Delete assistant"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
