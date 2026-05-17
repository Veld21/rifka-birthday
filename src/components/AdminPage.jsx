import { useState, useEffect } from "react";
import { CONFIG } from "../config";
import { fetchAdminData } from "../firebase";

function fmt(secs) {
  if (!secs) return "-";
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fbError, setFbError] = useState(null);

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
          <button
            className="btn btn-ghost"
            onClick={loadData}
            style={{ marginTop: "0.75rem", fontSize: "0.8rem" }}
          >
            {loading ? "Loading..." : "↻ Refresh"}
          </button>
        </div>

        {fbError && (
          <div style={{ ...cardStyle, borderColor: "#f4a7b9", marginBottom: "1.5rem", textAlign: "center" }}>
            <p style={{ color: "var(--pink-deep)", fontSize: "0.9rem" }}>⚠️ Firebase error: {fbError}</p>
            <p style={{ fontSize: "0.8rem", color: "var(--text-soft)", marginTop: "0.5rem" }}>
              Pastikan Firebase config sudah diisi dengan benar.
            </p>
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
              gap: "1rem",
              marginBottom: "2rem",
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

            {/* Last visit */}
            <div style={{ ...cardStyle, marginBottom: "1.5rem" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--pink-deep)", marginBottom: "0.5rem" }}>
                Last Visit
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-mid)" }}>{data.lastVisit}</p>
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
                      padding: "0.5rem 0.75rem",
                      background: "#fce8ee",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                    }}>
                      <span style={{ color: "var(--text-dark)", fontStyle: "italic" }}>"{w.answer}"</span>
                      <span style={{ color: "var(--pink-deep)", fontWeight: 500 }}>{w.count}x</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Visitor list */}
            <div style={{ ...cardStyle, marginBottom: "1.5rem" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--pink-deep)", marginBottom: "1rem" }}>
                Visitor List
              </h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                  <thead>
                    <tr style={{ color: "var(--text-soft)", textAlign: "left" }}>
                      <th style={{ padding: "0.5rem", borderBottom: "1px solid #f0d5dd" }}>Visitor ID</th>
                      <th style={{ padding: "0.5rem", borderBottom: "1px solid #f0d5dd" }}>Device</th>
                      <th style={{ padding: "0.5rem", borderBottom: "1px solid #f0d5dd" }}>Browser</th>
                      <th style={{ padding: "0.5rem", borderBottom: "1px solid #f0d5dd" }}>Visits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.visitorList.map((v, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #fce8ee" }}>
                        <td style={{ padding: "0.5rem", color: "var(--text-mid)", fontFamily: "monospace", fontSize: "0.75rem" }}>{v.visitorId}</td>
                        <td style={{ padding: "0.5rem" }}>{v.device}</td>
                        <td style={{ padding: "0.5rem" }}>{v.browser}</td>
                        <td style={{ padding: "0.5rem", color: "var(--pink-deep)", fontWeight: 500 }}>{v.visits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent activity */}
            <div style={{ ...cardStyle, marginBottom: "2rem" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--pink-deep)", marginBottom: "1rem" }}>
                Recent Activity (last 10)
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {data.recentActivity.map((a, i) => (
                  <div key={i} style={{
                    padding: "0.75rem",
                    background: i % 2 === 0 ? "#fdf6f0" : "white",
                    borderRadius: "8px",
                    fontSize: "0.8rem",
                    color: "var(--text-mid)",
                  }}>
                    <span style={{ color: "var(--pink-deep)", fontWeight: 500 }}>
                      {a.selectedMenu || a.event || "interaction"}
                    </span>
                    {" · "}
                    <span style={{ fontFamily: "monospace", fontSize: "0.7rem" }}>{a.visitorId}</span>
                    {a.duration && <span> · {fmt(a.duration)}</span>}
                    {a.device && <span style={{ color: "var(--text-soft)" }}> · {a.device}</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy note */}
            <p style={{
              textAlign: "center",
              fontSize: "0.75rem",
              color: "var(--text-soft)",
              fontStyle: "italic",
              padding: "1rem",
            }}>
              Analytics hanya digunakan untuk melihat interaksi website ini.
            </p>
          </>
        )}

      </div>
    </div>
  );
}
