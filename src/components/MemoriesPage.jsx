import { useEffect, useRef, useState } from "react";
import FloatingHearts from "./FloatingHearts";
import { CONFIG } from "../config";
import { trackInteraction } from "../firebase";

export default function MemoriesPage({ onBack, onContinue }) {
  const [visible, setVisible] = useState(false);
  const videoRef = useRef(null);
  const startRef = useRef(Date.now());
  const [videoPlays, setVideoPlays] = useState(0);
  const [videoCompleted, setVideoCompleted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    return () => {
      const duration = Math.round((Date.now() - startRef.current) / 1000);
      trackInteraction({ selectedMenu: "memories", duration });
    };
  }, []);

  const handleVideoPlay = () => {
    const count = videoPlays + 1;
    setVideoPlays(count);
    trackInteraction({ event: "videoPlay", count });
  };

  const handleVideoEnded = () => {
    setVideoCompleted(true);
    trackInteraction({ event: "videoCompleted", videoCompleted: true });
  };

  return (
    <div style={{
      minHeight: "100dvh",
      background: "radial-gradient(ellipse at 20% 20%, #fce4ec 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, #fff0f3 0%, transparent 55%), #fdf6f0",
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
      }}>
        <button className="btn btn-ghost" onClick={onBack} style={{
          padding: "0.5rem 0", minHeight: "auto", fontSize: "0.85rem",
        }}>
          ← Kembali
        </button>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: "1.2rem" }}>📷</span>
      </div>

      {/* Scrollable */}
      <div style={{
        overflowY: "auto",
        height: "calc(100dvh - 60px)",
        WebkitOverflowScrolling: "touch",
      }}>
        <div style={{
          maxWidth: "620px",
          margin: "0 auto",
          padding: "3rem 1.5rem 5rem",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>📷</div>
            <h1 className="display-title" style={{
              fontSize: "clamp(1.8rem, 6vw, 2.6rem)",
              marginBottom: "0.5rem",
            }}>
              {CONFIG.memoriesText.title}
            </h1>
            <p style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              color: "var(--text-soft)",
              fontSize: "clamp(0.9rem, 3vw, 1.05rem)",
            }}>
              {CONFIG.memoriesText.subtitle}
            </p>
            <div className="divider" style={{ marginTop: "2rem" }}>
              <span className="divider-icon">✦</span>
            </div>
          </div>

          {/* Photos - Polaroid style */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
            marginBottom: "3rem",
          }}>
            {CONFIG.photos.map((photo, i) => (
              <div key={i} style={{
                animation: `fadeInUp 0.6s ease ${i * 0.15}s both`,
              }}>
                {/* Polaroid card */}
                <div style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "1rem 1rem 1.75rem",
                  boxShadow: "0 8px 32px rgba(180,100,130,0.15), 0 2px 8px rgba(0,0,0,0.08)",
                  transform: i % 2 === 0 ? "rotate(-1.5deg)" : "rotate(1.5deg)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "default",
                }}>
                  {/* Photo area */}
                  <div style={{
                    width: "100%",
                    paddingBottom: "85%",
                    position: "relative",
                    background: "linear-gradient(135deg, #fce8ee 0%, #fff0f3 50%, #fdf6f0 100%)",
                    borderRadius: "8px",
                    overflow: "hidden",
                    marginBottom: "0.75rem",
                  }}>
                    <img
                      src={photo.src}
                      alt={`Memory ${i + 1}`}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                      onError={(e) => {
                        // Fallback placeholder
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `
                          <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.5rem;">
                            <div style="font-size:2.5rem;">🌸</div>
                            <div style="font-size:0.7rem;color:#b08a96;letter-spacing:0.1em;text-transform:uppercase;">Photo ${i + 1}</div>
                          </div>
                        `;
                      }}
                    />
                  </div>
                  {/* Caption */}
                  <p style={{
                    textAlign: "center",
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontSize: "0.85rem",
                    color: "var(--text-soft)",
                    lineHeight: 1.4,
                  }}>
                    {photo.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Video */}
          <div style={{
            animation: "fadeInUp 0.6s ease 0.3s both",
            marginBottom: "3rem",
          }}>
            <div style={{
              background: "white",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 12px 40px rgba(180,100,130,0.15)",
            }}>
              <video
                ref={videoRef}
                controls
                playsInline
                preload="metadata"
                onPlay={handleVideoPlay}
                onEnded={handleVideoEnded}
                style={{
                  width: "100%",
                  display: "block",
                  borderRadius: "20px 20px 0 0",
                  background: "#fce8ee",
                  maxHeight: "420px",
                  objectFit: "cover",
                }}
              >
                <source src={CONFIG.video.src} type="video/mp4" />
                Your browser does not support video.
              </video>
              <div style={{
                padding: "1rem 1.5rem",
                borderTop: "1px solid rgba(244,167,185,0.2)",
              }}>
                <p style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "0.9rem",
                  color: "var(--text-soft)",
                  textAlign: "center",
                }}>
                  {CONFIG.video.caption}
                </p>
              </div>
            </div>
          </div>

          {/* Quote / memories text */}
          <div style={{
            animation: "fadeInUp 0.6s ease 0.45s both",
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(244,167,185,0.25)",
            borderRadius: "24px",
            padding: "2.5rem 2rem",
            textAlign: "center",
            marginBottom: "3rem",
          }}>
            {/* Decorative quote mark */}
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: "5rem",
              lineHeight: 0.5,
              color: "rgba(244,167,185,0.4)",
              marginBottom: "1.5rem",
              userSelect: "none",
            }}>
              "
            </div>

            <p style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(1.05rem, 3.5vw, 1.25rem)",
              color: "var(--text-dark)",
              lineHeight: 1.75,
              marginBottom: "1.5rem",
            }}>
              {CONFIG.memoriesText.quote}
            </p>

            <div className="divider">
              <span className="divider-icon">✦</span>
            </div>

            <p style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "1rem",
              color: "var(--pink-deep)",
              marginTop: "1rem",
            }}>
              {CONFIG.memoriesText.closing}
            </p>
          </div>

          {/* Navigation buttons */}
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
            {onContinue && (
              <>
                <p style={{
                  fontFamily: "var(--font-display)", fontStyle: "italic",
                  fontSize: "0.9rem", color: "var(--text-soft)",
                  marginBottom: "0.5rem",
                }}>
                  ada satu hal lagi yang ingin aku ceritakan...
                </p>
                <button
                  className="btn btn-primary"
                  onClick={onContinue}
                  style={{ maxWidth: "260px", width: "100%" }}
                >
                  Lanjutkan →
                </button>
              </>
            )}
            <button className="btn btn-ghost" onClick={onBack} style={{ fontSize: "0.85rem", minWidth: "auto" }}>
              ← Kembali
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
