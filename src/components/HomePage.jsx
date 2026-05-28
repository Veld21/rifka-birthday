import { useEffect, useState } from "react";
import FloatingHearts from "./FloatingHearts";
import { CONFIG } from "../config";
import { trackInteraction } from "../firebase";

export default function HomePage({ onNavigate }) {
  const [visible, setVisible] = useState(false);
  const [voicePlayed, setVoicePlayed] = useState(
    () => !!localStorage.getItem("voice_played")
  );
  const [audioInstance, setAudioInstance] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVoicePrompt, setShowVoicePrompt] = useState(false);
  const [readyAnswer, setReadyAnswer] = useState("");

  const [closeCountdown, setCloseCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const closeDate = new Date(CONFIG.closeDate).getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = closeDate - now;
      if (distance <= 0) {
        clearInterval(timer);
        window.location.reload();
        return;
      }
      setCloseCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / (1000 * 60)) % 60),
        seconds: Math.floor((distance / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleVoiceClick = () => {
    if (voicePlayed && !audioInstance) return;
    if (audioInstance) {
      if (isPlaying) {
        audioInstance.pause();
        setIsPlaying(false);
      } else {
        audioInstance.play().catch(() => {});
        setIsPlaying(true);
      }
      return;
    }
    setShowVoicePrompt(true);
  };

  const handleConfirmReady = () => {
    const cleaned = readyAnswer.trim().toLowerCase();
    if (cleaned !== "siap") return;
    setShowVoicePrompt(false);
    setReadyAnswer("");

    const audio = new Audio("/assets/voice.mp3");
    audio.volume = 1;
    audio.play().catch(() => {});
    setAudioInstance(audio);
    setIsPlaying(true);

    audio.onended = () => {
      setIsPlaying(false);
      localStorage.setItem("voice_played", "true");
      setVoicePlayed(true);
      setAudioInstance(null);
    };

    localStorage.setItem("voice_played", "true");
    setVoicePlayed(true);
  };

  const handleNav = (page) => {
    trackInteraction({
      selectedMenu: page,
      clickedAt: new Date().toISOString(),
    });
    if (page === "memories") onNavigate("memories-gate");
    else if (page === "things") onNavigate("things-gate");
    else if (page === "one-last-question") onNavigate("ready");
    else onNavigate(page);
  };

  return (
    <div className="page bg-gradient" style={{ minHeight: "100dvh" }}>
      <FloatingHearts count={14} />

      {/* Top decoration */}
      <div aria-hidden="true" style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "3px",
        background: "linear-gradient(to right, transparent, var(--pink), var(--gold-light), var(--pink), transparent)",
        pointerEvents: "none",
      }} />

      {/* Blobs */}
      <div aria-hidden="true" style={{
        position: "fixed", top: "-120px", right: "-120px",
        width: "400px", height: "400px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(244,167,185,0.22) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div aria-hidden="true" style={{
        position: "fixed", bottom: "-80px", left: "-80px",
        width: "320px", height: "320px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(240,218,184,0.18) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Voice Prompt Modal */}
      {showVoicePrompt && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(253,246,240,0.88)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "2rem 1.5rem",
          animation: "fadeIn 0.3s ease",
        }}>
          <div style={{
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(244,167,185,0.3)",
            borderRadius: "28px",
            padding: "2.5rem 2rem",
            maxWidth: "380px", width: "100%",
            textAlign: "center",
            boxShadow: "0 16px 48px rgba(180,100,130,0.18)",
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "1.25rem" }}>🎙️</div>

            <p style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(1rem, 3.5vw, 1.15rem)",
              color: "var(--text-dark)",
              lineHeight: 1.75,
              marginBottom: "2rem",
            }}>
              Kalau udah siap boleh jawab,<br />
              ingat cuman sekali play —<br />
              <span style={{ color: "var(--pink-deep)" }}>dengarkan baik-baik ya.</span>
            </p>

            <input
              className="input-field"
              type="text"
              placeholder='Ketik "siap"...'
              value={readyAnswer}
              onChange={(e) => setReadyAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConfirmReady()}
              autoComplete="off"
              autoCorrect="off"
              style={{ marginBottom: "0.75rem" }}
            />

            {readyAnswer.trim() && readyAnswer.trim().toLowerCase() !== "siap" && (
              <p style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "0.8rem",
                color: "var(--pink-deep)",
                marginBottom: "1rem",
              }}>
                ketik "siap" untuk lanjut 🌸
              </p>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center", marginTop: "1rem" }}>
              <button
                className="btn btn-primary"
                onClick={handleConfirmReady}
                disabled={readyAnswer.trim().toLowerCase() !== "siap"}
                style={{
                  maxWidth: "240px", width: "100%",
                  opacity: readyAnswer.trim().toLowerCase() !== "siap" ? 0.5 : 1,
                }}
              >
                Siap, putar 🎙️
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => { setShowVoicePrompt(false); setReadyAnswer(""); }}
                style={{ fontSize: "0.85rem", minWidth: "auto" }}
              >
                Nanti dulu
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{
        position: "relative", zIndex: 1,
        width: "100%", maxWidth: "480px",
        textAlign: "center",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}>

        {/* Date badge */}
        <div className="animate-fade-up delay-1" style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(244,167,185,0.3)",
          borderRadius: "100px", padding: "0.5rem 1.25rem",
          fontSize: "0.8rem", color: "var(--pink-deep)",
          letterSpacing: "0.1em", marginBottom: "2rem", fontWeight: 500,
        }}>
          🌸 29 May 2026
        </div>

        {/* Main title */}
        <div className="animate-fade-up delay-2" style={{ marginBottom: "0.75rem" }}>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "0.75rem",
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: "var(--text-soft)", marginBottom: "1rem", fontWeight: 500,
          }}>
            — Happy Birthday —
          </p>
          <h1 className="display-title" style={{
            fontSize: "clamp(2.4rem, 10vw, 3.8rem)", lineHeight: 1.1, marginBottom: "0.5rem",
          }}>
            {CONFIG.recipientName.split(" ")[0]}
          </h1>
          <h1 className="display-title" style={{
            fontSize: "clamp(2.4rem, 10vw, 3.8rem)", lineHeight: 1.1,
            fontStyle: "italic", color: "var(--pink-deep)",
          }}>
            {CONFIG.recipientName.split(" ").slice(1).join(" ")}
          </h1>
        </div>

        {/* Subtitle */}
        <p className="animate-fade-up delay-3" style={{
          fontFamily: "var(--font-display)", fontStyle: "italic",
          fontSize: "clamp(0.95rem, 3.5vw, 1.15rem)",
          color: "var(--text-soft)", marginBottom: "3rem",
          lineHeight: 1.6, padding: "0 1rem",
        }}>
          May this little page bring a small smile to your day.
        </p>

        {/* Divider */}
        <div className="divider animate-fade-up delay-3" style={{ marginBottom: "2rem" }}>
          <span className="divider-icon">✦</span>
        </div>

        {/* Voice Note Button */}
        <div className="animate-fade-up delay-3" style={{
          marginBottom: "1.5rem", display: "flex", justifyContent: "center",
        }}>
          {!voicePlayed || audioInstance ? (
            <button
              className="btn btn-secondary"
              onClick={handleVoiceClick}
              style={{
                width: "100%", maxWidth: "300px",
                borderColor: isPlaying ? "rgba(196,82,122,0.6)" : "rgba(196,82,122,0.35)",
                color: "var(--pink-deep)",
                transition: "all 0.3s ease",
              }}
            >
              <span>{isPlaying ? "⏸️" : "🎙️"}</span>
              <span>{isPlaying ? "Pause" : "Voice Note"}</span>
              {!audioInstance && (
                <span style={{
                  fontSize: "0.68rem",
                  background: "rgba(224,123,149,0.12)",
                  color: "var(--pink-deep)",
                  padding: "0.2rem 0.55rem",
                  borderRadius: "100px",
                  letterSpacing: "0.05em",
                  fontWeight: 500,
                }}>
                  1x
                </span>
              )}
            </button>
          ) : (
            <p style={{
              fontFamily: "var(--font-display)", fontStyle: "italic",
              fontSize: "0.85rem", color: "var(--text-soft)",
            }}>
              🎙️ sudah didengar 🤍
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="animate-fade-up delay-4" style={{
          display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center",
        }}>
          <button className="btn btn-primary" onClick={() => handleNav("wish")}
            style={{ width: "100%", maxWidth: "300px" }}>
            <span>💌</span><span>Lihat Wish</span>
          </button>
          <button className="btn btn-secondary" onClick={() => handleNav("memories")}
            style={{ width: "100%", maxWidth: "300px" }}>
            <span>📷</span><span>Our Little Memories</span>
          </button>
          <button className="btn btn-secondary" onClick={() => handleNav("things")}
            style={{ width: "100%", maxWidth: "300px" }}>
            <span>✉</span><span>About Eldwin</span>
          </button>
          <button className="btn btn-secondary" onClick={() => handleNav("one-last-question")}
            style={{
              width: "100%", maxWidth: "300px",
              borderColor: "rgba(196,82,122,0.45)", color: "var(--pink-deep)",
            }}>
            <span>🌸</span><span>One Last Question</span>
          </button>
        </div>

        {/* Footer */}
        <p className="animate-fade-up delay-5" style={{
          marginTop: "3rem", fontFamily: "var(--font-display)",
          fontStyle: "italic", fontSize: "0.9rem", color: "var(--text-soft)",
        }}>
          with love, {CONFIG.senderName} 🤍
        </p>

        {/* Closing countdown */}
        <div className="animate-fade-up delay-5" style={{
          marginTop: "1rem", textAlign: "center", opacity: 0.72, color: "var(--text-soft)",
        }}>
          <p style={{
            margin: "0 0 0.5rem", fontFamily: "var(--font-display)",
            fontStyle: "italic", fontSize: "0.8rem",
          }}>
            This page will quietly disappear in…
          </p>
          <div style={{
            display: "flex", justifyContent: "center", gap: "0.5rem",
            flexWrap: "wrap", fontSize: "0.72rem",
            letterSpacing: "0.08em", color: "var(--pink-deep)",
          }}>
            <span>{closeCountdown.days} Days</span>
            <span>{closeCountdown.hours} Hours</span>
            <span>{closeCountdown.minutes} Minutes</span>
            <span>{closeCountdown.seconds} Seconds</span>
          </div>
        </div>

      </div>
    </div>
  );
}