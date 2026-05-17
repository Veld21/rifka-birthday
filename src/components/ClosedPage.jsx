import FloatingHearts from "./FloatingHearts";
import { CONFIG } from "../config";

export default function ClosedPage() {
  return (
    <div className="page bg-gradient" style={{ minHeight: "100dvh" }}>
      <FloatingHearts count={6} />

      <div style={{
        position: "relative", zIndex: 1,
        width: "100%", maxWidth: "420px",
        textAlign: "center",
      }}>

        <div className="animate-fade-up delay-1" style={{
          fontSize: "2.5rem", marginBottom: "2rem",
        }}>
          🌿
        </div>

        <div className="glass-card animate-fade-up delay-2" style={{ padding: "3.5rem 2.5rem" }}>

          <h1 className="display-title" style={{
            fontSize: "clamp(1.5rem, 6vw, 2.2rem)",
            marginBottom: "1.5rem",
            lineHeight: 1.3,
          }}>
            Halaman ini <em>sudah selesai</em>
          </h1>

          <div className="divider">
            <span className="divider-icon">✦</span>
          </div>

          <p style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(1rem, 3.5vw, 1.2rem)",
            color: "var(--text-mid)",
            lineHeight: 1.8,
            margin: "1.5rem 0",
          }}>
            tapi doanya tetap tinggal.
          </p>

          <p style={{
            fontSize: "0.9rem",
            color: "var(--text-soft)",
            lineHeight: 1.7,
          }}>
            Some people arrive quietly, then somehow become part of your everyday thoughts without asking permission.<br />
            And maybe that’s the cruel part of caring deeply. Sometimes the story ends even when the feeling doesn’t.<br />
            Thank you for every small memory, every laugh, every moment that once made life feel lighter.
            I truly hope life becomes gentle with you, even if someday it no longer includes me.
          </p>

          <div className="divider" style={{ marginTop: "2rem" }}>
            <span className="divider-icon">✦</span>
          </div>

          <p style={{
            fontSize: "0.85rem",
            color: "var(--text-soft)",
            letterSpacing: "0.05em",
          }}>
            🌸 29 May 2026
          </p>

        </div>

        <p className="animate-fade-up delay-3" style={{
          marginTop: "2rem",
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "0.95rem",
          color: "var(--text-soft)",
        }}>
          Made with love, {CONFIG.senderName} 🤍
        </p>

      </div>
    </div>
  );
}
