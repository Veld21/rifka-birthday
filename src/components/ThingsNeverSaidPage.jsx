import { useState, useEffect } from "react";
import FloatingHearts from "./FloatingHearts";

const THINGS = [
{
text: "Sebenernya aku juga bingung kenapa aku bisa sesayang ini sama kamu. Padahal awalnya biasa aja. Cuma ngobrol, bercanda, jalanin hari kayak biasa.",
},
{
text: "Tapi entah kenapa, pelan-pelan kamu jadi orang yang paling sering ada di kepala aku. Aku jadi nunggu chat dari kamu. Aku jadi seneng cuma karena kamu nyariin aku duluan.",
},
{
text: "Hal-hal kecil yang mungkin buat kamu biasa aja… buat aku malah jadi sesuatu. Dan makin lama aku sadar kalau aku udah jatuh terlalu dalam.",
},
{
text: "Lucunya, aku tuh sadar kok kalau aku terlalu berharap. Aku sadar aku terlalu naruh hati. Tapi perasaan itu susah dimatiin kalau tiap harinya yang dipikirin orang yang sama terus.",
},
{
text: "Kadang aku juga cape sama diri sendiri. Cape overthinking. Cape mikirin kemungkinan yang bahkan belum tentu kejadian.",
},
{
text: "Tapi di saat yang sama… aku juga ga bisa bohong kalau kamu bikin aku bahagia. Aku inget banyak hal tentang kamu. Cara kamu ngomong, cara kamu ketawa, cara kamu cerita random tentang hari kamu.",
},
{
text: "Bahkan beberapa momen kecil sama kamu masih muter terus di kepala aku sampai sekarang. Dan jujur aja, aku takut kehilangan semua itu. Aku takut suatu hari nanti kita jadi asing.",
},
{
text: "Aku juga ga tau kenapa bisa sampai sejauh ini. Awalnya aku pikir kamu cuma bakal jadi orang yang lewat sebentar di hidup aku. Tapi ternyata engga.",
},
{
text: "Pelan-pelan kamu jadi seseorang yang selalu aku tunggu tiap hari. Aku jadi kebiasa nyari kamu. Kebiasa pengen cerita ke kamu. Dan tanpa sadar… kebiasa naro hati ke kamu juga.",
},
{
text: "Kadang aku mikir lucu juga ya. Dari sekian banyak orang di dunia, kenapa harus kamu yang bikin aku sesayang ini.",
},
{
text: "Padahal kamu mungkin ga pernah ngelakuin hal besar. Cuma cara kamu hadir aja udah cukup bikin aku nyaman. Dan makin lama aku kenal kamu, makin susah buat nganggep semuanya biasa aja.",
},
{
text: "Aku mulai peduli sama hal-hal kecil tentang kamu. Mulai khawatir kalau kamu lagi capek. Mulai seneng cuma karena kamu keliatan happy hari itu.",
},
{
text: "Dan jujur aja… aku suka semua itu. Aku suka ngobrol sama kamu. Aku suka denger cerita kamu. Aku suka cara kamu bikin hari aku terasa lebih ringan tanpa kamu sadar.",
},
{
text: "Oiya… sebenernya aku juga sempet pesen flight buat ketemu kamu. Aku pengen bikin surprise kecil buat kamu.",
},
{
text: "Dan jujur aja… waktu itu aku excited banget.",
},
{
text: "Aku ngebayangin bisa ketemu kamu langsung, ngobrol, jalan bentar, atau sekadar nemenin kamu aja rasanya udah cukup.",
},
{
text: "Sebenernya waktu itu aku udah beneran siap buat dateng.",
},
{
text: "Tapi sekarang rasanya udah beda ya.",
},
{
text: "Kita udah ga sedeket dulu lagi.",
},
{
text: "Dan makin aku pikirin, makin aku ngerasa kalau dateng sekarang malah jadi ga enak.",
},
{
text: "Aku takut semuanya jadi terasa maksa.",
},
{
text: "Takut aku datang dengan perasaan yang masih sama, sementara keadaan kita udah berubah.",
},
{
text: "Jadi akhirnya aku milih buat ga dateng, dan cancel flightnya",
},
{
text: "Bukan karena aku ga jadi pengen ketemu kamu.",
},
{
text: "Percaya deh… aku masih pengen banget.",
},
{
text: "Aku cuma ga mau bikin kamu ngerasa ga nyaman karena kehadiran aku.",
},
{
text: "Dan aku juga ga mau jadi alasan seseorang merasa terpaksa.",
},
{
text: "Jadi aku simpen semuanya sendiri aja.",
},
{
text: "Makanya aku bikin semua ini. Bukan buat maksa kamu suka balik sama aku. Bukan juga buat bikin kamu kasihan sama aku. Aku cuma pengen sekali aja jujur tentang apa yang selama ini aku rasain.",
},
{
text: "Kalau akhirnya nanti bukan aku orang yang kamu pilih, yaudah. Aku ga mau maksa perasaan seseorang. Aku cuma mau kamu tau kalau perasaan aku ke kamu selama ini beneran nyata.",
},
{
text: "Pernah ada seseorang yang sayang banget sama kamu. Yang doain kamu diam-diam. Yang khawatir sama kamu lebih dari yang seharusnya. Yang seneng banget cuma karena kamu ada. Dan orang itu… aku.",
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