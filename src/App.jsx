import { useState, useRef, useEffect, useCallback } from "react";

const TONES = [
  { id: "flirty", label: "💋 Flirty", color: "#FF7EB6", desc: "Seductive, playful, teasing energy" },
  { id: "girlfriend", label: "🥰 GF Vibe", color: "#FF9ECD", desc: "Warm, intimate, caring" },
  { id: "teasing", label: "😈 Teasing", color: "#C084FC", desc: "Playful tease, keep them wanting more" },
  { id: "friendly", label: "😊 Friendly", color: "#67E8F9", desc: "Warm, casual, approachable" },
  { id: "sales", label: "💰 Sales/Upsell", color: "#86EFAC", desc: "Entice them to subscribe or buy" },
];

const TONE_PROMPTS = {
  flirty: "Generate 4 flirty, seductive, playful replies. Be suggestive but classy. Use a teasing, confident tone that makes the fan feel special and intrigued.",
  girlfriend: "Generate 4 warm, girlfriend-vibe replies. Sound intimate, caring, and personal — like you're their special someone. Make them feel loved and valued.",
  teasing: "Generate 4 playful teasing replies. Keep them on the edge, wanting more. Be witty and fun. Don't give too much away.",
  friendly: "Generate 4 friendly, casual, warm replies. Sound like a real person having a fun conversation. Be approachable and genuine.",
  sales: "Generate 4 replies that naturally upsell content or subscriptions. Be enticing without being pushy. Create FOMO and desire. Mention exclusive content naturally.",
};

const SYSTEM_PROMPT = `You are a professional OnlyFans chatter assistant helping creators craft natural, engaging, human-like replies to fan messages.

RULES:
- Each reply must feel unique and natural, never robotic or repetitive
- Vary sentence structure, length, and vocabulary across all replies
- Sound like a real person, not an AI
- No filler phrases like "Absolutely!", "Of course!", "Great question!"
- Detect the fan's emotional tone and match/complement it
- Each reply on a NEW LINE starting with a number and period (1. 2. 3. 4.)
- Keep replies 1-3 sentences max unless the tone calls for more
- NEVER use emojis unless the fan used them first
- Be creative and varied — each reply should take a different angle
- Return ONLY the numbered replies, no intro or explanation text`;

function buildPrompt(fanMessage, tone) {
  return `Fan message: "${fanMessage}"

Tone instruction: ${TONE_PROMPTS[tone]}

Detected fan emotional vibe: analyze the message and match the energy appropriately.

${SYSTEM_PROMPT}`;
}

function parseReplies(text) {
  const lines = text.split("\n").filter(l => l.trim());
  const replies = [];
  for (const line of lines) {
    const match = line.match(/^\d+[\.\)]\s*(.+)/);
    if (match) replies.push(match[1].trim());
  }
  return replies.length > 0 ? replies : [text.trim()];
}

function CopiedToast({ show }) {
  return (
    <span style={{
      position: "absolute", top: "-32px", left: "50%", transform: "translateX(-50%)",
      background: "#1a1a2e", color: "#86EFAC", fontSize: "11px", padding: "4px 10px",
      borderRadius: "6px", border: "1px solid #86EFAC44", whiteSpace: "nowrap",
      opacity: show ? 1 : 0, transition: "opacity 0.3s", pointerEvents: "none",
      zIndex: 10
    }}>Copied!</span>
  );
}

function ReplyCard({ reply, index, isFavorite, onFavorite }) {
  const [copied, setCopied] = useState(false);
  const [hovering, setHovering] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        background: hovering ? "#252535" : "#1E1E2E",
        border: "1px solid #2A2A3E",
        borderRadius: "12px",
        padding: "14px 16px",
        marginBottom: "10px",
        transition: "all 0.2s ease",
        transform: hovering ? "translateY(-1px)" : "none",
        boxShadow: hovering ? "0 4px 20px rgba(76,154,255,0.08)" : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
        <span style={{
          background: "#4C9AFF22", color: "#4C9AFF", fontSize: "11px",
          fontWeight: "600", padding: "2px 8px", borderRadius: "20px",
          minWidth: "28px", textAlign: "center", marginTop: "1px", flexShrink: 0
        }}>{index + 1}</span>
        <p style={{
          color: "#E5E5E5", fontSize: "14px", lineHeight: "1.6",
          margin: 0, flex: 1, fontFamily: "'DM Sans', sans-serif"
        }}>{reply}</p>
        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
          <button
            onClick={onFavorite}
            title="Save to favorites"
            style={{
              background: isFavorite ? "#FF7EB622" : "transparent",
              border: "1px solid " + (isFavorite ? "#FF7EB6" : "#333"),
              color: isFavorite ? "#FF7EB6" : "#666",
              borderRadius: "8px", padding: "5px 8px", cursor: "pointer",
              fontSize: "13px", transition: "all 0.2s"
            }}
          >♥</button>
          <div style={{ position: "relative" }}>
            <CopiedToast show={copied} />
            <button
              onClick={handleCopy}
              title="Copy reply (C)"
              style={{
                background: copied ? "#86EFAC22" : "#4C9AFF22",
                border: "1px solid " + (copied ? "#86EFAC" : "#4C9AFF44"),
                color: copied ? "#86EFAC" : "#4C9AFF",
                borderRadius: "8px", padding: "5px 12px", cursor: "pointer",
                fontSize: "12px", fontWeight: "600", transition: "all 0.2s",
                fontFamily: "'DM Sans', sans-serif"
              }}
            >{copied ? "✓" : "Copy"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HistoryItem({ item, onSelect }) {
  return (
    <div
      onClick={() => onSelect(item)}
      style={{
        padding: "10px 12px", borderRadius: "8px", cursor: "pointer",
        background: "#1A1A2A", border: "1px solid #2A2A3E",
        marginBottom: "6px", transition: "all 0.15s"
      }}
      onMouseEnter={e => e.currentTarget.style.background = "#252535"}
      onMouseLeave={e => e.currentTarget.style.background = "#1A1A2A"}
    >
      <p style={{
        color: "#999", fontSize: "11px", margin: "0 0 3px",
        textTransform: "uppercase", letterSpacing: "0.5px"
      }}>{item.tone} · {new Date(item.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
      <p style={{
        color: "#C0C0D0", fontSize: "13px", margin: 0,
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
      }}>{item.message}</p>
    </div>
  );
}

export default function CreatorAssistant() {
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState("flirty");
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ca_history") || "[]"); } catch { return []; }
  });
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ca_favorites") || "[]"); } catch { return []; }
  });
  const [favReplies, setFavReplies] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ca_fav_replies") || "[]"); } catch { return []; }
  });
  const [sidebarTab, setSidebarTab] = useState("history");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const textareaRef = useRef();

  useEffect(() => {
    localStorage.setItem("ca_history", JSON.stringify(history.slice(0, 50)));
  }, [history]);
  useEffect(() => {
    localStorage.setItem("ca_favorites", JSON.stringify(favorites));
  }, [favorites]);
  useEffect(() => {
    localStorage.setItem("ca_fav_replies", JSON.stringify(favReplies.slice(0, 50)));
  }, [favReplies]);

  const generate = useCallback(async (msg, t) => {
    const m = (msg || message).trim();
    const to = t || tone;
    if (!m) { setError("Paste a fan message first!"); return; }
    setLoading(true);
    setError("");
    setReplies([]);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: buildPrompt(m, to) }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(c => c.text || "").join("") || "";
      const parsed = parseReplies(text);
      setReplies(parsed);
      const entry = { message: m, tone: to, replies: parsed, ts: Date.now(), id: Date.now() };
      setHistory(h => [entry, ...h.filter(x => x.id !== entry.id)]);
    } catch (e) {
      setError("Generation failed. Please try again.");
    }
    setLoading(false);
  }, [message, tone]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") generate();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [generate]);

  const toggleFavReply = (reply) => {
    setFavReplies(prev =>
      prev.includes(reply) ? prev.filter(r => r !== reply) : [reply, ...prev]
    );
  };

  const toneObj = TONES.find(t => t.id === tone);

  return (
    <div style={{
      display: "flex", height: "100vh", background: "#0F0F1A",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif", overflow: "hidden",
      color: "#E5E5E5"
    }}>
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2A2A3E; border-radius: 4px; }
        textarea:focus { outline: none; }
        * { box-sizing: border-box; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes slideUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>

      {/* SIDEBAR */}
      {sidebarOpen && (
        <div style={{
          width: "260px", minWidth: "260px", background: "#12121F",
          borderRight: "1px solid #1E1E2E", display: "flex", flexDirection: "column",
          transition: "all 0.3s"
        }}>
          <div style={{ padding: "18px 16px 12px", borderBottom: "1px solid #1E1E2E" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "8px",
                background: "linear-gradient(135deg, #FF7EB6, #4C9AFF)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px"
              }}>✨</div>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", fontWeight: "700", color: "#fff" }}>
                Creator Assistant
              </span>
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
              {["history", "favorites"].map(tab => (
                <button key={tab} onClick={() => setSidebarTab(tab)} style={{
                  flex: 1, padding: "6px 0", borderRadius: "7px", fontSize: "12px",
                  fontWeight: "500", cursor: "pointer", border: "none", transition: "all 0.2s",
                  background: sidebarTab === tab ? "#4C9AFF22" : "transparent",
                  color: sidebarTab === tab ? "#4C9AFF" : "#666",
                  borderBottom: sidebarTab === tab ? "2px solid #4C9AFF" : "2px solid transparent"
                }}>
                  {tab === "history" ? "📋 History" : "♥ Saved"}
                </button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px" }}>
            {sidebarTab === "history" && (
              history.length === 0
                ? <p style={{ color: "#444", fontSize: "13px", textAlign: "center", marginTop: "40px" }}>No history yet</p>
                : history.map(item => (
                  <HistoryItem key={item.id} item={item} onSelect={h => {
                    setMessage(h.message);
                    setTone(h.tone);
                    setReplies(h.replies);
                  }} />
                ))
            )}
            {sidebarTab === "favorites" && (
              favReplies.length === 0
                ? <p style={{ color: "#444", fontSize: "13px", textAlign: "center", marginTop: "40px" }}>No saved replies yet</p>
                : favReplies.map((r, i) => (
                  <div key={i} style={{
                    padding: "10px 12px", borderRadius: "8px",
                    background: "#1A1A2A", border: "1px solid #2A2A3E", marginBottom: "6px"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                      <p style={{ color: "#C0C0D0", fontSize: "13px", margin: 0, flex: 1, lineHeight: "1.5" }}>{r}</p>
                      <button onClick={() => {
                        navigator.clipboard.writeText(r);
                      }} style={{
                        background: "#4C9AFF22", border: "1px solid #4C9AFF44",
                        color: "#4C9AFF", borderRadius: "6px", padding: "3px 8px",
                        cursor: "pointer", fontSize: "11px", flexShrink: 0
                      }}>Copy</button>
                    </div>
                  </div>
                ))
            )}
          </div>
          <div style={{ padding: "10px 12px", borderTop: "1px solid #1E1E2E" }}>
            <p style={{ color: "#333", fontSize: "11px", textAlign: "center", margin: 0 }}>
              Side assistant tool · Copy & paste manually
            </p>
          </div>
        </div>
      )}

      {/* MAIN AREA */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* TOPBAR */}
        <div style={{
          padding: "12px 20px", borderBottom: "1px solid #1E1E2E",
          display: "flex", alignItems: "center", gap: "12px",
          background: "#0F0F1A"
        }}>
          <button onClick={() => setSidebarOpen(s => !s)} style={{
            background: "#1E1E2E", border: "1px solid #2A2A3E", color: "#888",
            borderRadius: "8px", padding: "6px 10px", cursor: "pointer", fontSize: "14px"
          }}>☰</button>
          <div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: "700",
              margin: 0, color: "#fff", letterSpacing: "0.3px"
            }}>Reply Generator</h1>
            <p style={{ margin: 0, fontSize: "11px", color: "#555" }}>
              Ctrl+Enter to generate · Click copy to paste in CreatorHero
            </p>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: "6px", alignItems: "center" }}>
            <span style={{
              background: "#86EFAC22", color: "#86EFAC", fontSize: "11px",
              padding: "3px 10px", borderRadius: "20px", border: "1px solid #86EFAC33"
            }}>● Live</span>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* TONE SELECTOR */}
          <div>
            <p style={{ color: "#777", fontSize: "12px", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.8px" }}>
              Select Tone
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {TONES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  style={{
                    padding: "8px 14px", borderRadius: "10px", cursor: "pointer",
                    fontSize: "13px", fontWeight: "500", transition: "all 0.2s",
                    border: tone === t.id ? `1px solid ${t.color}` : "1px solid #2A2A3E",
                    background: tone === t.id ? `${t.color}15` : "#1A1A2A",
                    color: tone === t.id ? t.color : "#888",
                    transform: tone === t.id ? "translateY(-1px)" : "none",
                    boxShadow: tone === t.id ? `0 0 12px ${t.color}22` : "none"
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {toneObj && (
              <p style={{ color: "#555", fontSize: "12px", margin: "6px 0 0", fontStyle: "italic" }}>
                {toneObj.desc}
              </p>
            )}
          </div>

          {/* FAN MESSAGE INPUT */}
          <div>
            <p style={{ color: "#777", fontSize: "12px", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.8px" }}>
              Fan Message
            </p>
            <div style={{
              background: "#1A1A2A", border: "1px solid #2A2A3E",
              borderRadius: "12px", padding: "4px",
              transition: "border-color 0.2s"
            }}>
              <textarea
                ref={textareaRef}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Paste the fan's message here..."
                rows={4}
                style={{
                  width: "100%", background: "transparent", border: "none",
                  color: "#E5E5E5", fontSize: "14px", lineHeight: "1.6",
                  resize: "vertical", padding: "10px 12px",
                  fontFamily: "'DM Sans', sans-serif", minHeight: "90px"
                }}
              />
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "6px 10px 8px", borderTop: "1px solid #1E1E2E"
              }}>
                <span style={{ color: "#444", fontSize: "12px" }}>
                  {message.length > 0 ? `${message.length} chars` : "Paste fan message above"}
                </span>
                <div style={{ display: "flex", gap: "8px" }}>
                  {message && (
                    <button
                      onClick={() => { setMessage(""); setReplies([]); setError(""); textareaRef.current?.focus(); }}
                      style={{
                        background: "transparent", border: "1px solid #333", color: "#666",
                        borderRadius: "7px", padding: "5px 10px", cursor: "pointer", fontSize: "12px"
                      }}
                    >Clear</button>
                  )}
                  <button
                    onClick={() => generate()}
                    disabled={loading || !message.trim()}
                    style={{
                      background: loading ? "#1E1E2E" : "linear-gradient(135deg, #4C9AFF, #7C3AFF)",
                      border: "none", color: "#fff", borderRadius: "8px",
                      padding: "7px 18px", cursor: loading || !message.trim() ? "not-allowed" : "pointer",
                      fontSize: "13px", fontWeight: "600", transition: "all 0.2s",
                      opacity: !message.trim() ? 0.5 : 1,
                      display: "flex", alignItems: "center", gap: "6px"
                    }}
                  >
                    {loading ? (
                      <>
                        <span style={{ width: "12px", height: "12px", border: "2px solid #ffffff44", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                        Generating...
                      </>
                    ) : "✨ Generate Replies"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div style={{
              background: "#FF4C4C15", border: "1px solid #FF4C4C44", borderRadius: "10px",
              padding: "10px 14px", color: "#FF7070", fontSize: "13px"
            }}>{error}</div>
          )}

          {/* LOADING SKELETON */}
          {loading && (
            <div>
              <p style={{ color: "#777", fontSize: "12px", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                Generating Replies...
              </p>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{
                  background: "#1E1E2E", borderRadius: "12px", padding: "14px 16px",
                  marginBottom: "10px", animation: "pulse 1.5s ease-in-out infinite",
                  animationDelay: `${i * 0.1}s`
                }}>
                  <div style={{ height: "12px", background: "#2A2A3E", borderRadius: "6px", width: `${65 + i * 8}%` }} />
                  <div style={{ height: "12px", background: "#2A2A3E", borderRadius: "6px", width: "45%", marginTop: "8px" }} />
                </div>
              ))}
            </div>
          )}

          {/* REPLIES */}
          {!loading && replies.length > 0 && (
            <div style={{ animation: "slideUp 0.3s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <p style={{ color: "#777", fontSize: "12px", margin: 0, textTransform: "uppercase", letterSpacing: "0.8px" }}>
                  {replies.length} Replies · {toneObj?.label}
                </p>
                <button
                  onClick={() => generate()}
                  style={{
                    background: "transparent", border: "1px solid #2A2A3E",
                    color: "#666", borderRadius: "7px", padding: "4px 12px",
                    cursor: "pointer", fontSize: "12px", transition: "all 0.2s"
                  }}
                  onMouseEnter={e => { e.target.style.color = "#4C9AFF"; e.target.style.borderColor = "#4C9AFF44"; }}
                  onMouseLeave={e => { e.target.style.color = "#666"; e.target.style.borderColor = "#2A2A3E"; }}
                >↻ Regenerate</button>
              </div>
              {replies.map((reply, i) => (
                <ReplyCard
                  key={i}
                  index={i}
                  reply={reply}
                  isFavorite={favReplies.includes(reply)}
                  onFavorite={() => toggleFavReply(reply)}
                />
              ))}
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && replies.length === 0 && !error && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#333" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>💬</div>
              <p style={{ fontSize: "15px", color: "#444", margin: "0 0 6px" }}>Ready to generate replies</p>
              <p style={{ fontSize: "13px", color: "#333", margin: 0 }}>
                Paste a fan message, choose a tone, and hit Generate
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
