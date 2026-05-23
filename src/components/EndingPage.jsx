import { useEffect, useState } from "react";
import FloatingHearts from "./FloatingHearts";

export default function EndingPage({ onDone, onRestart }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const delays = [300, 1100, 2000, 3100];
    const timers = delays.map((d, i) => setTimeout(() => setPhase(i + 1), d));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      minHeight: "100dvh",
      background: "radial-gradient(ellipse at 40% 10%, #fce4ec 0%, transparent 55%), radial-gradient(ellipse at 60% 90%, #fef0f5 0%, transparent 55%), #fdf6f0",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
      padding: "3rem 1.5rem",
    }}>
      <FloatingHearts count={7} />

      <div style={{
        position: "relative", zIndex: 1,
        textAlign: "center", maxWidth: "480px", width: "100%",
      }}>

        {/* Icon */}
        <div style={{
          fontSize: "3rem", marginBottom: "2rem",
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? "scale(1)" : "scale(0.7)",
          transition: "opacity 1s ease, transform 1s cubic-bezier(0.34,1.56,0.64,1)",
        }}>
          🌸
        </div>

        {/* Main thank you */}
        <div style={{
          marginBottom: "3rem",
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 1s ease, transform 1s ease",
        }}>
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 300,
            fontSize: "clamp(1.5rem, 6vw, 2.4rem)",
            color: "var(--text-dark)", lineHeight: 1.35,
            marginBottom: "0.75rem",
          }}>
            Thank you for reading
          </h1>
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 300,
            fontStyle: "italic",
            fontSize: "clamp(1.5rem, 6vw, 2.4rem)",
            color: "var(--pink-deep)", lineHeight: 1.35,
          }}>
            all the way here.
          </h1>
        </div>

        {/* Divider */}
        <div style={{
          display: "flex", alignItems: "center", gap: "1rem",
          maxWidth: "240px", margin: "0 auto 3rem",
          opacity: phase >= 3 ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, rgba(244,167,185,0.45))" }} />
          <span style={{ color: "var(--pink)", fontSize: "0.8rem" }}>✦</span>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, rgba(244,167,185,0.45))" }} />
        </div>

        {/* Question + Buttons */}
        <div style={{
          opacity: phase >= 4 ? 1 : 0,
          transform: phase >= 4 ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 1s ease, transform 1s ease",
        }}>
          <div style={{
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(244,167,185,0.25)",
            borderRadius: "28px",
            padding: "2.5rem 2rem",
          }}>
            <p style={{
              fontFamily: "var(--font-display)", fontStyle: "italic",
              fontSize: "clamp(1rem, 3.5vw, 1.2rem)",
              color: "var(--text-mid)", lineHeight: 1.65,
              marginBottom: "2rem",
            }}>
              Apakah kamu sudah selesai?
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", alignItems: "center" }}>
              <button
                className="btn btn-primary"
                onClick={onDone}
                style={{ maxWidth: "260px", width: "100%" }}
              >
                Sudah ✓
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
