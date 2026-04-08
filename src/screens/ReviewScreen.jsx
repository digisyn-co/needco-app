import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function ReviewScreen() {
  const { navigate, selectedWorker, selectedService } = useApp();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const labels = ["", "Poor", "Fair", "Good", "Great", "Excellent!"];

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => navigate("home"), 1800);
  };

  if (submitted) {
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
        <h2 style={{ textAlign: "center", marginBottom: 8 }}>Review submitted!</h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)" }}>Thank you for using Need.co</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <div className="topbar">
        <span className="topbar-title">Rate your worker</span>
      </div>

      <div className="scroll-body" style={{ alignItems: "center", display: "flex", flexDirection: "column" }}>
        <div style={{ textAlign: "center", marginBottom: 28, width: "100%" }}>
          <div className="fade-up avatar" style={{ width: 64, height: 64, background: selectedWorker?.bg || "var(--green-light)", color: selectedWorker?.color || "var(--green)", fontSize: 20, fontWeight: 700, margin: "0 auto 14px" }}>
            {selectedWorker?.initials || "WK"}
          </div>
          <h3 className="fade-up-1" style={{ fontFamily: "var(--font-display)", marginBottom: 4 }}>{selectedWorker?.name || "Your worker"}</h3>
          <p className="fade-up-2" style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>{selectedService?.name} · Job complete</p>
        </div>

        {/* Stars */}
        <div className="fade-up-2" style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} onMouseEnter={() => setHovered(n)} onMouseLeave={() => setHovered(0)} onClick={() => setRating(n)} style={{
              background: "none", border: "none", cursor: "pointer", fontSize: 38, padding: "2px",
              color: n <= (hovered || rating) ? "var(--warning)" : "var(--border-mid)",
              transform: n <= (hovered || rating) ? "scale(1.15)" : "scale(1)",
              transition: "all 0.12s"
            }}>★</button>
          ))}
        </div>
        <p className="fade-up-3" style={{ fontSize: 14, fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--green)", marginBottom: 24, height: 20 }}>
          {labels[hovered || rating]}
        </p>

        <div className="fade-up-3 input-wrap" style={{ width: "100%" }}>
          <label className="input-label">Leave a comment (optional)</label>
          <textarea className="input-field" rows={3} placeholder="How was the experience?" value={comment} onChange={e => setComment(e.target.value)} />
        </div>

        {/* Tips */}
        <div className="fade-up-4" style={{ display: "flex", gap: 8, marginBottom: 20, width: "100%", flexWrap: "wrap" }}>
          {["Arrived on time", "Professional", "Great quality", "Would hire again"].map(tag => (
            <button key={tag} onClick={() => setComment(c => c ? c + ". " + tag : tag)} style={{
              padding: "7px 12px", border: "1px solid var(--border-mid)", borderRadius: 20, background: "none",
              fontSize: 12, fontFamily: "var(--font-display)", fontWeight: 600, cursor: "pointer", color: "var(--text-mid)"
            }}>{tag}</button>
          ))}
        </div>

        <button className="btn btn-primary fade-up-5" disabled={!rating} onClick={handleSubmit} style={{ width: "100%" }}>
          Submit review
        </button>
        <button className="btn btn-secondary fade-up-5" style={{ marginTop: 8, width: "100%" }} onClick={() => navigate("home")}>
          Skip
        </button>
      </div>
    </div>
  );
}
