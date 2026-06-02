// ModelTooltip.jsx — Floating tooltip card for AI model details

import { useEffect, useRef, useState } from "react";
import { BADGE_STYLES } from "./modelData";

function RatingBar({ value, max = 10, color = "#e2ff5d" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ flex: 1, height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${(value / max) * 100}%`,
          background: color,
          borderRadius: "2px",
          transition: "width 0.4s ease",
          boxShadow: `0 0 6px ${color}66`,
        }} />
      </div>
      <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#888", minWidth: "32px", textAlign: "right" }}>{value}/{max}</span>
    </div>
  );
}

function SpeedBar({ score }) {
  const color = score >= 8 ? "#4ade80" : score >= 5 ? "#60a5fa" : "#f87171";
  const label = score >= 9 ? "Very Fast" : score >= 7 ? "Fast" : score >= 5 ? "Medium" : "Slow";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ flex: 1, height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${score * 10}%`, background: color, borderRadius: "2px", boxShadow: `0 0 6px ${color}66` }} />
      </div>
      <span style={{ fontFamily: "monospace", fontSize: "11px", color, minWidth: "52px", textAlign: "right" }}>{label}</span>
    </div>
  );
}

function CostDots({ level }) {
  return (
    <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
      {[0, 1, 2, 3].map(i => (
        <div key={i} style={{
          width: "8px", height: "8px", borderRadius: "50%",
          background: i < level ? "#e2ff5d" : "rgba(255,255,255,0.08)",
          boxShadow: i < level ? "0 0 4px rgba(226,255,93,0.4)" : "none",
          transition: "all 0.2s",
        }} />
      ))}
      <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#666", marginLeft: "4px" }}>
        {level === 0 ? "Free" : level === 1 ? "Cheap" : level === 2 ? "Mid" : level === 3 ? "Pricey" : "Premium"}
      </span>
    </div>
  );
}

export default function ModelTooltip({ model, anchorRect, visible }) {
  const tooltipRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0, side: "right" });
  const badge = BADGE_STYLES[model.badge] || BADGE_STYLES.balanced;

  useEffect(() => {
    if (!visible || !anchorRect || !tooltipRef.current) return;
    const TW = 340;
    const TH = tooltipRef.current.offsetHeight || 500;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Horizontal: prefer right
    let left = anchorRect.right + 10;
    let side = "right";
    if (left + TW > vw - 12) {
      left = anchorRect.left - TW - 10;
      side = "left";
    }
    if (left < 8) left = 8;

    // Vertical: align to anchor top, clamp
    let top = anchorRect.top;
    if (top + TH > vh - 12) top = vh - TH - 12;
    if (top < 8) top = 8;

    setPos({ top, left, side });
  }, [visible, anchorRect]);

  if (!visible || !model) return null;

  return (
    <div
      ref={tooltipRef}
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        width: "340px",
        zIndex: 9999,
        background: "rgba(10,10,10,0.96)",
        border: `1px solid ${badge.border}`,
        borderRadius: "16px",
        padding: "20px",
        boxShadow: `0 8px 48px rgba(0,0,0,0.7), 0 0 24px ${badge.border}44`,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        animation: "tooltipIn 0.15s ease",
        pointerEvents: "none",
      }}
    >
      <style>{`
        @keyframes tooltipIn {
          from { opacity: 0; transform: scale(0.96) translateY(4px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "14px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ fontSize: "18px" }}>{model.icon}</span>
            <span style={{ fontFamily: "Syne, sans-serif", fontWeight: "800", fontSize: "16px", color: "#f0f0f0" }}>{model.name}</span>
          </div>
          <div style={{ fontSize: "11px", color: "#555", fontFamily: "monospace" }}>{model.provider}</div>
        </div>
        <div style={{
          background: badge.background,
          border: `1px solid ${badge.border}`,
          color: badge.color,
          fontSize: "10px",
          fontFamily: "monospace",
          letterSpacing: "1px",
          padding: "3px 8px",
          borderRadius: "6px",
          flexShrink: 0,
        }}>
          {model.badgeLabel.toUpperCase()}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "14px" }} />

      {/* Best For */}
      <div style={{ marginBottom: "14px" }}>
        <div style={{ fontSize: "10px", color: "#555", letterSpacing: "1px", fontFamily: "monospace", marginBottom: "5px" }}>BEST FOR</div>
        <div style={{ fontSize: "12px", color: "#aaa", lineHeight: "1.6" }}>{model.bestFor}</div>
      </div>

      {/* Strengths & Weaknesses */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
        <div>
          <div style={{ fontSize: "10px", color: "#4ade80", letterSpacing: "1px", fontFamily: "monospace", marginBottom: "6px" }}>STRENGTHS</div>
          {model.strengths.slice(0, 3).map((s, i) => (
            <div key={i} style={{ fontSize: "11px", color: "#888", marginBottom: "3px", display: "flex", gap: "5px", lineHeight: "1.5" }}>
              <span style={{ color: "#4ade80", flexShrink: 0 }}>✓</span>{s}
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: "10px", color: "#f87171", letterSpacing: "1px", fontFamily: "monospace", marginBottom: "6px" }}>WEAKNESSES</div>
          {model.weaknesses.slice(0, 3).map((w, i) => (
            <div key={i} style={{ fontSize: "11px", color: "#888", marginBottom: "3px", display: "flex", gap: "5px", lineHeight: "1.5" }}>
              <span style={{ color: "#f87171", flexShrink: 0 }}>✗</span>{w}
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "14px" }} />

      {/* Ratings */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ fontSize: "10px", color: "#555", fontFamily: "monospace", letterSpacing: "1px" }}>SPEED</span>
          </div>
          <SpeedBar score={model.speedScore} />
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ fontSize: "10px", color: "#555", fontFamily: "monospace", letterSpacing: "1px" }}>CREATIVITY</span>
          </div>
          <RatingBar value={model.creativity} color="#c084fc" />
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ fontSize: "10px", color: "#555", fontFamily: "monospace", letterSpacing: "1px" }}>ACCURACY</span>
          </div>
          <RatingBar value={model.accuracy} color="#60a5fa" />
        </div>
      </div>

      {/* Meta row */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px", gap: "8px" }}>
        <div>
          <div style={{ fontSize: "10px", color: "#555", fontFamily: "monospace", letterSpacing: "1px", marginBottom: "4px" }}>CONTEXT</div>
          <div style={{ fontFamily: "monospace", fontSize: "13px", color: "#e2ff5d", fontWeight: "700" }}>{model.context}</div>
        </div>
        <div>
          <div style={{ fontSize: "10px", color: "#555", fontFamily: "monospace", letterSpacing: "1px", marginBottom: "4px" }}>COST</div>
          <CostDots level={model.costLevel} />
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "12px" }} />

      {/* Recommended For */}
      <div>
        <div style={{ fontSize: "10px", color: "#555", letterSpacing: "1px", fontFamily: "monospace", marginBottom: "7px" }}>RECOMMENDED FOR</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          {model.recommendedFor.map((r, i) => (
            <span key={i} style={{
              background: "rgba(226,255,93,0.06)",
              border: "1px solid rgba(226,255,93,0.12)",
              color: "#e2ff5d",
              fontSize: "10px",
              padding: "3px 8px",
              borderRadius: "4px",
              fontFamily: "monospace",
            }}>
              {r}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
