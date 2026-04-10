import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { supabase } from "../supabase";

export default function ChatScreen() {
  const { navigate, user, selectedWorker, activeJob } = useApp();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const jobId = activeJob?.jobId || null;
  const workerId = selectedWorker?.id || null;

  useEffect(() => {
    fetchMessages();

    // Realtime subscription
    const channel = supabase
      .channel("messages")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: jobId ? `job_id=eq.${jobId}` : undefined
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [jobId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    if (!jobId) {
      // Show demo messages if no real job
      setMessages([
        { id: 1, sender_id: "worker", message: "Hi! I'm on my way to your location.", created_at: new Date(Date.now() - 300000).toISOString() },
        { id: 2, sender_id: user?.id, message: "Great! The gate is open, just come in.", created_at: new Date(Date.now() - 240000).toISOString() },
        { id: 3, sender_id: "worker", message: "I'll be there in 5 minutes.", created_at: new Date(Date.now() - 180000).toISOString() },
      ]);
      return;
    }
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("job_id", jobId)
      .order("created_at", { ascending: true });
    if (data) setMessages(data);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const newMsg = {
      job_id: jobId,
      sender_id: user?.id,
      receiver_id: null,
      message: input.trim()
    };

    if (jobId) {
      await supabase.from("messages").insert(newMsg);
    } else {
      setMessages(prev => [...prev, { ...newMsg, id: Date.now(), created_at: new Date().toISOString() }]);
    }

    setInput("");
    setLoading(false);
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" });
  };

  const isMe = (senderId) => senderId === user?.id;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, height: "100%" }}>
      {/* Header */}
      <div className="topbar">
        <button className="back-btn" onClick={() => navigate("tracking")}>←</button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
          <div className="avatar" style={{ width: 36, height: 36, background: selectedWorker?.bg || "var(--green-light)", color: selectedWorker?.color || "var(--green)", fontSize: 12, fontWeight: 700 }}>
            {selectedWorker?.initials || "WK"}
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14 }}>{selectedWorker?.name || "Worker"}</div>
            <div style={{ fontSize: 11, color: "var(--green)", fontWeight: 600 }}>● Online</div>
          </div>
        </div>
        <button onClick={() => navigate("tracking")} style={{ background: "var(--green-light)", border: "none", borderRadius: "var(--radius-sm)", padding: "6px 12px", fontSize: 11, fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--green-dark)", cursor: "pointer" }}>
          Track job
        </button>
      </div>

      {/* Job context banner */}
      <div style={{ background: "var(--surface-2)", padding: "10px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 14 }}>{activeJob?.service ? "🔧" : "💬"}</span>
        <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-display)", fontWeight: 600 }}>
          {activeJob?.service || "Chat"} · Keep all communication in-app for safety
        </span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((msg, i) => {
          const mine = isMe(msg.sender_id);
          return (
            <div key={msg.id || i} style={{ display: "flex", flexDirection: "column", alignItems: mine ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "75%",
                padding: "10px 14px",
                borderRadius: mine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: mine ? "var(--green)" : "var(--surface)",
                border: mine ? "none" : "1px solid var(--border)",
                color: mine ? "#fff" : "var(--text)",
                fontSize: 14,
                lineHeight: 1.5
              }}>
                {msg.message}
              </div>
              <span style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>
                {formatTime(msg.created_at)}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Safety warning */}
      <div style={{ padding: "6px 16px", background: "var(--warning-light)", borderTop: "1px solid var(--border)" }}>
        <p style={{ fontSize: 10, color: "#633806", margin: 0, textAlign: "center" }}>
          🔒 For your safety, keep all payments and transactions inside Need.co
        </p>
      </div>

      {/* Input */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 10, background: "var(--surface)" }}>
        <input
          className="input-field"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          style={{ flex: 1, marginBottom: 0 }}
        />
        <button onClick={sendMessage} disabled={!input.trim() || loading} style={{
          width: 44, height: 44, borderRadius: "50%", background: input.trim() ? "var(--green)" : "var(--surface-3)",
          border: "none", cursor: input.trim() ? "pointer" : "default",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, transition: "background 0.15s", flexShrink: 0
        }}>
          ➤
        </button>
      </div>
    </div>
  );
}
