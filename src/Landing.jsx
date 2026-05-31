import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#080808', color: '#f0f0f0', fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080808; }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade1 { animation: fadeUp 0.6s 0s ease both; }
        .fade2 { animation: fadeUp 0.6s 0.1s ease both; }
        .fade3 { animation: fadeUp 0.6s 0.2s ease both; }
        .fade4 { animation: fadeUp 0.6s 0.3s ease both; }
        .fade5 { animation: fadeUp 0.6s 0.4s ease both; }
        .btn-primary:hover { background: #b8d400 !important; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(226,255,93,0.2); }
        .btn-secondary:hover { border-color: #444 !important; color: #f0f0f0 !important; }
        .feature { background: #111; padding: 28px 24px; display: flex; flex-direction: column; gap: 8px; }
      `}</style>

      {/* Grid background */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(#1f1f1f 1px, transparent 1px), linear-gradient(90deg, #1f1f1f 1px, transparent 1px)', backgroundSize: '60px 60px', opacity: 0.4, pointerEvents: 'none', zIndex: 0 }} />

      {/* Glow */}
      <div style={{ position: 'fixed', top: '-200px', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '500px', background: 'radial-gradient(ellipse, rgba(226,255,93,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* NAV */}
      <nav style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', borderBottom: '1px solid #1f1f1f', background: 'rgba(8,8,8,0.8)', backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: '#e2ff5d', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '800', color: '#000' }}>✦</div>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '15px', color: '#f0f0f0' }}>CDO Boys</div>
            <div style={{ fontSize: '10px', color: '#666', letterSpacing: '2px', fontFamily: 'monospace' }}>CHATTER SYSTEM</div>
          </div>
        </div>
        <div style={{ background: '#111', border: '1px solid #1f1f1f', color: '#666', fontSize: '11px', padding: '6px 14px', borderRadius: '20px', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          llama-free · live
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', zIndex: 1, minHeight: 'calc(100vh - 73px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 24px' }}>

        <div className="fade1" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(226,255,93,0.08)', border: '1px solid rgba(226,255,93,0.2)', color: '#e2ff5d', fontSize: '12px', padding: '6px 16px', borderRadius: '20px', fontFamily: 'monospace', letterSpacing: '1px', marginBottom: '36px' }}>
          ✦ AI-POWERED REPLY GENERATOR
        </div>

        <h1 className="fade2" style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: 'clamp(42px, 8vw, 90px)', lineHeight: '1.0', color: '#f0f0f0', marginBottom: '12px' }}>
          Reply Like<br /><span style={{ color: '#e2ff5d' }}>Opaw. 😏</span>
        </h1>

        <p className="fade3" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#666', fontWeight: '300', maxWidth: '520px', lineHeight: '1.6', marginBottom: '48px' }}>
          Ang ultimate chatter assistant para sa mga OnlyFans creators. Generate og natural, human-like fan replies in seconds — libre gyud, forever.
        </p>

        <div className="fade4" style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => window.location.href = '/app'}
            className="btn-primary"
            style={{ background: '#e2ff5d', color: '#000', fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '15px', padding: '14px 32px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', letterSpacing: '0.5px' }}
          >
            Gamita Ko Kay Libre Rani 🤙
          </button>
          <a href="#features" className="btn-secondary" style={{ background: 'transparent', color: '#666', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', padding: '14px 24px', borderRadius: '8px', border: '1px solid #1f1f1f', cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}>
            Tan-awa unsa ni
          </a>
        </div>

        {/* FEATURES */}
        <div className="fade5" id="features" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1px', background: '#1f1f1f', borderRadius: '12px', overflow: 'hidden', marginTop: '60px', width: '100%', maxWidth: '900px' }}>
          {[
            { icon: '⚡', title: 'Instant Replies', desc: 'Generate 4 unique replies in under 2 seconds using Llama 3.3' },
            { icon: '🎭', title: '5 Tone Modes', desc: 'Flirty, Girlfriend, Teasing, Friendly, and Sales — pick your vibe' },
            { icon: '🟢', title: 'Live Presence', desc: 'Tan-awa kung kinsa ang online sa imong team in real time' },
            { icon: '🆓', title: 'Libre Gyud', desc: "Powered by Groq's free tier — walay bayad, walay limit" },
          ].map((f, i) => (
            <div key={i} className="feature">
              <div style={{ fontSize: '22px', marginBottom: '4px' }}>{f.icon}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '14px', color: '#f0f0f0' }}>{f.title}</div>
              <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.5' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '48px', justifyContent: 'center', flexWrap: 'wrap', padding: '48px 24px' }}>
        {[['4x','REPLIES PER GENERATE'], ['<2s','RESPONSE TIME'], ['5','TONE MODES'], ['∞','LIBRE FOREVER']].map(([num, label]) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '36px', color: '#e2ff5d' }}>{num}</div>
            <div style={{ fontSize: '12px', color: '#666', letterSpacing: '1px', fontFamily: 'monospace', marginTop: '4px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <footer style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '24px', borderTop: '1px solid #1f1f1f', fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>
        © 2026 CDO Boys Chatter System · Powered by Llama Free · Para sa mga creators sa CDO
      </footer>
    </div>
  )
}
