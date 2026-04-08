import { useApp, SERVICES } from "../context/AppContext";

export default function HomeScreen() {
  const { user, selectedService, setSelectedService, navigate } = useApp();

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 16px", background: "var(--surface)" }}>
        <div className="fade-up" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, fontFamily: "var(--font-display)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Good morning,</p>
            <h2 style={{ fontSize: 20, marginTop: 2 }}>{user?.name?.split(" ")[0]} 👋</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--surface-2)", padding: "7px 12px", borderRadius: 20, border: "1px solid var(--border)" }}>
            <span style={{ fontSize: 13 }}>📍</span>
            <span style={{ fontSize: 12, fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--text-mid)" }}>Iloilo City</span>
          </div>
        </div>
      </div>

      <div className="scroll-body" style={{ paddingTop: 0 }}>
        {/* Map */}
        <div className="map-area fade-up-1" style={{ height: 180, marginBottom: 20, marginTop: 12 }}>
          <div className="map-roads" />
          <span className="map-pin" style={{ top: "45%", left: "47%", transform: "translate(-50%,-100%)", fontSize: 28 }}>📍</span>
          <div className="map-worker-dot" style={{ top: "22%", left: "28%", background: "var(--green-light)" }}>🧑‍🔧</div>
          <div className="map-worker-dot" style={{ top: "55%", left: "70%", background: "var(--info-light)" }}>👩‍🔧</div>
          <div className="map-worker-dot" style={{ top: "30%", left: "72%", background: "var(--warning-light)" }}>🧑‍🔧</div>
          <div className="map-worker-dot" style={{ top: "68%", left: "38%", background: "var(--green-light)" }}>👷</div>
          <div className="map-overlay">8 workers nearby</div>
        </div>

        {/* Services */}
        <p className="section-label fade-up-2">What do you need?</p>
        <div className="fade-up-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {SERVICES.map(svc => (
            <button key={svc.id} onClick={() => setSelectedService(svc)} style={{
              background: selectedService?.id === svc.id ? "var(--green-light)" : "var(--surface-2)",
              border: selectedService?.id === svc.id ? "1.5px solid var(--green)" : "1px solid var(--border)",
              borderRadius: "var(--radius-md)", padding: "14px 12px", cursor: "pointer", textAlign: "left",
              transition: "all 0.15s"
            }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{svc.icon}</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13, color: "var(--text)" }}>{svc.name}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{svc.desc}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 700, color: "var(--green)", marginTop: 6 }}>from ₱{svc.base}</div>
            </button>
          ))}
        </div>

        <button className="btn btn-primary fade-up-3" disabled={!selectedService} onClick={() => navigate("postjob")}>
          {selectedService ? `Request ${selectedService.name}` : "Select a service"}
        </button>
      </div>
    </div>
  );
}
