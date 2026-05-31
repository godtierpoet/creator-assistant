import { useState, useRef, useEffect, useCallback } from "react";

const TONES = [
  { id: "flirty", label: "Flirty", hint: "💡 flirty: play with tension, low-effort styling, sweet teases, flattery." },
  { id: "girlfriend", label: "Girlfriend Vibe", hint: "💡 girlfriend vibe: warm, personal, intimate — like you're their special someone." },
  { id: "teasing", label: "Teasing", hint: "💡 teasing: playful push-pull, keep them wanting more, witty comebacks." },
  { id: "friendly", label: "Friendly", hint: "💡 friendly: casual, warm, approachable — like texting a close friend." },
  { id: "sales", label: "Sales/Upsell", hint: "💡 sales/upsell: create FOMO, entice subtly, mention exclusive content naturally." },
];

const QUICK_EXAMPLES = {
  Morning: "Good morning! Just woke up thinking about you 😊",
  Lonely: "I've been feeling really lonely lately, no one to talk to",
  Verification: "Can you verify yourself? Send a pic with today's date",
  Attachment: "I'm getting really attached to you, is that weird?",
};

const TONE_PROMPTS = {
  flirty: "Generate 4 flirty, seductive, playful replies. Be suggestive but classy. Play with tension and flattery.",
  girlfriend: "Generate 4 warm girlfriend-vibe replies. Sound intimate, caring, personal — like their special someone.",
  teasing: "Generate 4 playful teasing replies. Push-pull dynamic. Keep them wanting more.",
  friendly: "Generate 4 friendly, casual, warm replies. Sound like a real person, approachable and genuine.",
  sales: "Generate 4 replies that naturally upsell content. Create FOMO and desire. Mention exclusive content naturally.",
};

const SYSTEM_PROMPT = `You are a professional OnlyFans chatter assistant helping creators craft natural, engaging, human-like replies to fan messages.

RULES:
- Each reply must feel unique and natural, never robotic or repetitive
- Vary sentence structure, length, and vocabulary across all replies
- Sound like a real person, not an AI
- No filler phrases like "Absolutely!", "Of course!", "Great question!"
- Detect the fan's emotional tone and match/complement it
- Each reply on a NEW LINE starting with a number and period (1. 2. 3. 4.)
- Keep replies 1-3 sentences max
- Be creative and varied — each reply should take a different angle
- Return ONLY the numbered replies, nothing else`;

const OPENROUTER_KEY = "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";

function parseReplies(text) {
  const lines = text.split("\n").filter(l => l.trim());
  const replies = [];
  for (const line of lines) {
    const match = line.match(/^\d+[\.\)]\s*(.+)/);
    if (match) replies.push(match[1].trim());
  }
  return replies.length > 0 ? replies : [text.trim()];
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      style={{
        background: copied ? "#1a3a1a" : "#1a1a1a",
        border: "1px solid " + (copied ? "#4ade80" : "#333"),
        color: copied ? "#4ade80" : "#888",
        borderRadius: "4px", padding: "4px 10px", cursor: "pointer",
        fontSize: "11px", fontFamily: "monospace", transition: "all 0.2s", flexShrink: 0
      }}
    >{copied ? "COPIED" : "COPY"}</button>
  );
}

export default function App() {
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState("flirty");
  const [customSpec, setCustomSpec] = useState("");
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [personaName, setPersonaName] = useState("My Persona");
  const [personaBio, setPersonaBio] = useState('"playful, witty, charmingly modest, using subtle local texting accents"');
  const [editingPersona, setEditingPersona] = useState(false);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ca_history2") || "[]"); } catch { return []; }
  });
  const [pinned, setPinned] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ca_pinned") || "[]"); } catch { return []; }
  });
  const [activeHistory, setActiveHistory] = useState(null);

  useEffect(() => { localStorage.setItem("ca_history2", JSON.stringify(history.slice(0, 30))); }, [history]);
  useEffect(() => { localStorage.setItem("ca_pinned", JSON.stringify(pinned.slice(0, 20))); }, [pinned]);

  const toneObj = TONES.find(t => t.id === tone);

  const generate = useCallback(async () => {
    const m = message.trim();
    if (!m) { setError("Paste a fan message first."); return; }
    setLoading(true); setError(""); setReplies([]); setActiveHistory(null);
    try {
      const userPrompt = `Fan message: "${m}"\n\nTone: ${TONE_PROMPTS[tone]}${customSpec ? `\n\nExtra instructions: ${customSpec}` : ""}\n\nPersona: ${personaName} — ${personaBio}`;
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENROUTER_KEY}`,
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.1-8b-instruct:free",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt }
          ]
        })
      });
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || "";
      const parsed = parseReplies(text);
      setReplies(parsed);
      const entry = { id: Date.now(), message: m, tone, replies: parsed, ts: Date.now() };
      setHistory(h => [entry, ...h]);
    } catch (e) { setError("Generation failed. Try again."); }
    setLoading(false);
  }, [message, tone, customSpec, personaName, personaBio]);

  useEffect(() => {
    const h = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") generate(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [generate]);

  const togglePin = (reply) => {
    setPinned(p => p.includes(reply) ? p.filter(r => r !== reply) : [reply, ...p]);
  };

  const displayedReplies = activeHistory ? activeHistory.replies : replies;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0a0a0a", color: "#e0e0e0", fontFamily: "'Inter', 'Segoe UI', sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 4px; }
        textarea:focus, input:focus { outline: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* SIDEBAR */}
      <div style={{ width: "300px", minWidth: "300px", background: "#0d0d0d", borderRight: "1px solid #1a1a1a", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "18px 16px", borderBottom: "1px solid #1a1a1a" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <div style={{ width: "32px", height: "32px", background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>✦</div>
            <div>
              <div style={{ fontWeight: "600", fontSize: "14px", color: "#fff" }}>Creator Assistant</div>
              <div style={{ fontSize: "11px", color: "#555", fontFamily: "monospace" }}>Powered by Llama 3.1 Free</div>
            </div>
          </div>
          <button onClick={() => { setMessage(""); setReplies([]); setError(""); setActiveHistory(null); }} style={{
            width: "100%", marginTop: "12px", padding: "8px 0", background: "#111", border: "1px solid #2a2a2a",
            color: "#aaa", borderRadius: "6px", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px"
          }}>+ New Chat</button>
        </div>

        {/* Persona */}
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #1a1a1a" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ fontSize: "10px", color: "#555", fontFamily: "monospace", letterSpacing: "1px" }}>◉ PERSONA CONFIG</span>
            <button onClick={() => setEditingPersona(e => !e)} style={{ background: "none", border: "none", color: "#666", fontSize: "11px", cursor: "pointer" }}>⚙ Edit</button>
          </div>
          {editingPersona ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <input value={personaName} onChange={e => setPersonaName(e.target.value)}
                style={{ background: "#111", border: "1px solid #2a2a2a", color: "#e0e0e0", borderRadius: "4px", padding: "6px 8px", fontSize: "13px" }} />
              <textarea value={personaBio} onChange={e => setPersonaBio(e.target.value)} rows={2}
                style={{ background: "#111", border: "1px solid #2a2a2a", color: "#aaa", borderRadius: "4px", padding: "6px 8px", fontSize: "12px", resize: "none" }} />
              <button onClick={() => setEditingPersona(false)} style={{ background: "#1a1a1a", border: "1px solid #333", color: "#aaa", borderRadius: "4px", padding: "5px", cursor: "pointer", fontSize: "12px" }}>Save</button>
            </div>
          ) : (
            <>
              <div style={{ fontWeight: "600", fontSize: "15px", color: "#e0e0e0", marginBottom: "4px" }}>{personaName}</div>
              <div style={{ fontSize: "12px", color: "#666", lineHeight: "1.4" }}>{personaBio}</div>
            </>
          )}
        </div>

        {/* Pinned */}
        <div style={{ padding: "12px 16px", borderBottom: "1px solid #1a1a1a" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "10px", color: "#555", fontFamily: "monospace", letterSpacing: "1px" }}>PINNED RESPONSES ({pinned.length})</span>
          </div>
          {pinned.length === 0 ? (
            <p style={{ fontSize: "11px", color: "#444", lineHeight: "1.5" }}>Click the ☆ on any reply to pin it here for quick access.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxHeight: "100px", overflowY: "auto" }}>
              {pinned.map((r, i) => (
                <div key={i} style={{ fontSize: "12px", color: "#888", padding: "4px 0", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", gap: "8px" }}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r}</span>
                  <CopyBtn text={r} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* History */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "12px 16px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "10px", color: "#555", fontFamily: "monospace", letterSpacing: "1px" }}>PAST GENERATIONS ({history.length})</span>
            <button onClick={() => setHistory([])} style={{ background: "none", border: "none", color: "#444", cursor: "pointer", fontSize: "13px" }}>↺</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 12px" }}>
            {history.map(item => (
              <div key={item.id} onClick={() => { setActiveHistory(item); setMessage(item.message); setTone(item.tone); }}
                style={{ padding: "8px 10px", borderRadius: "6px", cursor: "pointer", marginBottom: "4px", background: activeHistory?.id === item.id ? "#1a1a1a" : "transparent", border: "1px solid " + (activeHistory?.id === item.id ? "#2a2a2a" : "transparent"), transition: "all 0.15s" }}
                onMouseEnter={e => { if (activeHistory?.id !== item.id) e.currentTarget.style.background = "#111"; }}
                onMouseLeave={e => { if (activeHistory?.id !== item.id) e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                  <span style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#888", fontSize: "10px", padding: "1px 6px", borderRadius: "3px", fontFamily: "monospace" }}>
                    {TONES.find(t => t.id === item.tone)?.label}
                  </span>
                  <span style={{ fontSize: "10px", color: "#444" }}>{new Date(item.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <div style={{ fontSize: "12px", color: "#777", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#fff", letterSpacing: "-0.5px" }}>Creator Assistant</h1>
              <span style={{ background: "#111", border: "1px solid #2a2a2a", color: "#888", fontSize: "10px", padding: "3px 8px", borderRadius: "3px", fontFamily: "monospace", letterSpacing: "1px" }}>CHARMING CHATTER SYSTEM</span>
            </div>
            <p style={{ fontSize: "13px", color: "#555", lineHeight: "1.5", maxWidth: "580px" }}>
              Paste the incoming fan message, set the tone direction, and copy natural human-sounding suggestions instantly.
            </p>
          </div>
          <div style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "6px", padding: "8px 12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4ade80" }} />
            <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#888" }}>llama-3.1-free</span>
          </div>
        </div>

        {/* Input Card */}
        <div style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", borderRadius: "10px", padding: "24px", marginBottom: "16px" }}>
          {/* Fan Message */}
          <div style={{ marginBottom: "22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#666", letterSpacing: "1px" }}>INCOMING FAN TEXT</span>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <span style={{ fontSize: "11px", color: "#444", marginRight: "4px" }}>Quick examples:</span>
                {Object.keys(QUICK_EXAMPLES).map(k => (
                  <button key={k} onClick={() => setMessage(QUICK_EXAMPLES[k])} style={{ background: "#111", border: "1px solid #2a2a2a", color: "#777", borderRadius: "4px", padding: "3px 10px", cursor: "pointer", fontSize: "11px" }}>{k}</button>
                ))}
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Paste fan message here..." rows={4}
                style={{ width: "100%", background: "#111", border: "1px solid #1e1e1e", color: "#e0e0e0", fontSize: "14px", lineHeight: "1.6", borderRadius: "6px", padding: "12px 14px", resize: "vertical", fontFamily: "Inter, sans-serif", minHeight: "90px" }} />
              <span style={{ position: "absolute", bottom: "10px", right: "12px", fontSize: "11px", color: "#333", fontFamily: "monospace" }}>CHARS: {message.length}</span>
            </div>
          </div>

          {/* Tone */}
          <div style={{ marginBottom: "22px" }}>
            <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#666", letterSpacing: "1px", marginBottom: "10px" }}>TONE TARGET DIRECTION</div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
              {TONES.map(t => (
                <button key={t.id} onClick={() => setTone(t.id)} style={{ padding: "8px 20px", borderRadius: "5px", cursor: "pointer", fontSize: "13px", fontWeight: tone === t.id ? "600" : "400", transition: "all 0.15s", border: "1px solid", background: tone === t.id ? "#fff" : "#111", borderColor: tone === t.id ? "#fff" : "#2a2a2a", color: tone === t.id ? "#000" : "#777" }}>{t.label}</button>
              ))}
            </div>
            {toneObj && <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "5px", padding: "8px 12px", fontSize: "12px", color: "#666", fontStyle: "italic" }}>{toneObj.hint}</div>}
          </div>

          {/* Custom Spec */}
          <div style={{ marginBottom: "22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#666", letterSpacing: "1px" }}>CUSTOM SPECIFICATIONS (OPTIONAL)</span>
              <span style={{ fontSize: "11px", color: "#444", fontStyle: "italic" }}>e.g. "make it short", "use lowercase"</span>
            </div>
            <input value={customSpec} onChange={e => setCustomSpec(e.target.value)} placeholder="e.g. keep sentences short; use no emojis; sound a bit sleepy"
              style={{ width: "100%", background: "#111", border: "1px solid #1e1e1e", color: "#888", fontSize: "13px", borderRadius: "5px", padding: "10px 14px", fontFamily: "Inter, sans-serif" }} />
          </div>

          {/* Generate */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#444" }}>ⓘ Returns 3–5 conversational reply options. Ctrl+Enter to generate.</span>
            <button onClick={generate} disabled={loading || !message.trim()} style={{ background: loading || !message.trim() ? "#1a1a1a" : "#e0e0e0", border: "1px solid " + (loading || !message.trim() ? "#2a2a2a" : "#e0e0e0"), color: loading || !message.trim() ? "#555" : "#000", borderRadius: "6px", padding: "10px 22px", cursor: loading || !message.trim() ? "not-allowed" : "pointer", fontSize: "12px", fontWeight: "600", fontFamily: "monospace", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s" }}>
              {loading ? (<><span style={{ width: "11px", height: "11px", border: "2px solid #33333388", borderTopColor: "#888", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />GENERATING...</>) : "✦ GENERATE REPLIES"}
            </button>
          </div>
          {error && <div style={{ marginTop: "10px", color: "#f87171", fontSize: "12px" }}>{error}</div>}
        </div>

        {/* Replies */}
        {displayedReplies.length > 0 && (
          <div style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", borderRadius: "10px", padding: "24px", animation: "fadeIn 0.3s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#666", letterSpacing: "1px" }}>SUGGESTED REPLIES ({displayedReplies.length})</span>
              <button onClick={generate} style={{ background: "none", border: "1px solid #2a2a2a", color: "#666", borderRadius: "4px", padding: "4px 12px", cursor: "pointer", fontSize: "11px", fontFamily: "monospace" }}>↺ REGENERATE</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {displayedReplies.map((reply, i) => (
                <div key={i} style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "7px", padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: "12px" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#2a2a2a"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#1e1e1e"}
                >
                  <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#444", minWidth: "18px", marginTop: "2px" }}>{i + 1}.</span>
                  <p style={{ flex: 1, fontSize: "14px", color: "#ccc", lineHeight: "1.6" }}>{reply}</p>
                  <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                    <button onClick={() => togglePin(reply)} style={{ background: pinned.includes(reply) ? "#1a1a0a" : "none", border: "1px solid " + (pinned.includes(reply) ? "#555" : "#2a2a2a"), color: pinned.includes(reply) ? "#dd4" : "#555", borderRadius: "4px", padding: "4px 8px", cursor: "pointer", fontSize: "13px" }}>☆</button>
                    <CopyBtn text={reply} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && displayedReplies.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#2a2a2a" }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>◻</div>
            <p style={{ fontSize: "13px", fontFamily: "monospace" }}>NO REPLIES GENERATED YET</p>
          </div>
        )}
      </div>
    </div>
  );
}
