import { useEffect, useState } from "react";

export default function LockedPage() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const delays = [800, 2000, 3600];
    const timers = delays.map((d, i) => setTimeout(() => setPhase(i + 1), d));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#fdf6f0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Very subtle vignette */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(180,140,155,0.08) 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        {/* Small ornament */}
        <div
          style={{
            fontSize: "1.2rem",
            marginBottom: "3rem",
            opacity: phase >= 1 ? 0.4 : 0,
            transition: "opacity 1.8s ease",
          }}
        >
          ✦
        </div>

        {/* Line 1 */}
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: "clamp(1rem, 3.8vw, 1.2rem)",
            color: "var(--text-mid)",
            lineHeight: 1.75,
            marginBottom: "1.25rem",
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 1.6s ease, transform 1.6s ease",
          }}
        >
          Thank you for reading all the way here.
        </p>

        {/* Line 2 */}
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(0.95rem, 3.5vw, 1.1rem)",
            color: "var(--text-soft)",
            lineHeight: 1.8,
            marginBottom: "3.5rem",
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 1.6s ease, transform 1.6s ease",
          }}
        >
          I know you’ll choose this.<br />
          And maybe… that’s okay.<br />
          My promises ended here,<br />
          but my feelings probably never will.<br />
          Makasih karena udah nemenin perjalanan kecil ini sampai akhir<br />
          <br />
          Dan makasih… karena pernah jadi bagian penting dari hidup aku
          <br/><br/>

          <br />
          
        </p>

        {/* Final mark */}
        <div
          style={{
            opacity: phase >= 3 ? 1 : 0,
            transition: "opacity 2s ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "1px",
              background: "rgba(244,167,185,0.45)",
            }}
          />
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "0.8rem",
              color: "var(--text-soft)",
              opacity: 0.7,
              letterSpacing: "0.06em",
            }}
          >
            Someone who built a whole universe just to say “I love you".<br/>
            From someone who once hoped. 🤍
          </p>
        </div>
      </div>
    </div>
  );
}
