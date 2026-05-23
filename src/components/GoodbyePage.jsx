import { useEffect, useState } from "react";

export default function GoodbyePage() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const delays = [600, 1800, 3200, 5000];
    const timers = delays.map((d, i) => setTimeout(() => setPhase(i + 1), d));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#fdf6f0",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      position: "relative",
      padding: "2rem 1.5rem",
      overflow: "hidden",
    }}>

      {/* Very subtle vignette */}
      <div aria-hidden style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(200,160,170,0.07) 100%)",
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        textAlign: "center", maxWidth: "420px", width: "100%",
      }}>

        {/* Small ornament */}
        <div style={{
          fontSize: "1.4rem",
          marginBottom: "3rem",
          opacity: phase >= 1 ? 0.5 : 0,
          transition: "opacity 1.5s ease",
        }}>
          ✦
        </div>

        {/* Line 1 */}
        <p style={{
          fontFamily: "var(--font-display)", fontWeight: 300,
          fontSize: "clamp(1rem, 4vw, 1.25rem)",
          color: "var(--text-mid)",
          lineHeight: 1.7,
          marginBottom: "1.25rem",
          letterSpacing: "0.01em",
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 1.4s ease, transform 1.4s ease",
        }}>
          This website was made only for you.
        </p>

        {/* Line 2 */}
        <p style={{
          fontFamily: "var(--font-display)", fontStyle: "italic",
          fontWeight: 300,
          fontSize: "clamp(1rem, 4vw, 1.25rem)",
          color: "var(--pink-deep)",
          lineHeight: 1.7,
          marginBottom: "4rem",
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 1.4s ease, transform 1.4s ease",
        }}>
        </p>

        {/* Final signature */}
        <div style={{
          opacity: phase >= 4 ? 1 : 0,
          transition: "opacity 2s ease",
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: "1.25rem",
        }}>
          <div style={{
            width: "32px", height: "1px",
            background: "rgba(244,167,185,0.5)",
          }} />
          <p style={{
            fontFamily: "var(--font-display)", fontStyle: "italic",
            fontSize: "0.85rem", color: "var(--text-soft)",
            letterSpacing: "0.08em",
          }}>
            Eldwin  🤍
          </p>
        </div>

      </div>
    </div>
  );
}
