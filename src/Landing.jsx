import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

const TEAM = [
  {
    name: "Sean Bunot Lubi",
    role: "CEO & Founder",
    img: "/sean.png",
    bio: "Visionary entrepreneur leading the future of creator communication through AI-powered engagement systems.",
    accent: "#e2ff5d",
  },
  {
    name: "Eddy Protototot",
    role: "Head of Operations",
    img: "/1780419858328_image.png",
    bio: "Specializes in scaling creator businesses, optimizing workflows, and building sustainable growth systems.",
    accent: "#5dffd3",
  },
  {
    name: "James Sy",
    role: "Lead AI Engineer",
    img: "/1780419892890_image.png",
    bio: "Architect of the intelligent reply engine, focused on natural conversations and real-time automation.",
    accent: "#ff5de2",
  },
];

const STATS = [
  { display: "10K+", label: "Replies Generated" },
  { display: "500+", label: "Active Creators" },
  { display: "99.9%", label: "Uptime" },
  { display: "24/7", label: "AI Availability" },
];

const FEATURES = [
  { icon: "⚡", title: "Instant Replies", desc: "Generate 4 unique replies in under 2 seconds using Llama 3.3" },
  { icon: "🎭", title: "5 Tone Modes", desc: "Flirty, Girlfriend, Teasing, Friendly, and Sales — pick your vibe" },
  { icon: "🟢", title: "Live Presence", desc: "Tan-awa kung kinsa ang online sa imong team in real time" },
  { icon: "🆓", title: "Libre Gyud", desc: "Powered by Groq's free tier — walay bayad, walay limit" },
];

function TeamCard({ member, delay }) {
  const [ref, inView] = useInView(0.1);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? (hovered ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)") : "translateY(40px)",
        transition: `opacity 0.7s ${delay}s ease, transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease`,
        background: "rgba(255,255,255,0.025)",
        border: `1px solid ${hovered ? member.accent + "55" : "rgba(255,255,255,0.06)"}`,
        borderRadius: "24px",
        padding: "36px 28px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "16px",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: hovered
          ? `0 0 40px ${member.accent}18, 0 16px 48px rgba(0,0,0,0.5)`
          : "0 4px 24px rgba(0,0,0,0.3)",
        cursor: "default",
      }}
    >
      <div style={{
        width: "96px", height: "96px", borderRadius: "50%",
        border: `2px solid ${hovered ? member.accent : "rgba(255,255,255,0.08)"}`,
        padding: "3px",
        transition: "border-color 0.4s ease",
        overflow: "hidden",
        flexShrink: 0,
        background: "#111",
      }}>
        <img
          src={member.img}
          alt={member.name}
          style={{
            width: "100%", height: "100%", borderRadius: "50%",
            objectFit: "cover", display: "block",
            transform: hovered ? "scale(1.12)" : "scale(1)",
            transition: "transform 0.4s ease",
          }}
        />
      </div>

      <div>
        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: "800", fontSize: "17px", color: "#f0f0f0", marginBottom: "4px" }}>{member.name}</div>
        <div style={{ fontSize: "10px", color: member.accent, letterSpacing: "2px", fontFamily: "monospace", marginBottom: "14px" }}>{member.role.toUpperCase()}</div>
        <p style={{ fontSize: "13px", color: "#666", lineHeight: "1.75", maxWidth: "240px" }}>{member.bio}</p>
      </div>

      <div style={{
        width: "6px", height: "6px", borderRadius: "50%",
        background: member.accent,
        opacity: hovered ? 1 : 0.25,
        transition: "opacity 0.4s ease",
        boxShadow: hovered ? `0 0 10px ${member.accent}` : "none",
      }} />
    </div>
  );
}

function StatItem({ stat, delay }) {
  const [ref, inView] = useInView(0.2);
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(16px)",
      transition: `opacity 0.6s ${delay}s ease, transform 0.6s ${delay}s ease`,
      textAlign: "center", padding: "36px 20px", flex: 1, minWidth: "130px",
    }}>
      <div style={{ fontFamily: "Syne, sans-serif", fontWeight: "800", fontSize: "clamp(28px, 4vw, 40px)", color: "#e2ff5d", marginBottom: "6px", letterSpacing: "-1px" }}>
        {stat.display}
      </div>
      <div style={{ fontSize: "11px", color: "#444", letterSpacing: "1px", fontFamily: "monospace", textTransform: "uppercase" }}>{stat.label}</div>
    </div>
  );
}

function SectionHeader() {
  const [ref, inView] = useInView(0.1);
  return (
    <div ref={ref} style={{ textAlign: "center", marginBottom: "64px", opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s ease" }}>
      <div style={{ fontSize: "10px", color: "#555", letterSpacing: "3px", fontFamily: "monospace", marginBottom: "16px" }}>◉ THE PEOPLE BEHIND CDO BOYS</div>
      <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: "800", fontSize: "clamp(28px, 5vw, 52px)", color: "#f0f0f0", marginBottom: "14px", lineHeight: "1.1" }}>
        Meet The <span style={{ color: "#e2ff5d" }}>Team</span>
      </h2>
      <p style={{ fontSize: "15px", color: "#555", maxWidth: "400px", margin: "0 auto", lineHeight: "1.7" }}>
        Building the next generation of AI-powered creator tools.
      </p>
    </div>
  );
}

function FounderNote() {
  const [ref, inView] = useInView(0.1);
  return (
    <section ref={ref} style={{
      padding: "60px 24px 100px", display: "flex", flexDirection: "column",
      alignItems: "center", textAlign: "center", borderTop: "1px solid #1a1a1a",
      position: "relative", zIndex: 1,
      opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)",
      transition: "all 0.7s ease",
    }}>
      <div style={{ fontSize: "10px", color: "#555", letterSpacing: "3px", fontFamily: "monospace", marginBottom: "32px" }}>◉ FOUNDER'S NOTE</div>
      <div style={{ maxWidth: "540px", background: "rgba(226,255,93,0.03)", border: "1px solid rgba(226,255,93,0.1)", borderRadius: "20px", padding: "40px 32px" }}>
        <div style={{ width: "72px", height: "72px", borderRadius: "50%", border: "2px solid rgba(226,255,93,0.35)", padding: "3px", margin: "0 auto 20px", overflow: "hidden", background: "#111" }}>
          <img src="/sean.png" alt="Sean" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
        </div>
        <p style={{ fontSize: "15px", color: "#777", lineHeight: "1.85", fontStyle: "italic", marginBottom: "24px" }}>
          "Built this tool for the CDO Boys team. Libre, fast, and made with love para sa atong mga chatter. Mao ni ang among kontribusyon sa creator economy. 🤙"
        </p>
        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: "700", fontSize: "15px", color: "#f0f0f0" }}>Sean Bunot Lubi</div>
        <div style={{ fontSize: "10px", color: "#e2ff5d", letterSpacing: "2px", fontFamily: "monospace", marginTop: "5px" }}>CEO & FOUNDER</div>
      </div>
    </section>
  );
}

export default function Landing() {
  const [heroRef, heroIn] = useInView(0.1);

  return (
    <div style={{ background: "#080808", color: "#f0f0f0", fontFamily: "DM Sans, sans-serif", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .btn-cta:hover { background: #b8d400 !important; transform: translateY(-3px) !important; box-shadow: 0 10px 28px rgba(226,255,93,0.35) !important; }
        .btn-ghost:hover { border-color: #2a2a2a !important; color: #aaa !important; transform: translateY(-2px) !important; }
        .nav-link:hover { color: #e2ff5d !important; }
        .feat-card:hover { border-color: rgba(226,255,93,0.15) !important; background: #121212 !important; }
      `}</style>

      {/* Ambient glow blobs */}
      <div style={{ position: "fixed", top: "8%", right: "4%", width: "360px", height: "360px", borderRadius: "50%", background: "radial-gradient(circle, rgba(226,255,93,0.045) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0, animation: "float 9s ease-in-out infinite" }} />
      <div style={{ position: "fixed", bottom: "15%", left: "2%", width: "260px", height: "260px", borderRadius: "50%", background: "radial-gradient(circle, rgba(93,255,211,0.03) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0, animation: "float 13s ease-in-out infinite reverse" }} />

      {/* ── NAV ── */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 40px", borderBottom: "1px solid #151515", background: "rgba(8,8,8,0.92)", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(16px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", background: "#e2ff5d", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", color: "#000", fontSize: "16px" }}>✦</div>
          <div>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: "700", fontSize: "15px" }}>CDO Boys</div>
            <div style={{ fontSize: "10px", color: "#444", letterSpacing: "2px" }}>CHATTER SYSTEM</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <a href="#features" className="nav-link" style={{ fontSize: "13px", color: "#555", textDecoration: "none", transition: "color 0.2s" }}>Features</a>
          <a href="#team" className="nav-link" style={{ fontSize: "13px", color: "#555", textDecoration: "none", transition: "color 0.2s" }}>Team</a>
          <div style={{ background: "#0f0f0f", border: "1px solid #1a1a1a", color: "#555", fontSize: "11px", padding: "6px 14px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", display: "inline-block", animation: "pulse 2s infinite" }} />
            llama-free · live
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{ minHeight: "calc(100vh - 65px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 24px 60px", position: "relative", zIndex: 1 }}>

        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(226,255,93,0.06)", border: "1px solid rgba(226,255,93,0.15)", color: "#e2ff5d", fontSize: "11px", padding: "7px 18px", borderRadius: "20px", letterSpacing: "2px", marginBottom: "40px", opacity: heroIn ? 1 : 0, transform: heroIn ? "translateY(0)" : "translateY(20px)", transition: "all 0.6s ease" }}>
          ✦ AI-POWERED REPLY GENERATOR
        </div>

        <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: "800", fontSize: "clamp(44px, 9vw, 100px)", lineHeight: "0.97", color: "#f0f0f0", marginBottom: "20px", opacity: heroIn ? 1 : 0, transform: heroIn ? "translateY(0)" : "translateY(28px)", transition: "all 0.7s 0.1s ease" }}>
          Reply Like<br /><span style={{ color: "#e2ff5d", textShadow: "0 0 50px rgba(226,255,93,0.2)" }}>Opaw. 😏</span>
        </h1>

        <p style={{ fontSize: "clamp(15px, 2vw, 19px)", color: "#555", fontWeight: "300", maxWidth: "520px", lineHeight: "1.75", marginBottom: "52px", opacity: heroIn ? 1 : 0, transform: heroIn ? "translateY(0)" : "translateY(28px)", transition: "all 0.7s 0.2s ease" }}>
          Ang ultimate chatter assistant para sa mga OnlyFans creators. Generate og natural, human-like fan replies in seconds — libre gyud, forever.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap", justifyContent: "center", marginBottom: "72px", opacity: heroIn ? 1 : 0, transform: heroIn ? "translateY(0)" : "translateY(28px)", transition: "all 0.7s 0.3s ease" }}>
          <a href="#/app" className="btn-cta" style={{ background: "#e2ff5d", color: "#000", fontFamily: "Syne, sans-serif", fontWeight: "700", fontSize: "15px", padding: "15px 34px", borderRadius: "10px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none", transition: "all 0.2s ease", boxShadow: "0 4px 20px rgba(226,255,93,0.18)" }}>
            Gamita Ko Kay Libre Rani 🤙
          </a>
          <a href="#features" className="btn-ghost" style={{ background: "transparent", color: "#555", fontSize: "14px", padding: "15px 26px", borderRadius: "10px", border: "1px solid #1e1e1e", textDecoration: "none", display: "inline-flex", alignItems: "center", transition: "all 0.2s ease" }}>
            Tan-awa unsa ni ↓
          </a>
        </div>

        {/* Features grid */}
        <div id="features" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1px", background: "#141414", borderRadius: "16px", overflow: "hidden", width: "100%", maxWidth: "940px", border: "1px solid #181818", opacity: heroIn ? 1 : 0, transition: "opacity 0.9s 0.45s ease" }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="feat-card" style={{ background: "#0d0d0d", padding: "30px 24px", display: "flex", flexDirection: "column", gap: "10px", transition: "all 0.2s ease", border: "1px solid transparent" }}>
              <div style={{ fontSize: "22px" }}>{f.icon}</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: "700", fontSize: "14px", color: "#e0e0e0" }}>{f.title}</div>
              <div style={{ fontSize: "12px", color: "#555", lineHeight: "1.65" }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ borderTop: "1px solid #141414", borderBottom: "1px solid #141414", background: "#090909", padding: "0 24px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "880px", margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-around" }}>
          {STATS.map((stat, i) => (
            <StatItem key={i} stat={stat} delay={i * 0.1} />
          ))}
        </div>
      </section>

      {/* ── TEAM ── */}
      <section id="team" style={{ padding: "100px 24px 80px", position: "relative", zIndex: 1 }}>
        <SectionHeader />
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
          gap: "20px",
          maxWidth: "980px",
          margin: "0 auto",
        }}>
          {TEAM.map((member, i) => (
            <TeamCard key={i} member={member} delay={i * 0.15} />
          ))}
        </div>
      </section>

      {/* ── FOUNDER NOTE ── */}
      <FounderNote />

      {/* ── FOOTER ── */}
      <footer style={{ textAlign: "center", padding: "28px 24px", borderTop: "1px solid #111", fontSize: "12px", color: "#2a2a2a", fontFamily: "monospace", letterSpacing: "1px" }}>
        © 2026 CDO Boys Chatter System · Powered by Llama Free · Para sa mga creators sa CDO
      </footer>
    </div>
  );
}
