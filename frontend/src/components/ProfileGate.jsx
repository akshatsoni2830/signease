import React, { useEffect, useState } from "react";
import { Store } from "../lib/store";

const COLORS = ["#3b82f6","#22c55e","#f59e0b","#ef4444","#a855f7","#06b6d4"];

export default function ProfileGate({ onReady }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);

  useEffect(() => { (async () => {
    const p = await Store.getProfile();
    if (p) onReady(p);
  })(); }, [onReady]);

  const create = async () => {
    const profile = {
      id: crypto.randomUUID(),
      name: name.trim() || "Guest",
      color,
      createdAt: Date.now(),
    };
    await Store.setProfile(profile);
    onReady(profile);
  };

  return (
    <div style={{ maxWidth: 560, margin: "10vh auto", textAlign: "center" }}>
      <h1 style={{ marginBottom: 8 }}>SignEase</h1>
      <p style={{ color: "#64748b", marginBottom: 20 }}>
        No login needed. Create a local profile to save your custom signs.
      </p>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>
        {COLORS.map(c => (
          <button key={c} onClick={() => setColor(c)}
            style={{ width: 28, height: 28, borderRadius: 999, border: c===color?"3px solid #0ea5e9":"2px solid #e2e8f0", background: c }}/>
        ))}
      </div>

      <input
        value={name} onChange={e=>setName(e.target.value)} placeholder="Your name (optional)"
        style={{ padding: 12, width: "100%", maxWidth: 380, borderRadius: 10, border: "1px solid #e2e8f0" }}
      />
      <div style={{ marginTop: 16 }}>
        <button onClick={create} style={{
          background: color, color: "#fff", padding: "12px 18px",
          borderRadius: 10, border: "none", fontWeight: 600
        }}>
          Start
        </button>
      </div>
      <div style={{ marginTop: 12, fontSize: 12, color: "#94a3b8" }}>
        Data is stored on this device. You can export it in Settings.
      </div>
    </div>
  );
}
