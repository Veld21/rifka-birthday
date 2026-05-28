import { useState, useEffect } from "react";
import { CONFIG } from "../config";
import { fetchAdminData } from "../firebase";

function fmt(secs) {
  if (!secs) return "-";
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function Badge({ children, color = "var(--pink-deep)" }) {
  return (
    <span style={{
      display: "inline-block",
      background: "rgba(224,123,149,0.12)",
      color,
      fontSize: "0.7rem",
      padding: "0.2rem 0.6rem",
      borderRadius: "100px",
      fontWeight: 500,
      letterSpacing: "0.04em",
    }}>
      {children}
    </span>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fbError, setFbError] = useState(null);
  const [expandedVisitor, setExpandedVisitor] = useState(null);

  const handleLogin = () => {
    if (pwd === CONFIG.adminPassword) {
      setAuthed(true);
      loadData();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const loadData = async () => {
    setLoading(true);
    setFbError(null);
    try {
      const d = await fetchAdminData();
      setData(d);
    } catch (err) {
      setFbError(err.message);
    }
    setLoading(false);
  };

  const cardStyle = {
    background: "white",
    border: "1px solid #f0d5dd",
    borderRadius: "16px",
    padding: "1.5rem",
    boxShadow: "0 4px 16px rgba(180,100,130,0.08)",
  };

  const statCard = (label, value, icon) => (
    <div style={{ ...cardStyle, textAlign: "center" }}>
      <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>{icon}</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--pink-deep)", fontWeight: 300 }}>{value ?? "-"}</div>
      <div style={{ fontSize: "0.75rem", color: "var(--text-soft)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.25rem" }}>{label}</div>
    </div>
  );

  if (!authed) {
    return (
      <div className="page bg-gradient" style={{ minHeight: "100dvh" }}>
        <div style={{ maxWidth: "360px", width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>🔐</div>
          <div className="glass-card" style={{ padding: "2.5rem 2rem" }}>
            <h2 className="display-title" style={{ fontSize: "1.6rem", marginBottom: "1.5rem" }}>
              Admin <em>Panel</em>
            </h2>
            <input
              className="input-field"
              type="password"
              placeholder="Password admin..."
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={{ marginBottom: "1rem", border: error ? "1.5px solid #e07b95" : undefined }}
            />
            {error && <p style={{ color: "var(--pink-deep)", fontSize: "0.85rem", marginBottom: "1rem", fontStyle: "italic" }}>Password salah.</p>}
            <button className="btn btn-primary" onClick={handleLogin} style={{ width: "100%" }}>
              Masuk
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#fdf6f0",
      paddingTop: "calc(env(safe-area-inset-top) + 1.5rem)",
      paddingBottom: "calc(env(safe-area-inset-bottom) + 3rem)",
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1.25rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <h1 className="display-title" style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
            Admin <em>Dashboard</em>
          </h1>
          <p style={{ fontSize: "0.8rem", color: "var(--text-soft)" }}>rifka-birthday analytics</p>
          <button className="btn btn-ghost" onClick={loadData} style={{ marginTop: "0.75rem", fontSize: "0.8rem" }}>
            {loading ? "Loading..." : "↻ Refresh"}
          </button>
        </div>

        {fbError && (
          <div style={{ ...cardStyle, borderColor: "#f4a7b9", marginBottom: "1.5rem", textAlign: "center" }}>
            <p style={{ color: "var(--pink-deep)", fontSize: "0.9rem" }}>⚠️ Firebase error: {fbError}</p>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-soft)" }}>
            Mengambil data...
          </div>
        )}

        {data && (
          <>
            {/* Stats grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "1rem", marginBottom: "2rem",
            }}>
              {statCard("Total Visits", data.totalVisits, "👁️")}
              {statCard("Unique Visitors", data.uniqueVisitors, "👤")}
              {statCard("Returning", data.returningVisitors, "↩️")}
              {statCard("Wish Clicks", data.wishClicks, "💌")}
              {statCard("Memories Clicks", data.memoriesClicks, "📷")}
              {statCard("Video Played", data.videoPlayed, "▶️")}
              {statCard("Video Finished", data.videoCompleted, "✅")}
              {statCard("Avg Duration", fmt(data.avgDuration), "⏱️")}
            </div>

            {/* Final answer highlight */}
            <div style={{ ...cardStyle, marginBottom: "1.5rem", textAlign: "center" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--pink-deep)", marginBottom: "1rem" }}>
                One Last Question
              </h3>
              <div style={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
                <div>
                  <div style={{ fontSize: "2rem", color: "var(--pink-deep)", fontFamily: "var(--font-display)" }}>{data.answeredYes}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-soft)" }}>Yes 🌸</div>
                </div>
                <div>
                  <div style={{ fontSize: "2rem", color: "var(--text-mid)", fontFamily: "var(--font-display)" }}>{data.answeredNo}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-soft)" }}>No</div>
                </div>
              </div>
            </div>

            {/* Per-visitor cards */}
            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--pink-deep)", marginBottom: "1rem" }}>
                Visitors ({data.visitorList.length})
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {data.visitorList.map((v, i) => (
                  <div key={i} style={{ ...cardStyle, padding: "0" }}>

                    {/* Visitor header — clickable */}
                    <div
                      onClick={() => setExpandedVisitor(expandedVisitor === i ? null : i)}
                      style={{
                        padding: "1.25rem 1.5rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.4rem" }}>
                          <span style={{ fontFamily: "monospace", fontSize: "0.72rem", color: "var(--text-soft)" }}>
                            {v.visitorId}
                          </span>
                          <Badge>{v.device}</Badge>
                          <Badge>{v.browser}</Badge>
                          {v.finalAnswer === "yes" && <Badge color="#c2527a">Yes 🌸</Badge>}
                          {v.finalAnswer === "no" && <Badge color="var(--text-mid)">No</Badge>}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-soft)" }}>
                          Last seen: {v.lastSeen}
                        </div>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--pink-deep)", fontWeight: 500 }}>
                        {v.visits} visit{v.visits !== 1 ? "s" : ""} {expandedVisitor === i ? "▲" : "▼"}
                      </div>
                    </div>

                    {/* Expanded detail */}
                    {expandedVisitor === i && (
                      <div style={{
                        borderTop: "1px solid #f0d5dd",
                        padding: "1.25rem 1.5rem",
                        background: "#fdf6f0",
                        borderRadius: "0 0 16px 16px",
                      }}>

                        {/* Pages visited */}
                        <div style={{ marginBottom: "1rem" }}>
                          <p style={{ fontSize: "0.75rem", color: "var(--text-soft)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
                            Pages Visited
                          </p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                            {v.pagesVisited.length > 0
                              ? v.pagesVisited.map((p, j) => <Badge key={j}>{p}</Badge>)
                              : <span style={{ fontSize: "0.8rem", color: "var(--text-soft)" }}>-</span>
                            }
                          </div>
                        </div>

                        {/* First / Last seen */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                          <div>
                            <p style={{ fontSize: "0.72rem", color: "var(--text-soft)", textTransform: "uppercase", letterSpacing: "0.08em" }}>First Seen</p>
                            <p style={{ fontSize: "0.8rem", color: "var(--text-mid)" }}>{v.firstSeen}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: "0.72rem", color: "var(--text-soft)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Last Seen</p>
                            <p style={{ fontSize: "0.8rem", color: "var(--text-mid)" }}>{v.lastSeen}</p>
                          </div>
                        </div>

                        {/* Interactions */}
                        {v.interactions && v.interactions.length > 0 && (
                          <div>
                            <p style={{ fontSize: "0.75rem", color: "var(--text-soft)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
                              Activity Log
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", maxHeight: "200px", overflowY: "auto" }}>
                              {v.interactions.map((act, j) => (
                                <div key={j} style={{
                                  fontSize: "0.78rem", color: "var(--text-mid)",
                                  padding: "0.4rem 0.6rem",
                                  background: "white",
                                  borderRadius: "8px",
                                  display: "flex", justifyContent: "space-between", gap: "0.5rem",
                                }}>
                                  <span style={{ color: "var(--pink-deep)", fontWeight: 500 }}>
                                    {act.selectedMenu || act.event || "interaction"}
                                  </span>
                                  <span style={{ color: "var(--text-soft)", fontSize: "0.72rem" }}>
                                    {act.createdAt?.toDate?.()?.toLocaleString("id-ID") ?? "-"}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Wrong answers */}
            {data.topWrongAnswers.length > 0 && (
              <div style={{ ...cardStyle, marginBottom: "1.5rem" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--pink-deep)", marginBottom: "1rem" }}>
                  Top Wrong Answers
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {data.topWrongAnswers.map((w, i) => (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "0.5rem 0.75rem", background: "#fce8ee", borderRadius: "8px", fontSize: "0.85rem",
                    }}>
                      <span style={{ color: "var(--text-dark)", fontStyle: "italic" }}>"{w.answer}"</span>
                      <span style={{ color: "var(--pink-deep)", fontWeight: 500 }}>{w.count}x</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-soft)", fontStyle: "italic", padding: "1rem" }}>
              Analytics hanya digunakan untuk melihat interaksi website ini.
            </p>
          </>
        )}
      </div>
    </div>
  );
}