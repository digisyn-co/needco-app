import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function PostJobScreen() {
  const { navigate, selectedService, setJobForm } = useApp();
  const [form, setForm] = useState({ desc: "", address: "45 Iznart St, Iloilo City", when: "Today, ASAP", budget: selectedService?.base || "" });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleNext = () => {
    setJobForm(form);
    navigate("match");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <div className="topbar">
        <button className="back-btn" onClick={() => navigate("home")}>←</button>
        <span className="topbar-title">Post a job</span>
      </div>

      <div className="scroll-body">
        {/* Service chip */}
        <div className="fade-up card-surface" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ fontSize: 28 }}>{selectedService?.icon}</div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text)" }}>{selectedService?.name}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{selectedService?.desc}</div>
          </div>
          <span className="badge badge-green" style={{ marginLeft: "auto" }}>from ₱{selectedService?.base}</span>
        </div>

        <div className="fade-up-1 input-wrap">
          <label className="input-label">Describe the job</label>
          <textarea className="input-field" rows={3} placeholder="What needs to be done? E.g. pipe leak under kitchen sink" value={form.desc} onChange={e => update("desc", e.target.value)} />
        </div>

        <div className="fade-up-2 input-wrap">
          <label className="input-label">Address</label>
          <input className="input-field" placeholder="Your full address" value={form.address} onChange={e => update("address", e.target.value)} />
        </div>

        <div className="fade-up-3 input-wrap">
          <label className="input-label">When do you need it?</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            {["Today, ASAP", "Today, afternoon", "Tomorrow"].map(opt => (
              <button key={opt} onClick={() => update("when", opt)} style={{
                flex: 1, padding: "8px 4px", border: form.when === opt ? "1.5px solid var(--green)" : "1px solid var(--border-mid)",
                borderRadius: "var(--radius-sm)", background: form.when === opt ? "var(--green-light)" : "none",
                fontFamily: "var(--font-display)", fontSize: 11, fontWeight: 600, cursor: "pointer", color: form.when === opt ? "var(--green-dark)" : "var(--text-muted)"
              }}>{opt}</button>
            ))}
          </div>
          <input className="input-field" placeholder="Or type custom time" value={form.when} onChange={e => update("when", e.target.value)} />
        </div>

        <div className="fade-up-4 input-wrap" style={{ marginBottom: 24 }}>
          <label className="input-label">Budget (₱)</label>
          <input className="input-field" type="number" placeholder={`e.g. ${selectedService?.base}`} value={form.budget} onChange={e => update("budget", e.target.value)} />
        </div>

        <button className="btn btn-primary fade-up-5" onClick={handleNext} disabled={!form.desc}>
          Find workers nearby →
        </button>
      </div>
    </div>
  );
}
