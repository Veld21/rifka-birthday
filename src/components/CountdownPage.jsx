import { useState, useEffect } from "react";
import FloatingHearts from "./FloatingHearts";
import { CONFIG } from "../config";

function pad(n) {
  return String(n).padStart(2, "0");
}

function getTimeLeft() {
  const target = new Date(CONFIG.openDate).getTime();
  const now = Date.now();
  const diff = target - now;
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

export default function CountdownPage() {
  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    const t = setInterval(() => {
      const tl = getTimeLeft();
      if (!tl) {
        window.location.reload();
        return;
      }
      setTime(tl);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="page bg-gradient" style={{ minHeight: "100dvh" }}>
      <FloatingHearts count={10} />

      {/* Decorative circles */}
      <div aria-hidden="true" style={{
        position: "fixed", top: "-80px", right: "-80px",
        width: "300px", height: "300px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(244,167,185,0.25) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />
      <div aria-hidden="true" style={{
        position: "fixed", bottom: "-60px", left: "-60px",
        width: "250px", height: "250px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(240,218,184,0.2) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        width: "100%", maxWidth: "460px",
        textAlign: "center",
      }}>

        {/* Petite ornament */}
        <div className="animate-fade-up delay-1" style={{
          fontSize: "2.2rem", marginBottom: "1.5rem",
          filter: "drop-shadow(0 2px 8px rgba(224,123,149,0.3))"
        }}>
          🌸
        </div>

        {/* Main glass card */}
        <div className="glass-card animate-fade-up delay-2" style={{
          padding: "3rem 2.5rem",
          marginBottom: "1.5rem",
        }}>

          {/* Subtitle */}
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.8rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--pink-deep)",
            marginBottom: "1.25rem",
            fontWeight: 500,
          }}>
            Something is coming
          </p>

          {/* Title */}
          <h1 className="display-title" style={{ fontSize: "clamp(1.7rem, 6vw, 2.4rem)", marginBottom: "0.75rem" }}>
            Something <em>special</em>
          </h1>
          <p className="display-title" style={{
            fontSize: "clamp(1.1rem, 4vw, 1.4rem)",
            fontStyle: "italic",
            color: "var(--text-soft)",
            marginBottom: "2.5rem",
          }}>
            is waiting for you...
          </p>

          {/* Countdown */}
          {time && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "0.75rem",
            }}>
              {[
                { value: time.days, label: "Days" },
                { value: time.hours, label: "Hours" },
                { value: time.minutes, label: "Min" },
                { value: time.seconds, label: "Sec" },
              ].map(({ value, label }) => (
                <div key={label} style={{
                  background: "rgba(255,255,255,0.7)",
                  borderRadius: "16px",
                  padding: "1rem 0.5rem",
                  border: "1px solid rgba(244,167,185,0.25)",
                }}>
                  <div style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.8rem, 7vw, 2.8rem)",
                    fontWeight: 300,
                    color: "var(--text-dark)",
                    lineHeight: 1,
                    marginBottom: "0.35rem",
                  }}>
                    {pad(value)}
                  </div>
                  <div style={{
                    fontSize: "0.65rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--text-soft)",
                    fontWeight: 500,
                  }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="divider" style={{ marginTop: "2.5rem" }}>
            <span className="divider-icon">✦</span>
          </div>

          {/* Date hint */}
          <p style={{
            fontSize: "0.85rem",
            color: "var(--text-soft)",
            letterSpacing: "0.05em",
          }}>
            Opens on May 29, 2026 · 00:00 WIB
          </p>
        </div>

        {/* Signed */}
        <p className="animate-fade-up delay-3" style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "1rem",
          color: "var(--text-soft)",
        }}>
         🤍🤍🤍
        </p>
      </div>
    </div>
  );
}
