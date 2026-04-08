import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function LoginScreen() {
  const { login } = useApp();
  const [tab, setTab] = useState("customer");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      login(tab === "customer" ? "customer" : tab === "worker" ? "worker" : "admin");
    }, 600);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 720 }}>
      {/* Hero */}
      <div style={{ background: "var(--green)", padding: "52px 28px 40px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", bottom: -20, left: 20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div className="fade-up" style={{ position: "relative" }}>
          <div style={{ width: 52, height: 52, background: "rgba(255,255,255,0.2)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, fontSize: 24 }}>N</div>
          <h1 style={{ color: "#fff", fontSize: 32, marginBottom: 8 }}>Need.co</h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, margin: 0 }}>Services at your doorstep</p>
        </div>
      </div>

      {/* Form */}
      <div style={{ flex: 1, padding: "28px 24px 32px" }}>
        {/* Role tabs */}
        <div className="fade-up-1" style={{ display: "flex", background: "var(--surface-2)", borderRadius: "var(--radius-md)", padding: 4, marginBottom: 24, gap: 4 }}>
          {[["customer","Customer"],["worker","Worker"],["admin","Admin"]].map(([val,label]) => (
            <button key={val} onClick={() => setTab(val)} style={{
              flex: 1, padding: "9px 4px", borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer", fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 600, letterSpacing: "0.02em",
              background: tab === val ? "var(--surface)" : "none",
              color: tab === val ? "var(--green)" : "var(--text-muted)",
              boxShadow: tab === val ? "var(--shadow-sm)" : "none",
              transition: "all 0.15s"
            }}>{label}</button>
          ))}
        </div>

        <div className="fade-up-2 input-wrap">
          <label className="input-label">Phone or email</label>
          <input className="input-field" placeholder="+63 9xx xxx xxxx" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
        <div className="fade-up-3 input-wrap" style={{ marginBottom: 24 }}>
          <label className="input-label">Password</label>
          <input className="input-field" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} />
        </div>

        <button className="btn btn-primary fade-up-4" onClick={handleLogin} disabled={loading} style={{ marginBottom: 12 }}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <button className="btn btn-secondary fade-up-5">Create account</button>

        <p className="fade-up-5" style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "var(--text-muted)" }}>
          Demo: tap Sign in to enter as {tab}
        </p>
      </div>
    </div>
  );
}
