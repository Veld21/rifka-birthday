import { useEffect, useState } from "react";
import FloatingHearts from "./FloatingHearts";

export default function ReadyPage({ onReady, onBack }) {
  const [phase, setPhase] = useState(0);
  // phase 0 = eyebrow in, 1 = title in, 2 = sub in, 3 = btn in

  useEffect(() => {
    const delays = [300, 900, 1600, 2400];
    const timers = delays.map((d, i) => setTimeout(() => setPhase(i + 1), d));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      minHeight: "100dvh",
      background: "radial-gradient(ellipse at 50% 0%, #fce4ec 0%, transparent 60%), radial-gradient(ellipse at 20% 100%, #f3dde8 0%, transparent 55%), #fdf6f0",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
      padding: "2rem 1.5rem",
    }}>
      <FloatingHearts count={4} />

      {/* Decorative radial glow behind */}
      <div aria-hidden style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "600px", height: "600px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(244,167,185,0.1) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        textAlign: "center", maxWidth: "420px", width: "100%",
      }}>

        {/* Eyebrow */}
        <p style={{
          fontFamily: "var(--font-display)", fontStyle: "italic",
          fontSize: "0.9rem", color: "var(--text-soft)",
          letterSpacing: "0.12em",
          marginBottom: "1.5rem",
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.9s ease, transform 0.9s ease",
        }}>
          hampir sampai...
        </p>

        {/* Title */}
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontWeight: 300,
          fontSize: "clamp(2.8rem, 11vw, 4.5rem)",
          color: "var(--text-dark)",
          lineHeight: 1.15,
          marginBottom: "0.5rem",
          letterSpacing: "-0.01em",
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 1s ease, transform 1s ease",
        }}>
          Are you
        </h1>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontWeight: 300,
          fontStyle: "italic",
          fontSize: "clamp(2.8rem, 11vw, 4.5rem)",
          color: "var(--pink-deep)",
          lineHeight: 1.15,
          marginBottom: "3rem",
          letterSpacing: "-0.01em",
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 1s ease 0.15s, transform 1s ease 0.15s",
        }}>
          ready?
        </h1>

        {/* Divider */}
        <div style={{
          display: "flex", alignItems: "center", gap: "1rem",
          maxWidth: "200px", margin: "0 auto 3rem",
          opacity: phase >= 3 ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, rgba(244,167,185,0.5))" }} />
          <span style={{ color: "var(--pink)", fontSize: "0.85rem" }}>✦</span>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, rgba(244,167,185,0.5))" }} />
        </div>

        {/* Subtitle */}
        <p style={{
          fontFamily: "var(--font-display)", fontStyle: "italic",
          fontSize: "clamp(0.9rem, 3vw, 1.05rem)",
          color: "var(--text-mid)",
          lineHeight: 1.7,
          marginBottom: "3rem",
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.9s ease, transform 0.9s ease",
        }}>
          Ada satu hal yang perlu aku tanyakan.<br />
          Hanya sekali. Dan ini serius.
        </p>

        {/* Buttons */}
        <div style={{
          display: "flex", flexDirection: "column",
          gap: "1rem", alignItems: "center",
          opacity: phase >= 4 ? 1 : 0,
          transform: phase >= 4 ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.9s ease, transform 0.9s ease",
        }}>
          <button className="btn btn-primary" onClick={onReady} style={{ maxWidth: "260px", width: "100%" }}>
            Ya, aku siap ✨
          </button>
          <button className="btn btn-ghost" onClick={onBack} style={{ fontSize: "0.85rem", minWidth: "auto" }}>
            ← Kembali sebentar
          </button>
        </div>

      </div>
    </div>
  );
}
