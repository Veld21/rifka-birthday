import { useState, useEffect } from "react";
import FloatingHearts from "./FloatingHearts";

const THINGS = [
  {
    text: "I’ve always been the kind of person who feels things too deeply, even when I try my best not to show it.",
  },
  {
    text: "I notice small changes in people’s voices, remember tiny details nobody else pays attention to, and somehow turn ordinary moments into memories I carry for a very long time.",
  },
  {
    text: "I overthink late at night, replay conversations in my head, and often wonder if I could have loved people better, softer, or differently.",
  },
  {
    text: "Sometimes I look fine on the outside while quietly fighting battles inside my own mind. Sometimes I joke too much just to stop people from asking if I’m actually okay.",
  },
  {
    text: "I love deeply, stay longer than I probably should, and give people chances even after they hurt me. Not because I’m weak, but because my heart has never learned how to hate someone I once cared about sincerely.",
  },
  {
    text: "I believe that love is hidden in small things: remembering favorite songs, waiting until someone gets home safely, random late-night talks, and tiny details that most people eventually forget.",
  },
  {
    text: "Maybe that’s why I created this page. Not to force an ending, not to trap anyone inside memories, but simply to leave behind proof that, at one point in my life, my feelings were real.",
  },
  {
    text: "I tend to care too much, even when I pretend I don’t.",
  },
  {
    text: "Sometimes I stay silent because I’m afraid my feelings might become too much for someone else.",
  },
  {
    text: "I get attached to small moments more easily than I should.",
  },
  {
    text: "Sometimes I miss people quietly, without telling anyone.",
  },
  {
    text: "There are conversations I still remember word for word.",
  },
  {
    text: "I still revisit certain memories like they belong to another version of my life.",
  },
  {
    text: "Some people probably never realize how much they once meant to me.",
  },
  {
    text: "Maybe that’s why goodbyes always stay with me a little longer.",
  },
  {
    text: "I was never really good at letting people go once they became important to me.",
  },
  {
    text: "Even after everything, I still choose softness over bitterness.",
  },
  {
    text: "And despite everything, despite all the overthinking, the disappointments, the silences, and the goodbyes...",
  },
  {
    text: "my heart still stays soft for the people I truly love.",
  },
];

export default function ThingsNeverSaidPage({ onContinue, onBack }) {
  const [visible, setVisible] = useState(false);
  const [revealed, setRevealed] = useState([]);
  const [allRevealed, setAllRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible) return;
    THINGS.forEach((_, i) => {
      setTimeout(() => {
        setRevealed((prev) => {
          const next = [...prev, i];
          if (next.length === THINGS.length) {
            setTimeout(() => setAllRevealed(true), 600);
          }
          return next;
        });
      }, 400 + i * 320);
    });
  }, [visible]);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background:
          "radial-gradient(ellipse at 15% 10%, #fce4ec 0%, transparent 55%), radial-gradient(ellipse at 85% 85%, #f3e0e8 0%, transparent 55%), #fdf6f0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <FloatingHearts count={5} />

      {/* Top bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          padding: "calc(env(safe-area-inset-top) + 0.75rem) 1.5rem 0.75rem",
          background: "rgba(253,246,240,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(244,167,185,0.15)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <button
          className="btn btn-ghost"
          onClick={onBack}
          style={{ padding: "0.5rem 0", minHeight: "auto", fontSize: "0.85rem" }}
        >
          ← Kembali
        </button>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: "1.1rem", opacity: 0.6 }}>✉</span>
      </div>

      {/* Scrollable */}
      <div
        style={{
          overflowY: "auto",
          height: "calc(100dvh - 60px)",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div
          style={{
            maxWidth: "580px",
            margin: "0 auto",
            padding: "4rem 1.5rem 6rem",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.7s ease",
          }}
        >
          {/* Header */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "3rem",
              animation: "fadeInUp 0.8s ease both",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "0.9rem",
                color: "var(--text-soft)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "1.25rem",
              }}
            >
              About Eldwin
            </p>

            <h1
              className="display-title"
              style={{ fontSize: "clamp(2rem, 8vw, 3.2rem)", marginBottom: "1rem" }}
            >
               <em>Maybe You’ve Always Known</em>
            </h1>

            <div
              style={{
                width: "48px",
                height: "1px",
                background:
                  "linear-gradient(to right, transparent, var(--pink), transparent)",
                margin: "1.5rem auto 0",
              }}
            />
          </div>

          {/* Single box */}
          <div
            style={{
              background: "rgba(255,255,255,0.45)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderRadius: "24px",
              border: "1px solid rgba(244,167,185,0.2)",
              boxShadow: "0 8px 32px rgba(180,100,130,0.1)",
              padding: "2rem 1.75rem",
            }}
          >
            {THINGS.map((item, i) => (
              <div
                key={i}
                style={{
                  opacity: revealed.includes(i) ? 1 : 0,
                  transform: revealed.includes(i)
                    ? "translateY(0)"
                    : "translateY(14px)",
                  transition: "opacity 0.7s ease, transform 0.7s ease",
                  paddingTop: i === 0 ? "0" : "1.5rem",
                  paddingBottom: i === THINGS.length - 1 ? "0" : "1.5rem",
                  borderBottom:
                    i === THINGS.length - 1
                      ? "none"
                      : "1px solid rgba(244,167,185,0.15)",
                }}
              >
                <p
                  style={{
                    fontFamily:
                      i === THINGS.length - 1
                        ? "var(--font-display)"
                        : "var(--font-body)",
                    fontStyle: i === THINGS.length - 1 ? "italic" : "normal",
                    fontSize:
                      i === THINGS.length - 1
                        ? "clamp(1rem, 3.5vw, 1.15rem)"
                        : "clamp(0.92rem, 3vw, 1rem)",
                    fontWeight: 300,
                    color:
                      i === THINGS.length - 1
                        ? "var(--pink-deep)"
                        : "var(--text-dark)",
                    lineHeight: 1.85,
                  }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          {/* Continue CTA */}
          {allRevealed && (
            <div
              style={{
                marginTop: "4rem",
                textAlign: "center",
                animation: "fadeInUp 0.9s ease both",
              }}
            >
              <div
                style={{
                  marginBottom: "2rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background:
                      "linear-gradient(to right, transparent, rgba(244,167,185,0.4))",
                  }}
                />
                <span
                  style={{ color: "var(--pink)", fontSize: "0.85rem", opacity: 0.6 }}
                >
                  ✦
                </span>
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background:
                      "linear-gradient(to left, transparent, rgba(244,167,185,0.4))",
                  }}
                />
              </div>

              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "1rem",
                  color: "var(--text-soft)",
                  marginBottom: "2rem",
                }}
              >
                masih ada satu hal lagi...
              </p>

              <button
                className="btn btn-primary"
                onClick={onContinue}
                style={{ maxWidth: "260px", width: "100%" }}
              >
                Lanjutkan →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}