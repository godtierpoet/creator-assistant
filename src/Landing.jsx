import { useEffect, useRef } from "react";

export default function Landing() {
  return (
    <div style={{ background: '#080808', color: '#f0f0f0', fontFamily: 'DM Sans, sans-serif', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .btn-primary:hover { background: #b8d400 !important; transform: translateY(-2px); }
        .fade1{animation:fadeUp 0.6s ease forwards;}
        .fade2{animation:fadeUp 0.6s 0.15s ease both;}
        .fade3{animation:fadeUp 0.6s 0.3s ease both;}
        .fade4{animation:fadeUp 0.6s 0.45s ease both;}
      `}</style>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', borderBottom: '1px solid #1f1f1f', background: 'rgba(8,8,8,0.9)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: '#e2ff5d', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#000' }}>✦</div>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '15px' }}>CDO Boys</div>
            <div style={{ fontSize: '10px', color: '#666', letterSpacing: '2px' }}>CHATTER SYSTEM</div>
          </div>
        </div>
        <div style={{ background: '#111', border: '1px solid #1f1f1f', color: '#666', fontSize: '11px', padding: '6px 14px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          llama-free · live
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: 'calc(100vh - 73px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 24px' }}>
        <div className="fade1" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(226,255,93,0.08)', border: '1px solid rgba(226,255,93,0.2)', color: '#e2ff5d', fontSize: '12px', padding: '6px 16px', borderRadius: '20px', letterSpacing: '1px', marginBottom: '36px' }}>
          ✦ AI-POWERED REPLY GENERATOR
        </div>

        <h1 className="fade2" style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: 'clamp(42px, 8vw, 90px)', lineHeight: '1.0', color: '#f0f0f0', marginBottom: '12px' }}>
          Reply Like<br /><span style={{ color: '#e2ff5d' }}>Opaw. 😏</span>
        </h1>

        <p className="fade3" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#666', fontWeight: '300', maxWidth: '520px', lineHeight: '1.6', marginBottom: '48px' }}>
          Ang ultimate chatter assistant para sa mga OnlyFans creators. Generate og natural, human-like fan replies in seconds.
        </p>

        <div className="fade4" style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="#/app" className="btn-primary" style={{ background: '#e2ff5d', color: '#000', fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '15px', padding: '14px 32px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', textDecoration: 'none' }}>
            Gamita Ko Kay Libre Rani 🤙
          </a>
          <a href="#features" style={{ background: 'transparent', color: '#666', fontSize: '14px', padding: '14px 24px', borderRadius: '8px', border: '1px solid #1f1f1f', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', transition: 'all 0.2s' }}>
            Tan-awa unsa ni
          </a>
        </div>

        {/* FEATURES */}
        <div id="features" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1px', background: '#1f1f1f', borderRadius: '12px', overflow: 'hidden', marginTop: '60px', width: '100%', maxWidth: '900px' }}>
          {[
            { icon: '⚡', title: 'Instant Replies', desc: 'Generate 4 unique replies in under 2 seconds using Llama 3.3' },
            { icon: '🎭', title: '5 Tone Modes', desc: 'Flirty, Girlfriend, Teasing, Friendly, and Sales' },
            { icon: '🟢', title: 'Free Forever', desc: 'Powered by free Groq API — walay bayad, walay limit' },
            { icon: '🆓', title: 'No Login', desc: 'Open and use immediately, no account needed' },
          ].map((f, i) => (
            <div key={i} style={{ background: '#111', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '22px' }}>{f.icon}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '14px', color: '#f0f0f0' }}>{f.title}</div>
              <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.5' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CEO SECTION */}
      <section style={{ padding: '80px 24px', borderTop: '1px solid #1f1f1f', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: '10px', color: '#555', letterSpacing: '3px', fontFamily: 'monospace', marginBottom: '32px' }}>◉ BEHIND THE SYSTEM</div>
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: '2px solid #e2ff5d', padding: '3px', display: 'inline-block' }}>
            <img src="/sean.png" alt="Sean Bunot Lubi" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div style={{ position: 'absolute', bottom: '4px', right: '4px', width: '14px', height: '14px', borderRadius: '50%', background: '#4ade80', border: '2px solid #080808' }} />
        </div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '22px', color: '#f0f0f0', marginBottom: '4px' }}>Sean Bunot Lubi</div>
        <div style={{ fontSize: '11px', color: '#e2ff5d', letterSpacing: '2px', fontFamily: 'monospace', marginBottom: '12px' }}>FOUNDER & CEO</div>
        <p style={{ fontSize: '14px', color: '#555', maxWidth: '400px', lineHeight: '1.7' }}>
          Built this tool for the CDO Boys team. Libre, fast, and made with love para sa atong mga chatter. 🤙
        </p>
      </section>

      <footer style={{ textAlign: 'center', padding: '24px', borderTop: '1px solid #1f1f1f', fontSize: '12px', color: '#666' }}>
        2026 CDO Boys Chatter System · Powered by Llama Free
      </footer>
    </div>
  )
}