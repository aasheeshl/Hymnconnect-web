import { useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { db } from "./firebase";
import { onValue, ref, runTransaction } from "firebase/database";
import "./App.css";
import logo from "./assets/hymnconnect-logo.png";
import MobileAppsPage from "./MobileAppsPage";

// ------------------------
// "Add to Home Screen" button (PWA install)
// ------------------------
function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent the default mini-infobar
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    // If user accepted, hide the button
    if (outcome === "accepted") {
      setVisible(false);
      setDeferredPrompt(null);
    }
  };

  // Only show if browser says app can be installed
  if (!visible) return null;

  return (
    <button className="install-button" onClick={handleClick}>
      Add to Home Screen
    </button>
  );
}


// ------------------------
// Main HymnConnect screen
// ------------------------
function MainScreen() {
  const [songs, setSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [selectedSong, setSelectedSong] = useState(null);
  const [fontSize, setFontSize] = useState(18);
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    const songsRef = ref(db, "songs");
    const unsubscribe = onValue(songsRef, (snapshot) => {
      const val = snapshot.val() || {};
      const list = Object.values(val);
      setSongs(list);
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    const visitsRef = ref(db, "stats/visits");

    // 1) Increment only once per browser (using localStorage)
    const alreadyCounted = localStorage.getItem("hc_visit_counted");
    if (!alreadyCounted) {
      runTransaction(visitsRef, (current) => {
        if (current === null || current === undefined) {
          return 1;
        }
        return current + 1;
      })
        .then(() => {
          localStorage.setItem("hc_visit_counted", "1");
        })
        .catch((err) => {
          console.error("Error updating visit counter:", err);
        });
    }

    // 2) Listen for changes to show live visitor count
    const unsubscribe = onValue(visitsRef, (snapshot) => {
      const val = snapshot.val();
      if (typeof val === "number") {
        setVisitorCount(val);
      }
    });

    return () => unsubscribe();
  }, []);


  const filteredSongs = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return songs
      .filter((song) => {
        if (languageFilter === "All") return true;

        const lang = (song.language || "").toLowerCase().trim();

        if (!lang) return false;

        if (languageFilter === "English") {
          return lang.includes("english") || lang === "en" || lang === "eng";
        }

        if (languageFilter === "Hindi") {
          return lang.includes("hindi") || lang === "hi" || lang === "hin";
        }

        if (languageFilter === "Marathi") {
          return lang.includes("marathi") || lang === "ma" || lang === "mar";
        }

        return true;
      })
      .filter((song) => {
        if (!q) return true;

        const idStr = String(song.id ?? "").toLowerCase();
        const title = (song.title ?? "").toLowerCase();
        const dtitle = (song.dtitle ?? "").toLowerCase();

        return (
          idStr.includes(q) ||
          title.includes(q) ||
          dtitle.includes(q)
        );
      })
      .sort((a, b) => Number(a.id) - Number(b.id));
  }, [songs, searchTerm, languageFilter]);

  const handleClearSearch = () => setSearchTerm("");

  const handleSongClick = (song) => {
    setSelectedSong(song);
  };

  const handleBack = () => {
    setSelectedSong(null);
  };

  const increaseFont = () =>
    setFontSize((prev) => Math.min(prev + 2, 40));
  const decreaseFont = () =>
    setFontSize((prev) => Math.max(prev - 2, 12));

  // Parse lyrics to remove [chorus]/[verse] tags and color chorus blue
  const renderLyrics = () => {
    if (!selectedSong?.lyrics) return null;

    const lines = selectedSong.lyrics.split(/\r?\n/);
    const sections = [];
    let currentLines = [];
    let currentType = "verse";

    const pushSection = () => {
      if (!currentLines.length) return;
      sections.push({
        type: currentType,
        text: currentLines.join("\n"),
      });
      currentLines = [];
    };

    lines.forEach((rawLine) => {
      const line = rawLine.trim();
      const lower = line.toLowerCase();

      if (!line) {
        currentLines.push("");
        return;
      }

      if (lower.startsWith("[chorus")) {
        pushSection();
        currentType = "chorus";
        return; // skip the tag line itself
      }

      if (lower.startsWith("[verse")) {
        pushSection();
        currentType = "verse";
        return; // skip the tag line itself
      }

      currentLines.push(rawLine);
    });

    pushSection();

    return sections.map((section, idx) => {
      const lines = section.text.split("\n");
      return (
        <p
          key={idx}
          className={
            section.type === "chorus"
              ? "lyrics-section chorus no-select"
              : "lyrics-section verse no-select"
          }
        >
          {lines.map((l, i) => (
            <span key={i}>
              {l}
              {i < lines.length - 1 && <br />}
            </span>
          ))}
        </p>
      );
    });
  };

  return (
    <div className="app-root">
      {/* Branding header */}
      <header className="app-header">
        {/* Click logo/name to go "home" and clear selected song */}
        <Link
          to="/"
          className="brand-left"
          onClick={() => setSelectedSong(null)}
        >
          <img
            src={logo}
            alt="HymnConnect logo"
            className="brand-logo"
          />
          <span className="brand-name"></span>
        </Link>

        <div className="header-right">
          {/* Link to Mobile Apps page as button */}
          <Link
            to="/mobile-apps"
            className="apps-button"
          >
            Get the Mobile App
          </Link>
        </div>
      </header>

      {/* LIST SCREEN */}
      {!selectedSong && (
        <div className="main-screen">
          {/* Top content: ONLY search bar + language filters */}
          <div className="search-section">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search by title/Song no./Author/Album"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button
                  className="search-clear-button"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            <div className="language-filters">
              {["All", "English", "Hindi", "Marathi"].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  className={
                    languageFilter === lang
                      ? "lang-chip active"
                      : "lang-chip"
                  }
                  onClick={() => setLanguageFilter(lang)}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Song list */}
          <div className="song-list">
            {filteredSongs.map((song) => (
              <button
                key={`${song.id}-${song.dtitle}`}
                type="button"
                className="song-list-item"
                onClick={() => handleSongClick(song)}
              >
                {song.id}. {song.dtitle}
              </button>
            ))}

            {filteredSongs.length === 0 && (
              <div className="empty-state">
                No songs found. Try a different search.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SONG DETAIL SCREEN (FULL PAGE CARD) */}
      {selectedSong && (
        <div className="song-detail-screen">
          <header className="song-detail-header">
            <button
              type="button"
              className="back-button"
              onClick={handleBack}
            >
              ← Back
            </button>

            <div className="font-controls">
              <button
                type="button"
                className="font-btn"
                onClick={decreaseFont}
              >
                A-
              </button>
              <button
                type="button"
                className="font-btn"
                onClick={increaseFont}
              >
                A+
              </button>
            </div>
          </header>

          <main className="song-detail-content">
            <h1 className="song-detail-title">
              {selectedSong.id}. {selectedSong.dtitle}
            </h1>

            <div
              className="song-lyrics no-select"
              style={{ fontSize: `${fontSize}px` }}
            >
              {renderLyrics()}
            </div>
          </main>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        © {new Date().getFullYear()} Aasheesh Lall. All rights reserved.
        <br />
        <span className="visitor-count">
          Visitors: {visitorCount}
        </span>
      </footer>

    </div>
  );
}

// ------------------------
// Router wrapper
// ------------------------
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/mobile-apps" element={<MobileAppsPage />} />
      </Routes>
    </Router>
  );
}

export default App;