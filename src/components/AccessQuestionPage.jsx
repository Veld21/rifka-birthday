import { useState } from "react";
import FloatingHearts from "./FloatingHearts";
import { CONFIG } from "../config";
import { trackAccessAttempt } from "../firebase";

export default function AccessQuestionPage({ onSuccess }) {
  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState(false);
  const [granted, setGranted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading || granted) return;
    const cleaned = answer.trim().toLowerCase();
    const correct = CONFIG.correctAnswer.trim().toLowerCase();

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setLoading(true);

    const isCorrect = cleaned === correct;

    await trackAccessAttempt({ answer: answer.trim(), isCorrect, attempts: newAttempts });

    setLoading(false);

    if (isCorrect) {
      setError(false);
      setGranted(true);
      setTimeout(() => onSuccess(), 1800);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="page bg-gradient" style={{ minHeight: "100dvh" }}>
      <FloatingHearts count={8} />

      <div aria-hidden="true" style={{
        position: "fixed", top: "-100px", right: "-100px",
        width: "350px", height: "350px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(244,167,185,0.2) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        width: "100%", maxWidth: "420px",
        textAlign: "center",
      }}>

        {/* Granted state */}
        {granted ? (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌸</div>
            <div className="glass-card" style={{ padding: "3rem 2rem" }}>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.6rem",
                color: "var(--pink-deep)",
                fontStyle: "italic",
                marginBottom: "0.75rem",
              }}>
                Access granted :)
              </div>
              <p style={{ color: "var(--text-soft)", fontSize: "0.9rem" }}>
                Sebentar ya...
              </p>
              {/* Dots loader */}
              <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center", gap: "6px" }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{
                    width: "8px", height: "8px", borderRadius: "50%",
                    background: "var(--pink)",
                    animation: `pulse 1.2s ease ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Ornament */}
            <div className="animate-fade-up delay-1" style={{
              fontSize: "2rem", marginBottom: "1.5rem",
            }}>
              💌
            </div>

            {/* Card */}
            <div className="glass-card animate-fade-up delay-2" style={{ padding: "3rem 2rem 2.5rem" }}>

              {/* Eyebrow */}
              <p style={{
                fontSize: "0.75rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--pink-deep)",
                fontWeight: 500,
                marginBottom: "1.25rem",
              }}>
                Sebelum kamu masuk
              </p>

              {/* Question */}
              <h2 className="display-title" style={{
                fontSize: "clamp(1.3rem, 5vw, 1.8rem)",
                marginBottom: "0.5rem",
              }}>
                Kamu tau siapa
              </h2>
              <h2 className="display-title" style={{
                fontSize: "clamp(1.3rem, 5vw, 1.8rem)",
                fontStyle: "italic",
                color: "var(--pink-deep)",
                marginBottom: "2rem",
              }}>
                yang mengirimmu ini?
              </h2>

              {/* Input */}
              <div style={{ marginBottom: "1.25rem" }}>
                <input
                  className="input-field"
                  type="text"
                  placeholder="Ketik jawabanmu..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={handleKey}
                  style={{
                    border: error ? "1.5px solid #e07b95" : undefined,
                    animation: error ? "shake 0.4s ease" : undefined,
                  }}
                  autoCapitalize="none"
                  autoCorrect="off"
                  autoComplete="off"
                />
              </div>

              {/* Error message */}
              <div style={{
                height: "1.5rem",
                marginBottom: "1rem",
                transition: "opacity 0.3s",
                opacity: error ? 1 : 0,
              }}>
                <p style={{
                  fontSize: "0.85rem",
                  color: "var(--pink-deep)",
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                }}>
                  Coba inget lagi :)
                </p>
              </div>

              {/* Submit */}
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={!answer.trim() || loading}
                style={{
                  opacity: !answer.trim() ? 0.6 : 1,
                  width: "100%",
                  maxWidth: "240px",
                }}
              >
                {loading ? "Checking..." : "Masuk →"}
              </button>

            </div>

            {/* Hint */}
            <p className="animate-fade-up delay-3" style={{
              marginTop: "1.5rem",
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "0.9rem",
              color: "var(--text-soft)",
            }}>
              Ini hanya untukmu 🤍
            </p>
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
