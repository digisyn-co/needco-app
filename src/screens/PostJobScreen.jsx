import { useState } from "react";
import { useApp } from "../context/AppContext";
import { supabase } from "../supabase";

export default function PostJobScreen() {
  const { navigate, selectedService, setJobForm, user } = useApp();
  const [form, setForm] = useState({ desc: "", address: "Iloilo City", when: "Today, ASAP", budget: selectedService?.base || "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleNext = async () => {
    setLoading(true);
    setError("");

    try {
      let jobId = null;

      // Only save to DB if user is logged in
      if (user?.id) {
        const { data, error: jobError } = await supabase.from("jobs").insert({
          customer_id: user.id,
          service: selectedService?.name,
          description: form.desc,
          address: form.address,
          status: "pending",
          price: Number(form.budget) || selectedService?.base
        }).select().single();

        if (jobError) {
          console.error(jobError);
        } else {
          jobId = data.id;
        }
      }

      setJobForm({ ...form, jobId });
      navigate("match");
    } catch(e) {
      console.error(e);
      // Navigate anyway even if DB save fails
      setJobForm({ ...form });
      navigate("match");
    }

    setLoading(false);
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
          <textarea className="input-field" rows={3} placeholder="What needs to be done? Be specific so workers can prepare." value={form.desc} onChange={e => update("desc", e.target.value)} />
        </div>

        <div className="fade-up-2 input-wrap">
          <label className="input-label">Address</label>
          <input className="input-field" placeholder="Your full address in Iloilo/Pavia" value={form.address} onChange={e => update("address", e.target.value)} />
        </div>

        <div className="fade-up-3 input-wrap">
          <label className="input-label">When do you need it?</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            {["Today, ASAP", "Today, afternoon", "Tomorrow"].map(opt => (
              <button key={opt} onClick={() => update("when", opt)} style={{
                flex: 1, padding: "8px 4px",
                border: form.when === opt ? "1.5px solid var(--green)" : "1px solid var(--border-mid)",
                borderRadius: "var(--radius-sm)",
                background: form.when === opt ? "var(--green-light)" : "none",
                fontFamily: "var(--font-display)", fontSize: 11, fontWeight: 600,
                cursor: "pointer",
                color: form.when === opt ? "var(--green-dark)" : "var(--text-muted)"
              }}>{opt}</button>
            ))}
          </div>
        </div>

        <div className="fade-up-4 input-wrap" style={{ marginBottom: 24 }}>
          <label className="input-label">Your budget (₱)</label>
          <input className="input-field" type="number" placeholder={`Suggested: ₱${selectedService?.base}`} value={form.budget} onChange={e => update("budget", e.target.value)} />
        </div>

        {error && (
          <div style={{ background: "var(--danger-light)", border: "1px solid var(--danger)", borderRadius: "var(--radius-md)", padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "var(--danger)" }}>
            {error}
          </div>
        )}

        <button className="btn btn-primary fade-up-5" onClick={handleNext} disabled={!form.desc || loading}>
          {loading ? "Posting job..." : "Find workers nearby →"}
        </button>
      </div>
    </div>
  );
}
