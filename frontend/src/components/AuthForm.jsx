import React, { useState } from "react";
import { supabase } from "../lib/supabase";

export default function AuthForm({ onAuthed }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onAuthed?.(data.session);
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg("Signup successful. Check your inbox (verification may be required). Now log in.");
        setMode("login");
      }
    } catch (err) {
      setMsg(err.message || "Auth error");
    }
  };

  return (
    <div style={{ maxWidth: 360 }}>
      <h3>{mode === "login" ? "Login" : "Sign Up"}</h3>
      <form onSubmit={submit}>
        <input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required style={{width:"100%",padding:8,marginBottom:8}}/>
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required style={{width:"100%",padding:8,marginBottom:8}}/>
        <button type="submit" style={{padding:"8px 12px"}}>{mode === "login" ? "Login" : "Create account"}</button>
      </form>
      <div style={{ marginTop: 8, color: "#555" }}>{msg}</div>
      <button onClick={()=>setMode(mode==="login"?"signup":"login")} style={{marginTop:8, background:"none", border:"none", color:"#2563eb", cursor:"pointer"}}>
        {mode === "login" ? "Need an account? Sign up" : "Have an account? Log in"}
      </button>
    </div>
  );
}
