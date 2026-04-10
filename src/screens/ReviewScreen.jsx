import { useState } from "react";
import { useApp } from "../context/AppContext";
import { supabase } from "../supabase";

export default function ReviewScreen() {
  const { navigate, selectedWorker, selectedService, activeJob, user } = useApp();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [paid, setPaid] = useState(false);

  const price = selectedWorker?.price?.[selectedService?.name] || activeJob?.price || 380;
  const labels = ["", "Poor", "Fair", "Good", "Great", "Excellent!"];

  const handlePayConfirm = () => setPaid(true);

  const handleSubmit = async () => {
    try {
      if (activeJob?.jobId) {
        await supabase.from("jobs").update({ status: "done" }).eq("id", activeJob.jobId);
      }
      if (rating > 0 && selectedWorker) {
        await supabase.from("reviews").insert({
          job_id: activeJob?.jobId || null,
          customer_id: user?.id,
          worker_id: null,
          rating,
          comment
        });
      }
    } catch(e) {}
    setSubmitted(true);
    setTimeout(() => navigate("home"), 2000);
  };

  if (submitted) {
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
        <h2 style={{ textAlign: "center", marginBottom: 8 }}>All done!</h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)" }}>Thank you for using Need.co</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <div className="topbar">
        <span className="topbar-title">Complete job</span>
      </div>

      <div className="scroll-body">

        {/* Payment section */}
        <div className="fade-up card" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>Payment</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Cash on delivery</div>
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: "var(--green-dark)" }}>
              ₱{price}
            </div>
          </div>

          {/* Breakdown */}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, marginBottom: 12 }}>
            {[
              ["Service fee", `₱${price}`],
              ["Platform fee", "₱0"],
              ["Total", `₱${price}`],
            ].map(([label, val]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: label === "Total" ? "var(--text)" : "var(--text-muted)", fontWeight: label === "Total" ? 600 : 400 }}>{label}</span>
                <span style={{ fontSize: 13, fontFamily: "var(--font-display)", fontWeight: label === "Total" ? 700 : 400, color: label === "Total" ? "var(--green-dark)" : "var(--text-muted)" }}>{val}</span>
              </div>
            ))}
          </div>

          <div style={{ background: "var(--surface-2)", borderRadius: "var(--radius-sm)", padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>💵</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--font-display)" }}>Cash payment</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Pay the worker directly after job is done</div>
            </div>
          </div>

          {!paid ? (
            <button className="btn btn-primary" onClick={handlePayConfirm}>
              Confirm cash payment ✓
            </button>
          ) : (
            <div style={{ background: "var(--green-light)", borderRadius: "var(--radius-sm)", padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>✅</span>
              <span style={{ fontSize: 13, fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--green-dark)" }}>Payment confirmed!</span>
            </div>
          )}
        </div>

        {/* Rating section */}
        <div className="fade-up-1 card" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div className="avatar" style={{ width: 46, height: 46, background: selectedWorker?.bg || "var(--green-light)", color: selectedWorker?.color || "var(--green)", fontSize: 14, fontWeight: 700 }}>
              {selectedWorker?.initials || "WK"}
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>{selectedWorker?.name || "Your worker"}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{selectedService?.name}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 6, marginBottom: 8, justifyContent: "center" }}>
            {[1,2,3,4,5].map(n => (
              <button key={n} onMouseEnter={() => setHovered(n)} onMouseLeave={() => setHovered(0)} onClick={() => setRating(n)} style={{
                background: "none", border: "none", cursor: "pointer", fontSize: 36, padding: "2px",
                color: n <= (hovered || rating) ? "var(--warning)" : "var(--border-mid)",
                transform: n <= (hovered || rating) ? "scale(1.15)" : "scale(1)",
                transition: "all 0.12s"
              }}>★</button>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: 13, fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--green)", marginBottom: 14, height: 20 }}>
            {labels[hovered || rating]}
          </p>

          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
            {["On time", "Professional", "Great work", "Would hire again"].map(tag => (
              <button key={tag} onClick={() => setComment(c => c ? c + ". " + tag : tag)} style={{
                padding: "6px 12px", border: "1px solid var(--border-mid)", borderRadius: 20,
                background: "none", fontSize: 11, fontFamily: "var(--font-display)", fontWeight: 600,
                cursor: "pointer", color: "var(--text-mid)"
              }}>{tag}</button>
            ))}
          </div>

          <textarea className="input-field" rows={2} placeholder="Leave a comment (optional)" value={comment} onChange={e => setComment(e.target.value)} />
        </div>

        <button className="btn btn-primary fade-up-2" disabled={!paid || !rating} onClick={handleSubmit}>
          Submit & complete job ✓
        </button>
        <button className="btn btn-secondary fade-up-3" style={{ marginTop: 8 }} onClick={() => navigate("home")}>
          Skip rating
        </button>

      </div>
    </div>
  );
}
