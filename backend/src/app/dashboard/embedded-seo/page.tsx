"use client";

import { useState, useEffect, useCallback } from "react";

interface EmbedConfig {
  siteUrl: string;
  username: string;
  brandVoice: string | null;
}

interface EmbedArticle {
  id: string;
  title: string;
  keyword: string;
  content: string;
  metaDescription: string | null;
  publishedUrl: string | null;
  wordCount: number;
  status: string;
  createdAt: string;
}

export default function EmbeddedSeoPage() {
  const [connected, setConnected] = useState(false);
  const [config, setConfig] = useState<EmbedConfig | null>(null);
  const [articleCount, setArticleCount] = useState(0);
  const [articles, setArticles] = useState<EmbedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"dashboard" | "generate" | "history">("dashboard");

  const [siteUrl, setSiteUrl] = useState("");
  const [username, setUsername] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [brandVoice, setBrandVoice] = useState("");
  const [connectLoading, setConnectLoading] = useState(false);
  const [connectError, setConnectError] = useState("");

  const [keyword, setKeyword] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genResult, setGenResult] = useState<{ title: string; publishedUrl: string | null; wordCount: number } | null>(null);
  const [genError, setGenError] = useState("");

  const [preview, setPreview] = useState<string | null>(null);

  const fetchStatus = useCallback(() => {
    fetch("/api/dashboard/seo-embed?type=status")
      .then((r) => r.json())
      .then((data) => {
        setConnected(data.connected);
        setConfig(data.config);
        setArticleCount(data.articleCount);
        setLoading(false);
      });
  }, []);

  const fetchHistory = useCallback(() => {
    fetch("/api/dashboard/seo-embed?type=history")
      .then((r) => r.json())
      .then((data) => setArticles(data.articles || []));
  }, []);

  useEffect(() => {
    fetchStatus();
    fetchHistory();
  }, [fetchStatus, fetchHistory]);

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    setConnectLoading(true);
    setConnectError("");
    try {
      const res = await fetch("/api/dashboard/seo-embed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "connect", siteUrl, username, appPassword, brandVoice }),
      });
      const data = await res.json();
      if (data.success) {
        fetchStatus();
        setTab("dashboard");
        setSiteUrl("");
        setUsername("");
        setAppPassword("");
      } else {
        setConnectError(data.error || "Connection failed.");
      }
    } catch {
      setConnectError("Network error. Please try again.");
    }
    setConnectLoading(false);
  }

  async function handleDisconnect() {
    if (!confirm("Disconnect your WordPress site? Published articles will remain on your site.")) return;
    await fetch("/api/dashboard/seo-embed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "disconnect" }),
    });
    setConnected(false);
    setConfig(null);
    setArticleCount(0);
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!keyword.trim()) return;
    setGenerating(true);
    setGenResult(null);
    setGenError("");
    try {
      const res = await fetch("/api/dashboard/seo-embed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", keyword, businessType }),
      });
      const data = await res.json();
      if (data.success) {
        setGenResult(data.article);
        setKeyword("");
        setBusinessType("");
        fetchStatus();
        fetchHistory();
      } else {
        setGenError(data.error || "Generation failed.");
      }
    } catch {
      setGenError("Network error. Please try again.");
    }
    setGenerating(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#7ec8e3] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!connected) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Embedded SEO Engine</h1>
        <p className="text-[#a2d9ed]/50 text-sm mb-8">
          Connect your WordPress site to auto-publish AI-generated SEO articles that rank on Google and ChatGPT.
        </p>

        <div className="max-w-xl mx-auto">
          <div className="bg-[#111d2a] border border-[rgba(120,200,220,0.12)] rounded-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#7ec8e3]/10 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-[#7ec8e3]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white">Connect Your WordPress Site</h2>
              <p className="text-sm text-[#a2d9ed]/40 mt-2">
                We will write, optimise, and publish SEO articles directly to your website automatically.
              </p>
            </div>

            <form onSubmit={handleConnect} className="space-y-4">
              <div>
                <label className="block text-sm text-[#a2d9ed]/60 mb-1">WordPress Site URL</label>
                <input
                  type="url"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  required
                  className="w-full px-4 py-3 bg-[#0b1219] border border-[rgba(120,200,220,0.15)] rounded-lg text-white text-sm placeholder:text-[#a2d9ed]/20 focus:outline-none focus:border-[#7ec8e3]/40"
                />
              </div>
              <div>
                <label className="block text-sm text-[#a2d9ed]/60 mb-1">WordPress Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full px-4 py-3 bg-[#0b1219] border border-[rgba(120,200,220,0.15)] rounded-lg text-white text-sm placeholder:text-[#a2d9ed]/20 focus:outline-none focus:border-[#7ec8e3]/40"
                />
              </div>
              <div>
                <label className="block text-sm text-[#a2d9ed]/60 mb-1">Application Password</label>
                <input
                  type="password"
                  value={appPassword}
                  onChange={(e) => setAppPassword(e.target.value)}
                  placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
                  required
                  className="w-full px-4 py-3 bg-[#0b1219] border border-[rgba(120,200,220,0.15)] rounded-lg text-white text-sm placeholder:text-[#a2d9ed]/20 focus:outline-none focus:border-[#7ec8e3]/40"
                />
                <p className="text-xs text-[#a2d9ed]/25 mt-1">
                  WordPress Dashboard &gt; Users &gt; Profile &gt; Application Passwords
                </p>
              </div>
              <div>
                <label className="block text-sm text-[#a2d9ed]/60 mb-1">Brand Voice (optional)</label>
                <input
                  type="text"
                  value={brandVoice}
                  onChange={(e) => setBrandVoice(e.target.value)}
                  placeholder="e.g. Professional and authoritative, friendly and casual"
                  className="w-full px-4 py-3 bg-[#0b1219] border border-[rgba(120,200,220,0.15)] rounded-lg text-white text-sm placeholder:text-[#a2d9ed]/20 focus:outline-none focus:border-[#7ec8e3]/40"
                />
              </div>

              {connectError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
                  {connectError}
                </div>
              )}

              <button
                type="submit"
                disabled={connectLoading}
                className="w-full py-3 bg-[#7ec8e3] text-[#0b1219] font-semibold rounded-lg hover:bg-[#6bb8d3] transition disabled:opacity-50"
              >
                {connectLoading ? "Connecting..." : "Connect WordPress Site"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-[rgba(120,200,220,0.08)]">
              <p className="text-xs text-[#a2d9ed]/25 text-center">
                Works with WordPress, WooCommerce, and any site with the WordPress REST API enabled.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Embedded SEO Engine</h1>
          <p className="text-[#a2d9ed]/50 text-sm">
            Connected to <span className="text-[#7ec8e3]">{config?.siteUrl}</span>
          </p>
        </div>
        <button onClick={handleDisconnect} className="text-xs text-red-400/60 hover:text-red-400 transition">
          Disconnect
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {(["dashboard", "generate", "history"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === t
                ? "bg-[#7ec8e3]/15 text-[#7ec8e3] border border-[#7ec8e3]/20"
                : "text-[#a2d9ed]/40 hover:text-[#a2d9ed]/60 border border-transparent"
            }`}
          >
            {t === "dashboard" ? "Overview" : t === "generate" ? "Generate Article" : "Published Articles"}
          </button>
        ))}
      </div>

      {tab === "dashboard" && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#111d2a] border border-[rgba(120,200,220,0.12)] rounded-xl p-6 text-center">
              <p className="text-3xl font-bold text-[#7ec8e3]">{articleCount}</p>
              <p className="text-xs text-[#a2d9ed]/40 mt-1">Articles Published</p>
            </div>
            <div className="bg-[#111d2a] border border-[rgba(120,200,220,0.12)] rounded-xl p-6 text-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2 animate-pulse" />
              <p className="text-xs text-[#a2d9ed]/40">Site Connected</p>
            </div>
            <div className="bg-[#111d2a] border border-[rgba(120,200,220,0.12)] rounded-xl p-6 text-center">
              <p className="text-3xl font-bold text-white">{config?.brandVoice ? "On" : "Off"}</p>
              <p className="text-xs text-[#a2d9ed]/40 mt-1">Brand Voice</p>
            </div>
          </div>

          <div className="bg-[#111d2a] border border-[rgba(120,200,220,0.12)] rounded-xl p-6">
            <h3 className="text-white font-semibold mb-3">How It Works</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z", title: "AI Keyword Research", desc: "Enter your target keyword and the AI finds the best angle" },
                { icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", title: "AI Content Writing", desc: "800-1200 word articles optimised for Google and ChatGPT" },
                { icon: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12", title: "Auto-Publish", desc: "Articles published directly to your WordPress site" },
                { icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", title: "Rank & Grow", desc: "Watch your traffic grow from Google and AI search engines" },
              ].map((item, i) => (
                <div key={i} className="bg-[#0b1219] rounded-lg p-4">
                  <svg className="w-5 h-5 text-[#7ec8e3] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path d={item.icon} />
                  </svg>
                  <h4 className="text-sm text-white font-medium">{item.title}</h4>
                  <p className="text-xs text-[#a2d9ed]/30 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setTab("generate")}
            className="w-full py-3 bg-[#7ec8e3] text-[#0b1219] font-semibold rounded-lg hover:bg-[#6bb8d3] transition"
          >
            Generate & Publish Article
          </button>
        </div>
      )}

      {tab === "generate" && (
        <div className="max-w-xl">
          <div className="bg-[#111d2a] border border-[rgba(120,200,220,0.12)] rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Generate & Publish Article</h3>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-sm text-[#a2d9ed]/60 mb-1">Target Keyword</label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. best AI tools for small business"
                  required
                  className="w-full px-4 py-3 bg-[#0b1219] border border-[rgba(120,200,220,0.15)] rounded-lg text-white text-sm placeholder:text-[#a2d9ed]/20 focus:outline-none focus:border-[#7ec8e3]/40"
                />
              </div>
              <div>
                <label className="block text-sm text-[#a2d9ed]/60 mb-1">Business Type (optional)</label>
                <input
                  type="text"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  placeholder="e.g. Digital marketing agency"
                  className="w-full px-4 py-3 bg-[#0b1219] border border-[rgba(120,200,220,0.15)] rounded-lg text-white text-sm placeholder:text-[#a2d9ed]/20 focus:outline-none focus:border-[#7ec8e3]/40"
                />
              </div>

              {genError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
                  {genError}
                </div>
              )}

              {genResult && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <p className="text-green-400 font-medium text-sm mb-1">Article Published!</p>
                  <p className="text-white text-sm">{genResult.title}</p>
                  <p className="text-xs text-green-400/60 mt-1">{genResult.wordCount} words</p>
                  {genResult.publishedUrl && (
                    <a
                      href={genResult.publishedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-xs text-[#7ec8e3] hover:underline"
                    >
                      View on your website &rarr;
                    </a>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={generating}
                className="w-full py-3 bg-[#7ec8e3] text-[#0b1219] font-semibold rounded-lg hover:bg-[#6bb8d3] transition disabled:opacity-50"
              >
                {generating ? "Generating & Publishing..." : "Generate & Publish"}
              </button>
            </form>
          </div>
        </div>
      )}

      {tab === "history" && (
        <div className="space-y-3">
          {articles.length === 0 ? (
            <div className="bg-[#111d2a] border border-[rgba(120,200,220,0.12)] rounded-xl p-12 text-center">
              <p className="text-[#a2d9ed]/30 text-sm">No articles published yet. Generate your first article to get started.</p>
            </div>
          ) : (
            articles.map((a) => (
              <div key={a.id} className="bg-[#111d2a] border border-[rgba(120,200,220,0.12)] rounded-xl p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold text-sm">{a.title}</h3>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          a.status === "published"
                            ? "bg-green-500/15 text-green-400"
                            : "bg-yellow-500/15 text-yellow-400"
                        }`}
                      >
                        {a.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#a2d9ed]/40">
                      Keyword: {a.keyword} &middot; {a.wordCount} words &middot;{" "}
                      {new Date(a.createdAt).toLocaleDateString()}
                    </p>
                    {a.publishedUrl && (
                      <a
                        href={a.publishedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#7ec8e3]/60 hover:text-[#7ec8e3] transition mt-1 inline-block"
                      >
                        {a.publishedUrl}
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => setPreview(preview === a.id ? null : a.id)}
                    className="text-sm text-[#7ec8e3] hover:text-white transition ml-4"
                  >
                    {preview === a.id ? "Hide" : "Preview"}
                  </button>
                </div>
                {preview === a.id && (
                  <div
                    className="mt-4 p-4 bg-[#0b1219] rounded-lg text-[#a2d9ed]/70 text-sm prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: a.content }}
                  />
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
