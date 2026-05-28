import { useEffect, useState } from "react";
import { trackFinalAnswer } from "../firebase";

export default function OneLastQuestionPage({ onYes, onNo }) {
  const [phase, setPhase] = useState(0);
  const [answered, setAnswered] = useState(null);

  useEffect(() => {
    const delays = [400, 1200, 2200, 3400];
    const timers = delays.map((d, i) => setTimeout(() => setPhase(i + 1), d));
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleYes = () => {
    if (answered) return;
    setAnswered("yes");
    trackFinalAnswer({ answer: "yes" });
    localStorage.setItem("rifka_final_answer", "yes");
    setTimeout(() => onYes(), 1800);
  };

  const handleNo = () => {
    if (answered) return;
    setAnswered("no");
    trackFinalAnswer({ answer: "no" });
    localStorage.setItem("rifka_final_answer", "no");
    setTimeout(() => onNo(), 2800);
  };

  const isAnswered = answered !== null;

  return (
    <div
      style={{
        minHeight: "100dvh",
        background:
          "radial-gradient(ellipse at 30% 20%, #f5d0dd 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, #e8c8d8 0%, transparent 50%), #f7eef4",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "2rem 1.5rem",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: "30%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "700px", height: "700px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(196,82,122,0.07) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative", zIndex: 1,
          textAlign: "center", maxWidth: "500px", width: "100%",
        }}
      >
        {/* Label */}
        <p
          style={{
            fontFamily: "var(--font-display)", fontStyle: "italic",
            fontSize: "0.8rem", color: "var(--text-soft)",
            letterSpacing: "0.2em", textTransform: "uppercase",
            marginBottom: "2.5rem",
            opacity: phase >= 1 ? 1 : 0,
            transition: "opacity 1s ease",
          }}
        >
          one last thing
        </p>

        {/* Pre-lines */}
        <div
          style={{
            fontFamily: "var(--font-display)", fontStyle: "italic",
            fontSize: "clamp(0.95rem, 3.2vw, 1.1rem)",
            color: "var(--text-mid)", lineHeight: 1.9,
            marginBottom: "2.5rem",
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 1.2s ease, transform 1.2s ease",
          }}
        >
          <p style={{ marginBottom: "0.6rem" }}>After everything…</p>
          <p style={{ marginBottom: "0.6rem" }}>
            After all the overthinking, the distance,
            <br />
            and everything that slowly changed
          </p>
          <p style={{ marginBottom: "0.6rem" }}>
            I guess there's still one thing
            <br />
            I want to do properly.
          </p>
          <p style={{ marginBottom: "0.6rem", color: "var(--text-soft)" }}>
            I told myself that someday,
            <br />
            if I ever got the chance,
            <br />
            I would ask you honestly.
          </p>
          <p>And today… I'm keeping that promise.</p>
        </div>

        {/* THE question */}
        <div
          style={{
            opacity: phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 1.4s ease, transform 1.4s ease",
            marginBottom: answered ? "2.5rem" : "4rem",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)", fontWeight: 300,
              fontSize: "clamp(1.5rem, 5.5vw, 2.2rem)",
              color: "var(--text-dark)", lineHeight: 1.55,
              letterSpacing: "0.01em",
            }}
          >
            So, Rifka Wang
            <br />
            <em style={{ color: "var(--pink-deep)", fontStyle: "italic" }}>
              will you be my girlfriend? 
            </em>
          </h1>
        </div>

        {/* Yes response */}
        {answered === "yes" && (
          <div style={{ animation: "fadeInUp 0.7s ease both" }}>
            <div style={{
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(244,167,185,0.3)",
              borderRadius: "24px", padding: "2.5rem 2rem",
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🌸</div>
              <p style={{
                fontFamily: "var(--font-display)", fontStyle: "italic",
                fontSize: "1.3rem", color: "var(--pink-deep)", lineHeight: 1.6,
              }}>
                Really ?
                <br />
                <span style={{ fontSize: "1rem", color: "var(--text-mid)" }}>
                  Really ?
                </span>
              </p>
            </div>
          </div>
        )}

        {/* No response */}
        {answered === "no" && (
          <div style={{ animation: "fadeInUp 0.7s ease both" }}>
            <div style={{
              background: "rgba(255,255,255,0.5)",
              backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(244,167,185,0.2)",
              borderRadius: "24px", padding: "2.5rem 2rem",
            }}>
              <p style={{
                fontFamily: "var(--font-display)", fontStyle: "italic",
                fontSize: "1.1rem", color: "var(--text-mid)", lineHeight: 1.75,
              }}>
                <br />
                <span style={{ fontSize: "0.95rem", color: "var(--text-soft)" }}>
                  Even if this isn't the ending I wished for…
                  I'm still grateful I got to know you.
                  Thank you for reading all the way here.
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Buttons */}
        {!isAnswered && (
          <div
            style={{
              display: "flex", gap: "1rem",
              justifyContent: "center", flexWrap: "wrap",
              opacity: phase >= 4 ? 1 : 0,
              transform: phase >= 4 ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 1s ease, transform 1s ease",
            }}
          >
            <button
              className="btn btn-primary"
              onClick={handleYes}
              style={{ minWidth: "150px", flex: "1 1 140px", maxWidth: "200px" }}
            >
              Yes
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleNo}
              style={{
                minWidth: "150px", flex: "1 1 140px", maxWidth: "200px",
                color: "var(--text-mid)", borderColor: "rgba(180,120,140,0.4)",
              }}
            >
              No
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}