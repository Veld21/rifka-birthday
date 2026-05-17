import { useEffect, useRef, useState } from "react";
import FloatingHearts from "./FloatingHearts";
import { CONFIG } from "../config";
import { trackInteraction } from "../firebase";

export default function WishPage({ onBack }) {
  const [visible, setVisible] = useState(false);
  const [scrollDepth, setScrollDepth] = useState(new Set());
  const startRef = useRef(Date.now());
  const containerRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Scroll tracking
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const pct = (scrollTop / (scrollHeight - clientHeight)) * 100;
      const milestones = [25, 50, 75, 100];
      milestones.forEach((m) => {
        if (pct >= m && !scrollDepth.has(m)) {
          setScrollDepth((prev) => {
            const next = new Set(prev);
            next.add(m);
            trackInteraction({ event: "wishScrollDepth", depth: m });
            return next;
          });
        }
      });
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [scrollDepth]);

  // Duration tracking on unmount
  useEffect(() => {
    return () => {
      const duration = Math.round((Date.now() - startRef.current) / 1000);
      trackInteraction({ selectedMenu: "wish", duration });
    };
  }, []);

  return (
    <div style={{
      minHeight: "100dvh",
      background: "radial-gradient(ellipse at 30% 10%, #fce4ec 0%, transparent 55%), radial-gradient(ellipse at 70% 90%, #fff0f3 0%, transparent 55%), #fdf6f0",
      position: "relative",
      overflow: "hidden",
    }}>
      <FloatingHearts count={8} />

      {/* Top bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)",
        padding: "calc(env(safe-area-inset-top) + 0.75rem) 1.5rem 0.75rem",
        background: "rgba(253,246,240,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(244,167,185,0.15)",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      }}>
        <button className="btn btn-ghost" onClick={onBack} style={{
          padding: "0.5rem 0",
          minHeight: "auto",
          fontSize: "0.85rem",
        }}>
          ← Kembali
        </button>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: "1.2rem" }}>💌</span>
      </div>

      {/* Scrollable content */}
      <div
        ref={containerRef}
        style={{
          overflowY: "auto",
          height: "calc(100dvh - 60px)",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div style={{
          maxWidth: "620px",
          margin: "0 auto",
          padding: "3rem 1.5rem 5rem",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1.25rem" }}>🌸</div>
            <h1 className="display-title" style={{
              fontSize: "clamp(1.8rem, 7vw, 2.8rem)",
              marginBottom: "0.5rem",
            }}>
              Untuk <em>{CONFIG.recipientName}</em>
            </h1>
            <p style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              color: "var(--text-soft)",
              fontSize: "1rem",
            }}>
              dari seseorang yang tulus, untukmu
            </p>

            <div className="divider" style={{ marginTop: "2rem" }}>
              <span className="divider-icon">✦</span>
            </div>
          </div>

          {/* Wish paragraphs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {CONFIG.wishText.map((item, i) => (
              <div key={i} style={{
                animation: `fadeInUp 0.7s ease ${i * 0.08}s both`,
              }}>
                <p style={{
                  fontFamily: i === CONFIG.wishText.length - 1 ? "var(--font-display)" : "var(--font-body)",
                  fontSize: i === CONFIG.wishText.length - 1
                    ? "clamp(1.05rem, 3.5vw, 1.25rem)"
                    : "clamp(0.95rem, 3.2vw, 1.05rem)",
                  fontStyle: i === CONFIG.wishText.length - 1 ? "italic" : "normal",
                  fontWeight: 300,
                  color: i === CONFIG.wishText.length - 1 ? "var(--pink-deep)" : "var(--text-dark)",
                  lineHeight: 1.85,
                  textAlign: i === CONFIG.wishText.length - 1 ? "center" : "left",
                  position: "relative",
                  paddingLeft: i !== CONFIG.wishText.length - 1 ? "1.5rem" : 0,
                }}>
                  {i !== CONFIG.wishText.length - 1 && (
                    <span style={{
                      position: "absolute", left: 0, top: "0.5em",
                      width: "6px", height: "6px", borderRadius: "50%",
                      background: "var(--pink)",
                      display: "block",
                    }} />
                  )}
                  {item.paragraph}
                </p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            marginTop: "4rem",
            textAlign: "center",
            padding: "2.5rem",
            background: "rgba(255,255,255,0.5)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderRadius: "24px",
            border: "1px solid rgba(244,167,185,0.25)",
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🌸</div>
            <p style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(1rem, 3.5vw, 1.2rem)",
              color: "var(--text-mid)",
              lineHeight: 1.7,
            }}>
              Happy Birthday, {CONFIG.recipientName}.<br />
              Thank you for existing in this world,
              even if only for a chapter in mine.
            </p>
            <p style={{
              marginTop: "1rem",
              fontSize: "0.85rem",
              color: "var(--text-soft)",
            }}>
              — with love, {CONFIG.senderName} 🤍
            </p>
          </div>

          {/* Back button */}
          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <button className="btn btn-secondary" onClick={onBack} style={{ maxWidth: "220px", width: "100%" }}>
              ← Kembali
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
