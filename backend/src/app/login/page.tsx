"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push(data.redirect);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0b1219] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#7ec8e3] rounded-lg flex items-center justify-center text-[#0b1219] font-bold text-sm">
              AY
            </div>
            <span className="text-2xl font-bold text-white">WavesAI</span>
          </div>
          <p className="text-[#7ec8e3]/60 text-sm mt-1">Sign in to your account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#111d2a] border border-[rgba(120,200,220,0.12)] rounded-2xl p-8"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-sm font-medium text-[#a2d9ed]/80 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#0b1219] border border-[rgba(120,200,220,0.15)] rounded-lg text-white placeholder-[#7ec8e3]/30 focus:outline-none focus:border-[#7ec8e3]/40 transition"
              placeholder="admin@wavesai.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#a2d9ed]/80 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#0b1219] border border-[rgba(120,200,220,0.15)] rounded-lg text-white placeholder-[#7ec8e3]/30 focus:outline-none focus:border-[#7ec8e3]/40 transition"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#7ec8e3] text-[#0b1219] font-semibold rounded-full hover:bg-white transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
