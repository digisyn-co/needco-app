import { useApp, WORKERS } from "../context/AppContext";

export default function MatchScreen() {
  const { navigate, selectedService, selectedWorker, setSelectedWorker, postJob, jobForm } = useApp();

  const available = WORKERS.filter(w => !selectedService || w.skills.some(s => s === selectedService?.name || w.skills.length > 0));

  const handleHire = () => {
    postJob(jobForm);
    navigate("tracking");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <div className="topbar">
        <button className="back-btn" onClick={() => navigate("postjob")}>←</button>
        <span className="topbar-title">Workers nearby</span>
        <span className="badge badge-green">{available.length} found</span>
      </div>

      <div className="scroll-body">
        {/* Mini map */}
        <div className="map-area fade-up" style={{ height: 150, marginBottom: 20 }}>
          <div className="map-roads" />
          <span className="map-pin" style={{ top: "55%", left: "48%", transform: "translate(-50%,-100%)", fontSize: 26 }}>📍</span>
          {available.map((w, i) => {
            const positions = [{ top: "20%", left: "25%" }, { top: "62%", left: "68%" }, { top: "28%", left: "74%" }, { top: "72%", left: "35%" }];
            const pos = positions[i] || { top: "40%", left: "50%" };
            return (
              <div key={w.id} className="map-worker-dot" style={{ ...pos, background: w.bg, width: 28, height: 28, fontSize: 12, border: selectedWorker?.id === w.id ? "2px solid var(--green)" : "2px solid white" }}>
                {w.initials[0]}
              </div>
            );
          })}
          <div className="map-overlay">Within 10 km radius</div>
        </div>

        {/* Sort hint */}
        <div className="fade-up-1" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <p className="section-label" style={{ margin: 0 }}>Select a worker</p>
          <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-display)", fontWeight: 600 }}>Sorted by distance</span>
        </div>

        {available.map((w, i) => {
          const price = w.price[selectedService?.name] || selectedService?.base || 350;
          const selected = selectedWorker?.id === w.id;
          return (
            <div key={w.id} className={`fade-up-${i + 1}`} onClick={() => setSelectedWorker(w)} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "14px", marginBottom: 10,
              background: selected ? "var(--green-light)" : "var(--surface)",
              border: selected ? "1.5px solid var(--green)" : "1px solid var(--border)",
              borderRadius: "var(--radius-lg)", cursor: "pointer", transition: "all 0.15s"
            }}>
              <div className="avatar" style={{ width: 46, height: 46, background: w.bg, color: w.color, fontSize: 14, fontWeight: 700 }}>{w.initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{w.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                  <span className="stars">{"★".repeat(Math.floor(w.rating))}</span>{" "}
                  <span style={{ color: "var(--text-mid)" }}>{w.rating}</span> · {w.distance} km · {w.jobs} jobs
                </div>
                <div style={{ marginTop: 6, display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {w.skills.map(s => <span key={s} className="badge badge-gray" style={{ fontSize: 10 }}>{s}</span>)}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--green-dark)" }}>₱{price}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{w.distance} km</div>
              </div>
            </div>
          );
        })}

        <button className="btn btn-primary" disabled={!selectedWorker} onClick={handleHire} style={{ marginTop: 8 }}>
          {selectedWorker ? `Hire ${selectedWorker.name.split(" ")[0]} →` : "Select a worker"}
        </button>
      </div>
    </div>
  );
}
