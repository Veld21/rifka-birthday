import { useEffect, useState } from "react";
import FloatingHearts from "./FloatingHearts";

export default function YesPage() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const delays = [400, 1200, 2200, 3400, 4800];
    const timers = delays.map((d, i) =>
      setTimeout(() => setPhase(i + 1), d)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background:
          "radial-gradient(ellipse at 30% 20%, #f5d0dd 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, #fce4ec 0%, transparent 50%), #fdf6f0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "2rem 1.5rem",
      }}
    >
      <FloatingHearts count={18} />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          maxWidth: "460px",
          width: "100%",
        }}
      >
        {/* Icon */}
        <div
          style={{
            fontSize: "3.5rem",
            marginBottom: "2rem",
            opacity: phase >= 1 ? 1 : 0,
            transform:
              phase >= 1
                ? "scale(1) rotate(-5deg)"
                : "scale(0.4)",
            transition:
              "opacity 0.8s ease, transform 0.8s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          🌸
        </div>

        {/* Title */}
        <div
          style={{
            opacity: phase >= 2 ? 1 : 0,
            transform:
              phase >= 2
                ? "translateY(0)"
                : "translateY(20px)",
            transition: "opacity 1s ease, transform 1s ease",
            marginBottom: "1rem",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "clamp(2.6rem, 10vw, 4rem)",
              color: "var(--pink-deep)",
              lineHeight: 1.1,
            }}
          >
            You said yes.
          </h1>
        </div>

        {/* Subtitle */}
        <div
          style={{
            opacity: phase >= 3 ? 1 : 0,
            transform:
              phase >= 3
                ? "translateY(0)"
                : "translateY(16px)",
            transition: "opacity 1s ease, transform 1s ease",
            marginBottom: "3rem",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(1rem, 3.5vw, 1.15rem)",
              color: "var(--text-mid)",
              lineHeight: 1.65,
            }}
          >
            I think my heart just stopped for a second.
          </p>
        </div>

        {/* Message Card */}
        <div
          style={{
            opacity: phase >= 4 ? 1 : 0,
            transform:
              phase >= 4
                ? "translateY(0)"
                : "translateY(20px)",
            transition: "opacity 1.2s ease, transform 1.2s ease",
            marginBottom: "2.5rem",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(244,167,185,0.3)",
              borderRadius: "28px",
              padding: "2.5rem 2rem",
              boxShadow: "0 10px 40px rgba(244,167,185,0.08)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "clamp(1rem, 3.5vw, 1.12rem)",
                color: "var(--text-dark)",
                lineHeight: 1.9,
                marginBottom: "1.5rem",
              }}
            >
              Thank you for choosing me.
              <br />
              <br />
              I know love is not always easy,
              <br />
              but I promise I’ll always try my best
              <br />
              to make you feel loved, heard,
              <br />
              and never alone.
            </p>

            <div
              style={{
                width: "32px",
                height: "1px",
                background: "rgba(244,167,185,0.5)",
                margin: "0 auto",
              }}
            />
          </div>
        </div>

        {/* Signature */}
        <div
          style={{
            opacity: phase >= 5 ? 1 : 0,
            transition: "opacity 1.5s ease",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "0.85rem",
              color: "var(--text-soft)",
              letterSpacing: "0.08em",
            }}
          >
            Eldwin 🤍
          </p>
        </div>
      </div>
    </div>
  );
}