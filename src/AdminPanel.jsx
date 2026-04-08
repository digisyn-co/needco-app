import { useState } from "react";
import { useApp, WORKERS } from "../context/AppContext";

const ALL_JOBS = [
  { id: 1, service: "Plumbing", customer: "Juan Dela Cruz", worker: "Miguel Santos", status: "active", price: 380, date: "Today 10:14 AM" },
  { id: 2, service: "Cleaning", customer: "Maria Reyes", worker: "Ana Reyes", status: "done", price: 250, date: "Today 8:30 AM" },
  { id: 3, service: "Electrical", customer: "Rodel Cruz", worker: "Carlo Dizon", status: "done", price: 400, date: "Apr 7" },
  { id: 4, service: "Moving", customer: "Liza Soriano", worker: "Luz Fernandez", status: "pending", price: 620, date: "Today 2:00 PM" },
  { id: 5, service: "Aircon", customer: "Ben Torres", worker: null, status: "pending", price: 500, date: "Today 3:30 PM" },
];

const statusConfig = {
  active: "badge-green",
  done: "badge-gray",
  pending: "badge-amber",
};

export default function AdminPanel() {
  const { logout } = useApp();
  const [tab, setTab] = useState("overview");

  const totalRevenue = ALL_JOBS.filter(j => j.status !== "pending").reduce((s, j) => s + j.price, 0);
  const activeJobs = ALL_JOBS.filter(j => j.status === "active").length;
  const onlineWorkers = 3;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <div className="topbar" style={{ background: "var(--text)", borderBottom: "none" }}>
        <div style={{ width: 30, height: 30, background: "var(--green)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14, color: "#fff" }}>N</div>
        <span className="topbar-title" style={{ color: "#fff" }}>Admin Panel</span>
        <button onClick={logout} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "var(--radius-sm)", padding: "5px 10px", color: "rgba(255,255,255,0.7)", fontSize: 11, cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 600 }}>Logout</button>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", background: "var(--surface)", padding: "0 4px" }}>
        {[["overview","Overview"], ["jobs","Jobs"], ["workers","Workers"]].map(([val, label]) => (
          <button key={val} onClick={() => setTab(val)} style={{
            flex: 1, padding: "12px 8px", border: "none", background: "none", cursor: "pointer",
            fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 12, letterSpacing: "0.04em",
            color: tab === val ? "var(--green)" : "var(--text-muted)",
            borderBottom: tab === val ? "2px solid var(--green)" : "2px solid transparent",
            transition: "all 0.15s"
          }}>{label}</button>
        ))}
      </div>

      <div className="scroll-body">
        {tab === "overview" && (
          <>
            <p className="section-label fade-up">Platform overview</p>
            <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[
                { label: "Total revenue", value: `₱${totalRevenue.toLocaleString()}`, color: "var(--green)" },
                { label: "Active jobs", value: activeJobs, color: "var(--info)" },
                { label: "Online workers", value: onlineWorkers, color: "var(--warning)" },
                { label: "Total users", value: 42, color: "var(--text)" },
              ].map(s => (
                <div key={s.label} className="card-surface" style={{ textAlign: "center", padding: "16px 12px" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <p className="section-label fade-up-1">Recent activity</p>
            {ALL_JOBS.slice(0,3).map((job, i) => (
              <div key={job.id} className={`fade-up-${i+1} card`} style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13 }}>{job.service} · {job.customer}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{job.worker || "Unassigned"} · {job.date}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className={`badge ${statusConfig[job.status]}`} style={{ marginBottom: 4, display: "block" }}>{job.status}</span>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--green-dark)" }}>₱{job.price}</div>
                </div>
              </div>
            ))}

            {/* Service breakdown */}
            <p className="section-label fade-up-4" style={{ marginTop: 8 }}>Service breakdown</p>
            {[
              { service: "Electrical", count: 2, pct: 40 },
              { service: "Cleaning", count: 2, pct: 40 },
              { service: "Plumbing", count: 1, pct: 20 },
            ].map(s => (
              <div key={s.service} className="fade-up-4" style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontFamily: "var(--font-display)", fontWeight: 600 }}>{s.service}</span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.count} jobs · {s.pct}%</span>
                </div>
                <div style={{ height: 6, background: "var(--surface-3)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${s.pct}%`, background: "var(--green)", borderRadius: 3, transition: "width 0.5s ease" }} />
                </div>
              </div>
            ))}
          </>
        )}

        {tab === "jobs" && (
          <>
            <p className="section-label fade-up">All jobs</p>
            {ALL_JOBS.map((job, i) => (
              <div key={job.id} className={`fade-up-${Math.min(i+1,5)} card`} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14 }}>#{job.id} · {job.service}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{job.date}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span className={`badge ${statusConfig[job.status]}`}>{job.status}</span>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--green-dark)", marginTop: 4 }}>₱{job.price}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--text-muted)", paddingTop: 8, borderTop: "1px solid var(--border)" }}>
                  <span>👤 {job.customer}</span>
                  <span>🔧 {job.worker || <span style={{ color: "var(--danger)" }}>Unassigned</span>}</span>
                </div>
              </div>
            ))}
          </>
        )}

        {tab === "workers" && (
          <>
            <p className="section-label fade-up">Worker roster</p>
            {WORKERS.map((w, i) => (
              <div key={w.id} className={`fade-up-${i+1} card`} style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
                <div className="avatar" style={{ width: 44, height: 44, background: w.bg, color: w.color, fontSize: 14, fontWeight: 700 }}>{w.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14 }}>{w.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                    <span className="stars">{"★".repeat(Math.floor(w.rating))}</span> {w.rating} · {w.jobs} jobs
                  </div>
                  <div style={{ marginTop: 6, display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {w.skills.map(s => <span key={s} className="badge badge-gray" style={{ fontSize: 10 }}>{s}</span>)}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className={`badge ${i < 3 ? "badge-green" : "badge-gray"}`} style={{ fontSize: 10 }}>{i < 3 ? "Online" : "Offline"}</span>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{w.distance} km</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
