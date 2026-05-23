import { useState } from "react";
import FloatingHearts from "./FloatingHearts";

export default function QuestionGatePage({ question, correctAnswer, onSuccess, onBack, hint }) {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(false);
  const [granted, setGranted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading || granted || !answer.trim()) return;
    const cleaned = answer.trim().toLowerCase();
    const correct = correctAnswer.trim().toLowerCase();

    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);

    if (cleaned === correct) {
      setGranted(true);
      setTimeout(() => onSuccess(), 1600);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2200);
    }
  };

  return (
    <div className="page bg-gradient" style={{ minHeight: "100dvh" }}>
      <FloatingHearts count={6} />

      {/* Ambient blobs */}
      <div aria-hidden style={{
        position: "fixed", top: "-80px", right: "-80px",
        width: "300px", height: "300px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(244,167,185,0.18) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div aria-hidden style={{
        position: "fixed", bottom: "-80px", left: "-80px",
        width: "280px", height: "280px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(240,218,184,0.15) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "420px", textAlign: "center" }}>

        {granted ? (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1.25rem" }}>✨</div>
            <div className="glass-card" style={{ padding: "3rem 2rem" }}>
              <p style={{
                fontFamily: "var(--font-display)", fontStyle: "italic",
                fontSize: "1.5rem", color: "var(--pink-deep)", marginBottom: "0.75rem",
              }}>
                Ingat ya :)
              </p>
              <p style={{ color: "var(--text-soft)", fontSize: "0.9rem" }}>Sebentar lagi...</p>
              <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center", gap: "6px" }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{
                    width: "7px", height: "7px", borderRadius: "50%",
                    background: "var(--pink)",
                    animation: `pulse 1.2s ease ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="animate-fade-up delay-1" style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>🔒</div>

            <div className="glass-card animate-fade-up delay-2" style={{ padding: "3rem 2rem 2.5rem" }}>

              <p style={{
                fontSize: "0.72rem", letterSpacing: "0.18em",
                textTransform: "uppercase", color: "var(--pink-deep)",
                fontWeight: 500, marginBottom: "1.25rem",
              }}>
                Sebelum lanjut
              </p>

              <h2 className="display-title" style={{
                fontSize: "clamp(1.2rem, 4.5vw, 1.6rem)",
                marginBottom: "2rem", lineHeight: 1.45,
              }}>
                {question}
              </h2>

              <div style={{ marginBottom: "1.25rem" }}>
                <input
                  className="input-field"
                  type="text"
                  placeholder="Ketik jawabanmu..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  style={{
                    border: error ? "1.5px solid #e07b95" : undefined,
                    animation: error ? "shake 0.4s ease" : undefined,
                  }}
                  autoCapitalize="words"
                  autoCorrect="off"
                  autoComplete="off"
                />
              </div>

              <div style={{ height: "1.5rem", marginBottom: "1rem", transition: "opacity 0.3s", opacity: error ? 1 : 0 }}>
                <p style={{ fontSize: "0.85rem", color: "var(--pink-deep)", fontFamily: "var(--font-display)", fontStyle: "italic" }}>
                  Tanggal dan Bulan
                </p>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={!answer.trim() || loading}
                style={{ opacity: !answer.trim() ? 0.6 : 1, width: "100%", maxWidth: "240px" }}
              >
                {loading ? "Checking..." : "Lanjut →"}
              </button>

            </div>

            {(hint || onBack) && (
              <div className="animate-fade-up delay-3" style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "center" }}>
                {hint && (
                  <p style={{
                    fontFamily: "var(--font-display)", fontStyle: "italic",
                    fontSize: "0.85rem", color: "var(--text-soft)",
                  }}>
                    {hint}
                  </p>
                )}
                {onBack && (
                  <button className="btn btn-ghost" onClick={onBack} style={{ fontSize: "0.85rem", minWidth: "auto", padding: "0.5rem 1rem" }}>
                    ← Kembali
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}
