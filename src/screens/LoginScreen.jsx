import { supabase } from "../supabase";

export default function LoginScreen() {

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin }
    });
  };

  const handleFacebook = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: { redirectTo: window.location.origin }
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 720 }}>

      {/* Hero */}
      <div style={{ background: "var(--green)", padding: "52px 28px 40px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", bottom: -20, left: 20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div className="fade-up" style={{ position: "relative" }}>
          <div style={{ width: 52, height: 52, background: "rgba(255,255,255,0.2)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, fontSize: 24 }}>N</div>
          <h1 style={{ color: "#fff", fontSize: 32, marginBottom: 8 }}>Need.co</h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, margin: 0 }}>Services at your doorstep · Iloilo City</p>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ flex: 1, padding: "40px 24px 32px" }}>

        <p className="fade-up section-label" style={{ textAlign: "center", marginBottom: 24 }}>
          Sign in to continue
        </p>

        <div className="fade-up-1" style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Google */}
          <button onClick={handleGoogle} className="btn fade-up-2" style={{
            background: "#fff",
            border: "1px solid var(--border-mid)",
            color: "var(--text)",
            gap: 12,
            boxShadow: "var(--shadow-sm)"
          }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#4285F4" }}>G</span>
            Continue with Google
          </button>

          {/* Facebook */}
          <button onClick={handleFacebook} className="btn fade-up-3" style={{
            background: "#1877F2",
            border: "none",
            color: "#fff",
            gap: 12
          }}>
            <span style={{ fontSize: 20, fontWeight: 700 }}>f</span>
            Continue with Facebook
          </button>

        </div>

        <p className="fade-up-4" style={{ textAlign: "center", marginTop: 32, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
          By continuing you agree to Need.co's<br />
          Terms of Service and Privacy Policy
        </p>

      </div>
    </div>
  );
}