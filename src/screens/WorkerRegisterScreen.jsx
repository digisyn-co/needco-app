import { useState } from "react";
import { useApp } from "../context/AppContext";
import { supabase } from "../supabase";

const SKILLS = ["Plumbing", "Electrical", "Cleaning", "Moving", "Carpentry", "Aircon"];

export default function WorkerRegisterScreen() {
  const { navigate, user } = useApp();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone: "",
    address: "",
    city: "Iloilo City",
    skills: [],
    experience: "",
    idType: "PhilSys ID",
    bio: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleSkill = (skill) => {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(skill)
        ? f.skills.filter(s => s !== skill)
        : [...f.skills, skill]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      // Update user role to worker
      await supabase.from("users").upsert({
        id: user.id,
        name: form.fullName,
        phone: form.phone,
        role: "worker"
      }, { onConflict: "id" });

      // Create worker profile
      const { error: workerError } = await supabase.from("workers").insert({
        user_id: user.id,
        skills: form.skills,
        lat: 10.7202,
        lng: 122.5621,
        is_available: false,
        rating: 0,
        total_jobs: 0
      });

      if (workerError) throw workerError;
      setDone(true);
    } catch(e) {
      setError("Failed to register. Please try again.");
    }
    setLoading(false);
  };

  if (done) {
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
        <h2 style={{ textAlign: "center", marginBottom: 8 }}>Application submitted!</h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: 24 }}>
          Our team will review your profile within 24 hours. You'll be notified once approved.
        </p>
        <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => navigate("home")}>
          Back to home
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <div className="topbar">
        <button className="back-btn" onClick={() => step > 1 ? setStep(s => s - 1) : navigate("home")}>←</button>
        <span className="topbar-title">Become a worker</span>
        <span className="badge badge-green">Step {step}/3</span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: "var(--surface-3)" }}>
        <div style={{ height: "100%", width: `${(step/3)*100}%`, background: "var(--green)", transition: "width 0.3s ease" }} />
      </div>

      <div className="scroll-body">

        {/* Step 1 - Personal Info */}
        {step === 1 && (
          <>
            <h3 className="fade-up" style={{ marginBottom: 4 }}>Personal information</h3>
            <p className="fade-up" style={{ marginBottom: 20 }}>Tell us about yourself</p>

            <div className="fade-up-1 input-wrap">
              <label className="input-label">Full name</label>
              <input className="input-field" placeholder="Your full name" value={form.fullName} onChange={e => update("fullName", e.target.value)} />
            </div>

            <div className="fade-up-2 input-wrap">
              <label className="input-label">Phone number</label>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ padding: "12px 14px", border: "1px solid var(--border-mid)", borderRadius: "var(--radius-sm)", fontSize: 14, background: "var(--surface-2)", whiteSpace: "nowrap" }}>🇵🇭 +63</div>
                <input className="input-field" placeholder="9xx xxx xxxx" value={form.phone} onChange={e => update("phone", e.target.value)} style={{ flex: 1 }} />
              </div>
            </div>

            <div className="fade-up-3 input-wrap">
              <label className="input-label">Home address</label>
              <input className="input-field" placeholder="Street, Barangay" value={form.address} onChange={e => update("address", e.target.value)} />
            </div>

            <div className="fade-up-4 input-wrap">
              <label className="input-label">City</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["Iloilo City", "Pavia"].map(city => (
                  <button key={city} onClick={() => update("city", city)} style={{
                    flex: 1, padding: "11px", border: form.city === city ? "1.5px solid var(--green)" : "1px solid var(--border-mid)",
                    borderRadius: "var(--radius-sm)", background: form.city === city ? "var(--green-light)" : "none",
                    fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600, cursor: "pointer",
                    color: form.city === city ? "var(--green-dark)" : "var(--text-muted)"
                  }}>{city}</button>
                ))}
              </div>
            </div>

            <button className="btn btn-primary fade-up-5" disabled={!form.fullName || !form.phone} onClick={() => setStep(2)}>
              Next →
            </button>
          </>
        )}

        {/* Step 2 - Skills */}
        {step === 2 && (
          <>
            <h3 className="fade-up" style={{ marginBottom: 4 }}>Your skills</h3>
            <p className="fade-up" style={{ marginBottom: 20 }}>Select all services you can offer</p>

            <div className="fade-up-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {SKILLS.map(skill => (
                <button key={skill} onClick={() => toggleSkill(skill)} style={{
                  padding: "14px 12px", textAlign: "left",
                  border: form.skills.includes(skill) ? "1.5px solid var(--green)" : "1px solid var(--border)",
                  borderRadius: "var(--radius-md)", background: form.skills.includes(skill) ? "var(--green-light)" : "var(--surface-2)",
                  cursor: "pointer", transition: "all 0.15s"
                }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13, color: "var(--text)" }}>{skill}</div>
                  {form.skills.includes(skill) && <div style={{ fontSize: 11, color: "var(--green)", marginTop: 4 }}>✓ Selected</div>}
                </button>
              ))}
            </div>

            <div className="fade-up-2 input-wrap">
              <label className="input-label">Years of experience</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["Less than 1", "1-3 years", "3-5 years", "5+ years"].map(exp => (
                  <button key={exp} onClick={() => update("experience", exp)} style={{
                    flex: 1, padding: "8px 4px",
                    border: form.experience === exp ? "1.5px solid var(--green)" : "1px solid var(--border-mid)",
                    borderRadius: "var(--radius-sm)",
                    background: form.experience === exp ? "var(--green-light)" : "none",
                    fontFamily: "var(--font-display)", fontSize: 10, fontWeight: 600, cursor: "pointer",
                    color: form.experience === exp ? "var(--green-dark)" : "var(--text-muted)"
                  }}>{exp}</button>
                ))}
              </div>
            </div>

            <div className="fade-up-3 input-wrap" style={{ marginBottom: 24 }}>
              <label className="input-label">Short bio</label>
              <textarea className="input-field" rows={3} placeholder="Tell customers about yourself and your experience..." value={form.bio} onChange={e => update("bio", e.target.value)} />
            </div>

            <button className="btn btn-primary fade-up-4" disabled={form.skills.length === 0} onClick={() => setStep(3)}>
              Next →
            </button>
          </>
        )}

        {/* Step 3 - ID Verification */}
        {step === 3 && (
          <>
            <h3 className="fade-up" style={{ marginBottom: 4 }}>ID Verification</h3>
            <p className="fade-up" style={{ marginBottom: 20 }}>Required to protect our customers</p>

            <div className="fade-up-1 input-wrap">
              <label className="input-label">ID Type</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 4 }}>
                {["PhilSys ID", "Driver's License", "Passport", "SSS ID", "UMID"].map(id => (
                  <button key={id} onClick={() => update("idType", id)} style={{
                    padding: "12px 14px", textAlign: "left",
                    border: form.idType === id ? "1.5px solid var(--green)" : "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    background: form.idType === id ? "var(--green-light)" : "none",
                    fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600, cursor: "pointer",
                    color: form.idType === id ? "var(--green-dark)" : "var(--text-muted)",
                    display: "flex", justifyContent: "space-between", alignItems: "center"
                  }}>
                    {id}
                    {form.idType === id && <span style={{ color: "var(--green)" }}>✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="fade-up-2 card-surface" style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13, marginBottom: 10 }}>Application summary</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: 6 }}>
                <div>👤 {form.fullName}</div>
                <div>📍 {form.address}, {form.city}</div>
                <div>🔧 {form.skills.join(", ")}</div>
                <div>⏱ {form.experience} experience</div>
                <div>🪪 {form.idType}</div>
              </div>
            </div>

            {error && (
              <div style={{ background: "var(--danger-light)", border: "1px solid var(--danger)", borderRadius: "var(--radius-md)", padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "var(--danger)" }}>
                {error}
              </div>
            )}

            <button className="btn btn-primary fade-up-3" onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit application 🚀"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
