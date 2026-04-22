"use client";

import { useState, useEffect } from "react";

interface CallLog {
  id: string;
  callerNumber: string | null;
  direction: string;
  status: string;
  duration: number | null;
  summary: string | null;
  createdAt: string;
  assistant: { name: string } | null;
}

export default function ClientCallsPage() {
  const [calls, setCalls] = useState<CallLog[]>([]);

  useEffect(() => {
    fetch("/api/dashboard/calls")
      .then((r) => r.json())
      .then(setCalls);
  }, []);

  function statusColor(status: string) {
    if (status === "completed") return "text-green-400 bg-green-400/10";
    if (status === "failed" || status === "no-answer") return "text-red-400 bg-red-400/10";
    return "text-yellow-400 bg-yellow-400/10";
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Call Logs</h1>

      <div className="bg-[#111d2a] border border-[rgba(120,200,220,0.12)] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(120,200,220,0.08)]">
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#a2d9ed]/40 uppercase tracking-wider">Caller</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#a2d9ed]/40 uppercase tracking-wider">Assistant</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#a2d9ed]/40 uppercase tracking-wider">Direction</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#a2d9ed]/40 uppercase tracking-wider">Duration</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#a2d9ed]/40 uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#a2d9ed]/40 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody>
            {calls.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-[#a2d9ed]/30 text-sm">
                  No call logs yet. Calls will appear here once your AI assistant starts handling them.
                </td>
              </tr>
            ) : (
              calls.map((call) => (
                <tr
                  key={call.id}
                  className="border-b border-[rgba(120,200,220,0.06)] hover:bg-[rgba(120,200,220,0.03)]"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm text-white">{call.callerNumber || "Unknown"}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#a2d9ed]/60">
                    {call.assistant?.name || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-[#a2d9ed]/50 capitalize">{call.direction}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#a2d9ed]/60">
                    {call.duration
                      ? `${Math.floor(call.duration / 60)}m ${call.duration % 60}s`
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor(call.status)}`}>
                      {call.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#a2d9ed]/40">
                    {new Date(call.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {calls.length > 0 && calls.some((c) => c.summary) && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-4">Call Summaries</h2>
          <div className="space-y-3">
            {calls
              .filter((c) => c.summary)
              .map((call) => (
                <div
                  key={call.id}
                  className="bg-[#111d2a] border border-[rgba(120,200,220,0.12)] rounded-xl p-5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-white font-medium">
                      {call.callerNumber || "Unknown"}
                    </span>
                    <span className="text-xs text-[#a2d9ed]/30">
                      {new Date(call.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-[#a2d9ed]/60">{call.summary}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
