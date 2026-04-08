import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";

export default function WorkerDashboard() {
  const { user, logout, navigate } = useApp();
  const [online, setOnline] = useState(false);
  const [jobRequest, setJobRequest] = useState(null);
  const [accepted, setAccepted] = useState(null);

  useEffect(() => {
    if (!online) { setJobRequest(null); return; }
    const t = setTimeout(() => setJobRequest({
      id: 1, service: "Plumbing", desc: "Pipe leak – kitchen sink", address: "45 Iznart St, Iloilo City",
      distance: "0.8 km", budget: 380, when: "Today, ASAP"
    }), 2200);
    return () => clearTimeout(t);
  }, [online]);

  const acceptJob = () => { setAccepted(jobRequest); setJobRequest(null); };
  const declineJob = () => setJobRequest(null);

  const earnings = [
    { service: "Plumbing", client: "Maria Santos", price: 380, time: "9:00 AM" },
    { service: "Electrical", client: "Rodel Cruz", price: 420, time: "2:30 PM" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <div className="topbar">
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--green-light)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--green)", flexShrink: 0 }}>
          {user?.initials || "WK"}
        </div>
        <span className="topbar-title">{user?.name || "Worker"}</span>
        <span className={`badge ${online ? "badge-green" : "badge-gray"}`} style={{ animation: online ? "pulse 2s infinite" : "none" }}>
          {online ? "● Online" : "Offline"}
        </span>
      </div>

      <div className="scroll-body">
        {/* Toggle */}
        <div className="fade-up card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15 }}>
              {online ? "You're visible to customers" : "Go online to receive jobs"}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>
              {online ? "Within 10 km radius · Iloilo City" : "Toggle to start accepting"}
            </div>
          </div>
          <label style={{ position: "relative", display: "inline-block", width: 50, height: 28, cursor: "pointer" }}>
            <input type="checkbox" checked={online} onChange={e => setOnline(e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
            <span style={{
              position: "absolute", inset: 0, borderRadius: 14,
              background: online ? "var(--green)" : "var(--border-mid)",
              transition: "background 0.2s"
            }} />
            <span style={{
              position: "absolute", top: 3, left: online ? 25 : 3, width: 22, height: 22,
              borderRadius: "50%", background: "#fff", transition: "left 0.2s",
              boxShadow: "var(--shadow-sm)"
            }} />
          </label>
        </div>

        {/* Job request */}
        {jobRequest && (
          <div className="fade-up card" style={{ border: "1.5px solid var(--green)", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>🔔</span>
              <span className="badge badge-green" style={{ animation: "pulse 1.5s infinite" }}>New request!</span>
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
              {jobRequest.service} – {jobRequest.desc}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 3 }}>📍 {jobRequest.address} · {jobRequest.distance}</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 3 }}>🕐 {jobRequest.when}</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--green-dark)", marginBottom: 14 }}>₱{jobRequest.budget}</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={acceptJob}>Accept</button>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={declineJob}>Decline</button>
            </div>
          </div>
        )}

        {/* Active job */}
        {accepted && (
          <div className="fade-up card-surface" style={{ marginBottom: 20, borderRadius: "var(--radius-md)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14 }}>Active job</span>
              <span className="badge badge-green">En route</span>
            </div>
            <div style={{ fontSize: 13, color: "var(--text-mid)" }}>{accepted.desc} · {accepted.address}</div>
            <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>Mark complete</button>
          </div>
        )}

        {/* Earnings */}
        <p className="section-label fade-up-1">Today's earnings</p>
        <div className="fade-up-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[
            { label: "Jobs done", value: earnings.length + (accepted ? 1 : 0) },
            { label: "Earned", value: `₱${earnings.reduce((s,e) => s+e.price, 0) + (accepted ? accepted.budget : 0)}` },
            { label: "Rating", value: "4.9★" }
          ].map(s => (
            <div key={s.label} className="card-surface" style={{ textAlign: "center", padding: "12px 8px" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>{s.value}</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Job history */}
        <p className="section-label fade-up-2">Completed today</p>
        {earnings.map((e, i) => (
          <div key={i} className={`fade-up-${i+2} card`} style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13 }}>{e.service}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>👤 {e.client} · {e.time}</div>
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--green-dark)" }}>₱{e.price}</div>
          </div>
        ))}

        {/* Skills */}
        <p className="section-label fade-up-3" style={{ marginTop: 4 }}>My skills</p>
        <div className="fade-up-3" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {["Plumbing", "Electrical", "General repair"].map(s => (
            <span key={s} className="badge badge-green">{s}</span>
          ))}
          <button style={{ padding: "4px 10px", borderRadius: 20, border: "1px dashed var(--green)", background: "none", fontSize: 11, fontWeight: 600, color: "var(--green)", cursor: "pointer", fontFamily: "var(--font-display)" }}>+ Add skill</button>
        </div>

        <button className="btn btn-secondary fade-up-4" onClick={logout}>Sign out</button>
      </div>
    </div>
  );
}
