import React from "react";

export default function HomeCards({ onOpen }) {
  const Card = ({ title, desc, icon, action }) => (
    <button onClick={action}
      style={{ textAlign:"left", width:"100%", padding:16, borderRadius:16, border:"1px solid #e2e8f0",
               background:"#fff", boxShadow:"0 2px 10px rgba(0,0,0,.04)" }}>
      <div style={{ fontSize:18, fontWeight:700, marginBottom:6 }}>{icon} {title}</div>
      <div style={{ color:"#64748b", fontSize:14 }}>{desc}</div>
    </button>
  );

  return (
    <div style={{ display:"grid", gap:12, gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))" }}>
      <Card title="Translate"
        desc="Show a sign → see text and hear it"
        icon="🗣️"
        action={()=>onOpen("translate")} />
      <Card title="Learn"
        desc="Coach + camera with instant feedback"
        icon="🎯"
        action={()=>onOpen("learn")} />
      <Card title="Custom Signs"
        desc="Record your own variants"
        icon="✋"
        action={()=>onOpen("custom")} />
      <Card title="History"
        desc="What you’ve said recently"
        icon="🕘"
        action={()=>onOpen("history")} />
      <Card title="Emergency"
        desc="HELP • CALL FAMILY • AMBULANCE"
        icon="🆘"
        action={()=>onOpen("emergency")} />
      <Card title="Settings"
        desc="Voice, threshold, camera"
        icon="⚙️"
        action={()=>onOpen("settings")} />
    </div>
  );
}
