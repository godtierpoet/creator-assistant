// AIModelSelector.jsx — Production-ready AI model selector with tooltip
// Drop this into your App.jsx where you want the model selector to appear.
//
// Usage:
//   import AIModelSelector from "./AIModelSelector";
//   const [selectedModel, setSelectedModel] = useState("llama-4-maverick");
//   <AIModelSelector value={selectedModel} onChange={setSelectedModel} />

import { useCallback, useEffect, useRef, useState } from "react";
import { AI_MODELS, BADGE_STYLES } from "./modelData";
import ModelTooltip from "./ModelTooltip";

// ── Provider group order ──
const PROVIDER_ORDER = ["OpenAI", "Anthropic", "Google", "xAI", "Meta", "Mistral", "Cohere", "DeepSeek", "Alibaba", "Custom"];

function groupByProvider(models) {
  const map = {};
  for (const m of models) {
    if (!map[m.provider]) map[m.provider] = [];
    map[m.provider].push(m);
  }
  return PROVIDER_ORDER.filter(p => map[p]).map(p => ({ provider: p, models: map[p] }));
}

export default function AIModelSelector({ value, onChange, disabled = false }) {
  const [open, setOpen] = useState(false);
  const [hoveredModel, setHoveredModel] = useState(null);
  const [tooltipAnchor, setTooltipAnchor] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const hoverTimeout = useRef(null);

  const selectedModel = AI_MODELS.find(m => m.id === value) || AI_MODELS[0];
  const groups = groupByProvider(AI_MODELS);
  const flatModels = groups.flatMap(g => g.models);
  const badge = BADGE_STYLES[selectedModel.badge] || BADGE_STYLES.balanced;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setHoveredModel(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex(i => Math.min(i + 1, flatModels.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex(i => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && focusedIndex >= 0) {
        onChange(flatModels[focusedIndex].id);
        setOpen(false);
      } else if (e.key === "Escape") {
        setOpen(false);
        setFocusedIndex(-1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, focusedIndex, flatModels, onChange]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex < 0 || !dropdownRef.current) return;
    const items = dropdownRef.current.querySelectorAll("[data-model-item]");
    if (items[focusedIndex]) items[focusedIndex].scrollIntoView({ block: "nearest" });
  }, [focusedIndex]);

  const handleHoverEnter = useCallback((model, e) => {
    clearTimeout(hoverTimeout.current);
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredModel(model);
    setTooltipAnchor(rect);
  }, []);

  const handleHoverLeave = useCallback(() => {
    hoverTimeout.current = setTimeout(() => {
      setHoveredModel(null);
      setTooltipAnchor(null);
    }, 80);
  }, []);

  const handleSelect = useCallback((modelId) => {
    onChange(modelId);
    setOpen(false);
    setHoveredModel(null);
    setFocusedIndex(-1);
  }, [onChange]);

  return (
    <>
      <div ref={containerRef} style={{ position: "relative", userSelect: "none" }}>

        {/* Label */}
        <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#555", letterSpacing: "1px", marginBottom: "8px" }}>
          AI MODEL
        </div>

        {/* Trigger button */}
        <button
          onClick={() => !disabled && setOpen(o => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          disabled={disabled}
          style={{
            width: "100%",
            background: open ? "#141414" : "#0f0f0f",
            border: `1px solid ${open ? badge.border : "#1e1e1e"}`,
            borderRadius: "8px",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.5 : 1,
            transition: "all 0.2s ease",
            boxShadow: open ? `0 0 12px ${badge.border}33` : "none",
          }}
        >
          {/* Icon */}
          <span style={{ fontSize: "16px", flexShrink: 0 }}>{selectedModel.icon}</span>

          {/* Name + provider */}
          <div style={{ flex: 1, textAlign: "left", overflow: "hidden" }}>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: "700", fontSize: "13px", color: "#e0e0e0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {selectedModel.name}
            </div>
            <div style={{ fontSize: "10px", color: "#444", fontFamily: "monospace" }}>{selectedModel.provider}</div>
          </div>

          {/* Badge */}
          <span style={{
            background: badge.background,
            border: `1px solid ${badge.border}`,
            color: badge.color,
            fontSize: "9px",
            fontFamily: "monospace",
            letterSpacing: "1px",
            padding: "2px 7px",
            borderRadius: "4px",
            flexShrink: 0,
          }}>
            {selectedModel.badgeLabel.toUpperCase()}
          </span>

          {/* Chevron */}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease", opacity: 0.4 }}>
            <path d="M2 4l4 4 4-4" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Dropdown */}
        {open && (
          <div
            ref={dropdownRef}
            role="listbox"
            aria-label="Select AI Model"
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              right: 0,
              background: "rgba(10,10,10,0.98)",
              border: "1px solid #1e1e1e",
              borderRadius: "10px",
              overflow: "hidden",
              zIndex: 1000,
              maxHeight: "320px",
              overflowY: "auto",
              boxShadow: "0 16px 48px rgba(0,0,0,0.7)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              animation: "dropIn 0.15s ease",
            }}
          >
            <style>{`
              @keyframes dropIn {
                from { opacity: 0; transform: translateY(-6px); }
                to   { opacity: 1; transform: translateY(0); }
              }
              .model-item::-webkit-scrollbar { width: 3px; }
              .model-item::-webkit-scrollbar-thumb { background: #222; }
            `}</style>

            {groups.map(({ provider, models }) => (
              <div key={provider}>
                {/* Provider header */}
                <div style={{ padding: "8px 14px 4px", fontSize: "9px", color: "#3a3a3a", fontFamily: "monospace", letterSpacing: "2px", textTransform: "uppercase", borderTop: "1px solid #141414" }}>
                  {provider}
                </div>

                {models.map((model) => {
                  const flatIdx = flatModels.indexOf(model);
                  const isSelected = model.id === value;
                  const isFocused = focusedIndex === flatIdx;
                  const mb = BADGE_STYLES[model.badge] || BADGE_STYLES.balanced;

                  return (
                    <div
                      key={model.id}
                      data-model-item
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(model.id)}
                      onMouseEnter={(e) => { setFocusedIndex(flatIdx); handleHoverEnter(model, e); }}
                      onMouseLeave={handleHoverLeave}
                      style={{
                        padding: "9px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        cursor: "pointer",
                        background: isSelected ? "rgba(226,255,93,0.05)" : isFocused ? "rgba(255,255,255,0.03)" : "transparent",
                        borderLeft: isSelected ? "2px solid #e2ff5d" : "2px solid transparent",
                        transition: "all 0.1s ease",
                      }}
                    >
                      <span style={{ fontSize: "14px", flexShrink: 0 }}>{model.icon}</span>

                      <div style={{ flex: 1, overflow: "hidden" }}>
                        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: isSelected ? "700" : "600", fontSize: "12px", color: isSelected ? "#e2ff5d" : "#d0d0d0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {model.name}
                        </div>
                        <div style={{ fontSize: "10px", color: "#444", fontFamily: "monospace" }}>
                          {model.context} ctx · {model.cost === "Free" ? "Free" : model.cost}
                        </div>
                      </div>

                      {/* Speed dot */}
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                        <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: model.speedScore >= 8 ? "#4ade80" : model.speedScore >= 5 ? "#60a5fa" : "#f87171" }} />
                      </div>

                      {/* Badge pill */}
                      <span style={{
                        background: mb.background,
                        border: `1px solid ${mb.border}`,
                        color: mb.color,
                        fontSize: "9px",
                        fontFamily: "monospace",
                        padding: "2px 6px",
                        borderRadius: "3px",
                        flexShrink: 0,
                        letterSpacing: "0.5px",
                      }}>
                        {model.badgeLabel}
                      </span>

                      {isSelected && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                          <path d="M2 6l3 3 5-5" stroke="#e2ff5d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Portal tooltip */}
      <ModelTooltip
        model={hoveredModel}
        anchorRect={tooltipAnchor}
        visible={!!hoveredModel && open}
      />
    </>
  );
}
