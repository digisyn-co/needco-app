import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";

const STEPS = [
  { key: "posted", label: "Job posted", sub: "Just now" },
  { key: "accepted", label: "Worker accepted", sub: null },
  { key: "enroute", label: "Worker en route", sub: null },
  { key: "working", label: "Work in progress", sub: null },
  { key: "complete", label: "Completed & payment", sub: null },
];

export default function TrackingScreen() {
  const { navigate, selectedWorker, selectedService, activeJob } = useApp();
  const [eta, setEta] = useState(7);
  const [step, setStep] = useState(2);
  const [workerPos, setWorkerPos] = useState({ top: "20%", left: "28%" });

  useEffect(() => {
    const timer = setInterval(() => {
      setEta(e => {
        if (e <= 1) { clearInterval(timer); setStep(s => Math.min(s + 1, 3)); return 0; }
        return e - 1;
      });
    }, 1800);
    const moveTimer = setInterval(() => {
      setWorkerPos(p => ({ top: `${Math.max(30, Math.min(60, parseInt(p.top) + (Math.random() > 0.5 ? 3 : -3)))}%`, left: `${Math.max(30, Math.min(60, parseInt(p.left) + (Math.random() > 0.5 ? 4 : -4)))}%` }));
    }, 2500);
    return () => { clearInterval(timer); clearInterval(moveTimer); };
  }, []);

  const price = selectedWorker?.price?.[selectedService?.name] || activeJob?.price || 380;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <div className="topbar">
        <span className="topbar-title">Job in progress</span>
        <span className="badge badge-green" style={{ animation: "pulse 2s infinite" }}>● Active</span>
      </div>

      <div className="scroll-body">
        {/* Live map */}
        <div className="map-area fade-up" style={{ height: 200, marginBottom: 20 }}>
          <div className="map-roads" />
          <span className="map-pin" style={{ top: "55%", left: "50%", transform: "translate(-50%,-100%)", fontSize: 26 }}>📍</span>
          <div className="map-worker-dot" style={{ ...workerPos, background: "var(--green-light)", width: 34, height: 34, fontSize: 15, border: "2px solid var(--green)", transition: "all 2.5s ease" }}>
            {selectedWorker?.initials?.[0] || "W"}
          </div>
          {/* Ping ring */}
          <div style={{ ...workerPos, position: "absolute", width: 34, height: 34, borderRadius: "50%", background: "rgba(29,158,117,0.2)", animation: "ping 2s infinite", transform: "translate(0,0)", transition: "all 2.5s ease" }} />
          <div className="map-overlay">{eta > 0 ? `ETA: ${eta} min` : "Worker arrived"}</div>
        </div>

        {/* Worker chip */}
        <div className="fade-up-1 card" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div className="avatar" style={{ width: 46, height: 46, background: selectedWorker?.bg || "var(--green-light)", color: selectedWorker?.color || "var(--green)", fontSize: 14, fontWeight: 700 }}>
            {selectedWorker?.initials || "WK"}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>{selectedWorker?.name || "Worker"}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{selectedService?.name} · ₱{price}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="stars">{"★".repeat(Math.floor(selectedWorker?.rating || 5))}</div>
            <div style={{ fontSize: 12, color: "var(--text-mid)", marginTop: 2 }}>{selectedWorker?.rating || "4.9"}</div>
          </div>
        </div>

        {/* Progress steps */}
        <p className="section-label fade-up-2">Job progress</p>
        <div className="fade-up-2" style={{ display: "flex", flexDirection: "column", marginBottom: 24 }}>
          {STEPS.map((s, i) => {
            const done = i < step;
            const current = i === step;
            const pending = i > step;
            const subText = s.key === "accepted" ? `${selectedWorker?.name || "Worker"} is on the way` : s.key === "enroute" ? (eta > 0 ? `Estimated ${eta} min` : "Worker has arrived") : s.sub;
            return (
              <div key={s.key}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "8px 0" }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700,
                    background: done ? "var(--green)" : current ? "var(--info)" : "var(--surface-3)",
                    color: done || current ? "#fff" : "var(--text-muted)"
                  }}>
                    {done ? "✓" : current ? "›" : ""}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: current ? 600 : 400, color: pending ? "var(--text-muted)" : "var(--text)", fontFamily: current ? "var(--font-display)" : "var(--font-body)" }}>{s.label}</div>
                    {(subText || current) && <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{subText || "—"}</div>}
                  </div>
                </div>
                {i < STEPS.length - 1 && <div style={{ width: 2, height: 16, background: done ? "var(--green)" : "var(--border)", marginLeft: 10 }} />}
              </div>
            );
          })}
        </div>

        <button className="btn btn-primary fade-up-3" onClick={() => navigate("review")}>
          Mark as completed ✓
        </button>
        <button className="btn btn-secondary fade-up-4" style={{ marginTop: 8 }}>Contact worker</button>
        <button className="btn btn-primary btn-sm" style={{ marginTop: 8 }} onClick={() => navigate("chat")}>💬 Chat with worker</button>
      </div>
    </div>
  );
}
