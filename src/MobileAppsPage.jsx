// src/MobileAppsPage.jsx
import React from "react";
import logo from "./assets/hymnconnect-logo.png";
import appStoreBadge from "./assets/appstore.png";
import playStoreBadge from "./assets/playstore.png";

const rows = [
  { no: 1, feature: "Live search (results update as you type)", hymnConnect: true, hymnConnectPro: true },
  { no: 2, feature: "Search by title / Song no. / Artist / Album", hymnConnect: true, hymnConnectPro: true },
  { no: 3, feature: "Search in Hindi and Marathi besides English", hymnConnect: true, hymnConnectPro: true },
  { no: 4, feature: "Language filters", hymnConnect: true, hymnConnectPro: true },
  { no: 5, feature: "Pinch zoom to adjust size of fonts", hymnConnect: true, hymnConnectPro: true },
  { no: 6, feature: "Romanized lyrics", hymnConnect: true, hymnConnectPro: true },
  { no: 7, feature: "Swipe to change songs", hymnConnect: true, hymnConnectPro: true },
  { no: 8, feature: "Ad-free experience", hymnConnect: true, hymnConnectPro: true },
  { no: 9, feature: "Offline access", hymnConnect: true, hymnConnectPro: true },
  { no: 10, feature: "Light and dark mode", hymnConnect: true, hymnConnectPro: true },
  { no: 11, feature: "Create multiple playlists / Song lists", hymnConnect: false, hymnConnectPro: true },
  { no: 12, feature: "Organise order and rename song list", hymnConnect: false, hymnConnectPro: true },
  { no: 13, feature: "Organise order of songs within song lists", hymnConnect: false, hymnConnectPro: true },
  { no: 14, feature: "Slide Show", hymnConnect: false, hymnConnectPro: true },
  { no: 15, feature: "Priority Updates", hymnConnect: false, hymnConnectPro: true },
];

const containerStyle = {
  maxWidth: "900px",
  margin: "0 auto",
  padding: "1.5rem",
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  color: "#0f172a", // slate-900-ish
};

const cardStyle = {
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
  padding: "16px 20px",
  backgroundColor: "#ffffff",
  boxShadow: "0 1px 3px rgba(15,23,42,0.08)",
};

const proCardStyle = {
  ...cardStyle,
  borderColor: "#c7d2fe",
  backgroundColor: "#eef2ff",
};

const tableWrapperStyle = {
  overflowX: "auto",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
  backgroundColor: "#ffffff",
  boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.9rem",
};

const thStyle = {
  padding: "8px 12px",
  borderBottom: "1px solid #e5e7eb",
  textAlign: "left",
  fontSize: "0.75rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "#6b7280",
  backgroundColor: "#f3f4f6",
};

const tdStyle = {
  padding: "8px 12px",
  borderBottom: "1px solid #e5e7eb",
  verticalAlign: "top",
};

const MobileAppsPage = () => {
  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <div style={containerStyle}>
        {/* Header */}
        <header
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            paddingBottom: "12px",
            marginBottom: "24px",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img
              src={logo}
              alt="HymnConnect"
              width={140}          // << fixed size
              style={{ height: "auto", display: "block" }}
            />
            <div>
              <h1 style={{ fontSize: "1.35rem", fontWeight: 600, margin: 0 }}>
                HymnConnect Mobile Apps
              </h1>
              <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "#6b7280" }}>
                Compare HymnConnect and HymnConnect PRO.
              </p>
            </div>
          </div>
          <div style={{ fontSize: "0.75rem", color: "#6b7280", textAlign: "right" }}>
            Available on iOS
            <br />
            Android coming soon
          </div>
        </header>

        {/* Feature comparison */}
        <section style={{ marginBottom: "28px" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "6px" }}>
            Feature comparison
          </h2>
          <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "12px" }}>
            Features 1–10 are available in both apps. Features 11–15 are exclusive to{" "}
            <span style={{ fontWeight: 600 }}>HymnConnect PRO</span>.
          </p>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, width: "40px" }}>#</th>
                  <th style={thStyle}>Feature</th>
                  <th style={{ ...thStyle, textAlign: "center", width: "120px" }}>HymnConnect</th>
                  <th style={{ ...thStyle, textAlign: "center", width: "150px" }}>HymnConnect PRO</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={row.no}
                    style={{
                      backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9fafb",
                    }}
                  >
                    <td style={tdStyle}>{row.no}</td>
                    <td style={tdStyle}>{row.feature}</td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      {row.hymnConnect ? (
                        <span style={{ color: "#059669", fontWeight: 600 }}>✓</span>
                      ) : (
                        ""
                      )}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      {row.hymnConnectPro ? (
                        <span style={{ color: "#059669", fontWeight: 600 }}>✓</span>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Download sections */}
        <section style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "4px" }}>
            Download the apps
          </h2>

          {/* HymnConnect card */}
          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                marginBottom: "12px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>HymnConnect</h3>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280" }}>
                The core HymnConnect experience with powerful search and offline access.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "12px",
              }}
            >
              {/* App Store */}
              <a
                href="https://apps.apple.com/in/app/hymnconnectapp/id6752904013"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={appStoreBadge}
                  alt="Download HymnConnect on the App Store"
                  width={170}    // << fixed size
                  style={{ height: "auto", display: "block" }}
                />
              </a>

              {/* Play Store - Coming Soon */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <img
                  src={playStoreBadge}
                  alt="HymnConnect on Google Play (Coming Soon)"
                  width={170}    // << fixed size
                  style={{ height: "auto", display: "block", opacity: 0.4 }}
                />
                <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                  Coming soon on Google Play
                </span>
              </div>
            </div>
          </div>

          {/* HymnConnect PRO card */}
          <div style={proCardStyle}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>
                    HymnConnect PRO
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#4b5563" }}>
                    Unlock playlists, slideshow mode and priority updates—designed for worship
                    leaders and teams.
                  </p>
                </div>
                <span
                  style={{
                    backgroundColor: "#4f46e5",
                    color: "#ffffff",
                    borderRadius: "999px",
                    padding: "4px 10px",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  PRO Features
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "12px",
              }}
            >
              {/* App Store */}
              <a
                href="https://apps.apple.com/in/app/hymnconnect-pro/id6754710563"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={appStoreBadge}
                  alt="Download HymnConnect PRO on the App Store"
                  width={170}    // << fixed size
                  style={{ height: "auto", display: "block" }}
                />
              </a>

              {/* Play Store - Coming Soon */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <img
                  src={playStoreBadge}
                  alt="HymnConnect PRO on Google Play (Coming Soon)"
                  width={170}    // << fixed size
                  style={{ height: "auto", display: "block", opacity: 0.4 }}
                />
                <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                  Coming soon on Google Play
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MobileAppsPage;