"use client";

import { useState, useEffect } from "react";

interface Assistant {
  id: string;
  name: string;
  vapiAssistantId: string | null;
}

export default function WidgetPage() {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard/assistants")
      .then((r) => r.json())
      .then((data: Assistant[]) => {
        setAssistants(data);
        if (data.length > 0) setSelected(data[0].vapiAssistantId || "");
      });
  }, []);

  const embedCode = `<!-- WavesAI Voice Widget -->
<script>
(function() {
  var s = document.createElement('script');
  s.type = 'module';
  s.textContent = \`
    import Vapi from 'https://cdn.jsdelivr.net/npm/@vapi-ai/web@latest/+esm';
    const vapi = new Vapi("${process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "YOUR_VAPI_PUBLIC_KEY"}");
    const btn = document.createElement('button');
    btn.id = 'wavesai-voice-btn';
    btn.innerHTML = '🎙 Talk to AI';
    btn.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;background:#7ec8e3;color:#0b1219;border:none;padding:14px 24px;border-radius:50px;font-weight:600;font-size:14px;cursor:pointer;box-shadow:0 4px 20px rgba(126,200,227,0.3);transition:all 0.3s;font-family:system-ui,sans-serif;';
    btn.onmouseover = () => btn.style.background = '#fff';
    btn.onmouseout = () => btn.style.background = '#7ec8e3';
    let active = false;
    btn.onclick = () => {
      if (!active) {
        vapi.start("${selected}");
        btn.innerHTML = '⏹ End Call';
        btn.style.background = '#ef4444';
        active = true;
      } else {
        vapi.stop();
        btn.innerHTML = '🎙 Talk to AI';
        btn.style.background = '#7ec8e3';
        active = false;
      }
    };
    vapi.on('call-end', () => {
      btn.innerHTML = '🎙 Talk to AI';
      btn.style.background = '#7ec8e3';
      active = false;
    });
    document.body.appendChild(btn);
  \`;
  document.head.appendChild(s);
})();
</script>`;

  function handleCopy() {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Embed Voice Widget</h1>
      <p className="text-[#a2d9ed]/50 text-sm mb-8">
        Add the AI voice assistant to any website with a single code snippet.
      </p>

      {assistants.length === 0 ? (
        <div className="bg-[#111d2a] border border-[rgba(120,200,220,0.12)] rounded-xl p-12 text-center">
          <p className="text-[#a2d9ed]/30 text-sm">
            No assistants available. Ask your WavesAI admin to set up an AI assistant first.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <label className="block text-sm text-[#a2d9ed]/60 mb-2">
              Select Assistant
            </label>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full max-w-md px-4 py-2.5 bg-[#0b1219] border border-[rgba(120,200,220,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#7ec8e3]/40"
            >
              {assistants.map((a) => (
                <option key={a.id} value={a.vapiAssistantId || ""}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-[#111d2a] border border-[rgba(120,200,220,0.12)] rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Embed Code</h2>
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-[#7ec8e3] text-[#0b1219] font-semibold rounded-full hover:bg-white transition text-sm"
              >
                {copied ? "Copied!" : "Copy Code"}
              </button>
            </div>
            <pre className="bg-[#0b1219] border border-[rgba(120,200,220,0.1)] rounded-lg p-4 overflow-x-auto">
              <code className="text-xs text-[#7ec8e3]/80 whitespace-pre">
                {embedCode}
              </code>
            </pre>
          </div>

          <div className="bg-[#111d2a] border border-[rgba(120,200,220,0.12)] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">How to Install</h2>
            <ol className="space-y-3 text-sm text-[#a2d9ed]/60">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#7ec8e3]/10 rounded-full flex items-center justify-center text-[#7ec8e3] text-xs font-bold">1</span>
                Copy the embed code above
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#7ec8e3]/10 rounded-full flex items-center justify-center text-[#7ec8e3] text-xs font-bold">2</span>
                Paste it before the closing &lt;/body&gt; tag on your website
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#7ec8e3]/10 rounded-full flex items-center justify-center text-[#7ec8e3] text-xs font-bold">3</span>
                A floating &quot;Talk to AI&quot; button will appear on your site
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#7ec8e3]/10 rounded-full flex items-center justify-center text-[#7ec8e3] text-xs font-bold">4</span>
                Visitors click it to start a voice conversation with your AI assistant
              </li>
            </ol>
          </div>
        </>
      )}
    </div>
  );
}
