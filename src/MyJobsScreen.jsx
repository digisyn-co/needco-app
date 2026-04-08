import { useApp } from "../context/AppContext";

const statusConfig = {
  active: { label: "Active", className: "badge-green" },
  done: { label: "Done", className: "badge-gray" },
  pending: { label: "Pending", className: "badge-amber" },
};

export default function MyJobsScreen() {
  const { jobs, navigate } = useApp();

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <div className="topbar">
        <span className="topbar-title">My jobs</span>
        <span className="badge badge-gray">{jobs.length}</span>
      </div>

      <div className="scroll-body">
        {jobs.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <p style={{ color: "var(--text-muted)" }}>No jobs yet. Post your first job!</p>
            <button className="btn btn-primary" style={{ marginTop: 20, width: "auto", padding: "12px 24px" }} onClick={() => navigate("home")}>Find a worker</button>
          </div>
        )}

        {jobs.map((job, i) => {
          const st = statusConfig[job.status] || statusConfig.pending;
          return (
            <div key={job.id} className={`fade-up-${Math.min(i + 1, 5)}`} style={{
              background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
              padding: "14px 16px", marginBottom: 10, cursor: "pointer", transition: "border-color 0.15s"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--text)" }}>
                  {job.service} – {job.desc}
                </div>
                <span className={`badge ${st.className}`}>{st.label}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "var(--text-muted)" }}>
                {job.worker && <span>👤 {job.worker}</span>}
                <span>📅 {job.date}</span>
                <span style={{ marginLeft: "auto", fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--green-dark)", fontSize: 14 }}>₱{job.price}</span>
              </div>
              {job.status === "active" && (
                <button className="btn btn-primary btn-sm" style={{ marginTop: 12, width: "auto" }} onClick={() => navigate("tracking")}>
                  Track job →
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
