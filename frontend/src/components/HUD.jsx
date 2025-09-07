import React from "react";

export default function HUD({ fps, rttMs, serverMs }) {
  const fpsClass = fps >= 4 ? "green" : fps >= 2 ? "amber" : "red";
  const box = {
    position: "absolute",
    top: 12,
    right: 12,
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    padding: "10px 12px",
    borderRadius: 8,
    fontFamily: "system-ui, sans-serif",
    fontSize: 12,
    lineHeight: 1.4,
    zIndex: 10,
    minWidth: 160
  };
  const dot = {
    display: "inline-block",
    width: 10, height: 10, borderRadius: "50%",
    marginRight: 6,
    background: fpsClass === "green" ? "#22c55e" : fpsClass === "amber" ? "#f59e0b" : "#ef4444"
  };
  const row = { display: "flex", justifyContent: "space-between", gap: 12, marginTop: 4 };

  return (
    <div style={box} aria-live="polite">
      <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
        <span style={dot} />
        <strong>Performance</strong>
      </div>
      <div style={row}><span>FPS</span><span>{fps.toFixed(1)}</span></div>
      <div style={row}><span>Client RTT</span><span>{Math.round(rttMs)} ms</span></div>
      <div style={row}><span>Server</span><span>{Math.round(serverMs)} ms</span></div>
    </div>
  );
}
