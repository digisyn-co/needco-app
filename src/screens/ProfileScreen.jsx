import { useApp } from "../context/AppContext";

export default function ProfileScreen() {
  const { user, logout, jobs } = useApp();

  const stats = [
    { label: "Jobs posted", value: jobs.length },
    { label: "Completed", value: jobs.filter(j => j.status === "done").length },
    { label: "Spent", value: `₱${jobs.reduce((s, j) => s + (j.price || 0), 0).toLocaleString()}` },
    { label: "Rating given", value: "4.7★" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <div className="topbar">
        <span className="topbar-title">Profile</span>
      </div>

      <div className="scroll-body">
        {/* Avatar section */}
        <div className="fade-up" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div className="avatar" style={{ width: 60, height: 60, background: "var(--green-light)", color: "var(--green)", fontSize: 20, fontWeight: 700 }}>
            {user?.initials || "JD"}
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>{user?.name}</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 3 }}>Customer · Iloilo City</div>
          </div>
        </div>

        {/* Stats */}
        <div className="fade-up-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
          {stats.map(s => (
            <div key={s.label} className="card-surface" style={{ textAlign: "center", padding: "14px" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text)" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Account details */}
        <p className="section-label fade-up-2">Account</p>
        <div className="fade-up-2 card" style={{ marginBottom: 16 }}>
          {[
            ["Phone", "+63 912 345 6789"],
            ["Email", "juan@email.com"],
            ["Location", "Iloilo City, PH"],
            ["Member since", "March 2025"],
            ["App version", "Need.co v0.1"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{k}</span>
              <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Settings */}
        <p className="section-label fade-up-3">Preferences</p>
        <div className="fade-up-3 card" style={{ marginBottom: 20 }}>
          {["Notifications", "Payment methods", "Privacy & security", "Help & support"].map((item, i) => (
            <div key={item} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < 3 ? "1px solid var(--border)" : "none", cursor: "pointer" }}>
              <span style={{ fontSize: 14, color: "var(--text)" }}>{item}</span>
              <span style={{ color: "var(--text-muted)", fontSize: 16 }}>›</span>
            </div>
          ))}
        </div>

        <button className="btn btn-secondary fade-up-3" style={{ marginBottom: 8 }} onClick={() => navigate("workerregister")}>Become a worker 🔧</button>
        <button className="btn btn-secondary fade-up-3" style={{ marginBottom: 8 }} onClick={() => navigate("workerregister")}>Become a worker 🔧</button>
        <button className="btn btn-danger fade-up-4" onClick={logout}>Sign out</button>
      </div>
    </div>
  );
}
