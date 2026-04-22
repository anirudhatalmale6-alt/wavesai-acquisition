"use client";

import { useState, useEffect } from "react";

interface Assistant {
  id: string;
  name: string;
  vapiAssistantId: string | null;
  systemPrompt: string;
  firstMessage: string | null;
  voiceId: string;
  isActive: boolean;
  _count?: { callLogs: number };
}

export default function ClientAssistantsPage() {
  const [assistants, setAssistants] = useState<Assistant[]>([]);

  useEffect(() => {
    fetch("/api/dashboard/assistants")
      .then((r) => r.json())
      .then(setAssistants);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Your AI Assistants</h1>

      {assistants.length === 0 ? (
        <div className="bg-[#111d2a] border border-[rgba(120,200,220,0.12)] rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-[#7ec8e3]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#7ec8e3]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <p className="text-[#a2d9ed]/40 text-sm mb-1">No AI assistants set up yet</p>
          <p className="text-[#a2d9ed]/20 text-xs">
            Your WavesAI admin will create and configure assistants for your business.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {assistants.map((a) => (
            <div
              key={a.id}
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
                      <h3 className="text-white font-semibold">{a.name}</h3>
                      <p className="text-xs text-[#a2d9ed]/30">
                        Voice: {a.voiceId} · {a._count?.callLogs || 0} calls
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ml-2 ${
                        a.isActive
                          ? "text-green-400 bg-green-400/10"
                          : "text-red-400 bg-red-400/10"
                      }`}
                    >
                      {a.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm text-[#a2d9ed]/50 mt-3 line-clamp-2">
                    {a.systemPrompt.substring(0, 200)}...
                  </p>
                  {a.firstMessage && (
                    <p className="text-xs text-[#7ec8e3]/40 mt-2">
                      Greeting: &quot;{a.firstMessage}&quot;
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
