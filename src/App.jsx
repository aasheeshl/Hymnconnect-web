import { useEffect, useMemo, useState } from "react";
import { db } from "./firebase";
import { onValue, ref } from "firebase/database";

//
// Helper to format lyrics: hide [chorus]/[verse] tags, make chorus blue
//
function formatLyrics(lyrics) {
  if (!lyrics) return null;

  const lines = lyrics.split(/\r?\n/);

  const blocks = [];
  let currentType = "other"; // "chorus" | "verse" | "other"

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (/^\[chorus\]/i.test(line)) {
      currentType = "chorus";
      continue; // skip the tag line itself
    }
    if (/^\[verse\]/i.test(line)) {
      currentType = "verse";
      continue; // skip the tag line itself
    }

    // New block when type changes
    if (!blocks.length || blocks[blocks.length - 1].type !== currentType) {
      blocks.push({ type: currentType, text: [] });
    }

    blocks[blocks.length - 1].text.push(rawLine);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {blocks.map((block, index) => (
        <p
          key={index}
          style={{
            margin: 0,
            whiteSpace: "pre-wrap",
            color: block.type === "chorus" ? "#1d4ed8" : "#020617",
          }}
        >
          {block.text.join("\n")}
        </p>
      ))}
    </div>
  );
}

//
// Language code → label + optional flag
//
const LANGUAGE_LABELS = {
  EN: { name: "English", flag: "🇬🇧" },
  HI: { name: "Hindi", flag: "🇮🇳" },
  MA: { name: "Marathi", flag: "🇮🇳" },
  // Add more like:
  // TE: { name: "Telugu", flag: "🇮🇳" },
  // TA: { name: "Tamil", flag: "🇮🇳" },
};

function getLanguageLabel(code) {
  if (!code) return "Unknown";
  const entry = LANGUAGE_LABELS[code];
  if (!entry) return code; // fallback: show the code itself
  return `${entry.flag ? entry.flag + " " : ""}${entry.name}`;
}

function getLanguageNameOnly(code) {
  const entry = LANGUAGE_LABELS[code];
  if (!entry) return code || "Unknown";
  return entry.name;
}

function App() {
  const [songs, setSongs] = useState([]); // Loaded from Firebase
  const [selectedSong, setSelectedSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("All");
  const [fontScale, setFontScale] = useState(1);

  //
  // Load songs from Firebase Realtime Database: /songs
  //
  useEffect(() => {
    const songsRef = ref(db, "songs");

    const unsubscribe = onValue(
      songsRef,
      (snapshot) => {
        const data = snapshot.val();

        if (!data) {
          setSongs([]);
          setSelectedSong(null);
          setLoading(false);
          return;
        }

        // Convert object → array
        const parsed = Object.keys(data).map((key) => {
          const item = data[key] || {};

          const title = item.title || "";
          const dtitle =
            item.dtitle || title || item.nativeTitle || "";

          return {
            // Use DB id if present, else key
            id: (item.id ?? key).toString(),

            // keep both but show only dtitle in UI
            title,
            dtitle,
            nativeTitle: item.nativeTitle || dtitle || title,

            language: item.language || "All",
            lyrics: item.lyrics || "",

            // Optional future fields:
            // category: item.category || "",
            // link: item.link || "",
          };
        });

        // Sort by ID (string compare)
        parsed.sort((a, b) => a.id.localeCompare(b.id));

        setSongs(parsed);
        setSelectedSong(parsed[0] || null);
        setLoading(false);
      },
      (err) => {
        console.error("Error loading songs:", err);
        setError("Failed to load songs. Please try again later.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  //
  // Build dynamic language list based on the songs loaded
  //
  const allLanguages = useMemo(() => {
    const set = new Set();

    songs.forEach((song) => {
      if (song.language) {
        set.add(song.language);
      }
    });

    return ["All", ...Array.from(set).sort()];
  }, [songs]);

  //
  // Filtered list based on search + selected language
  //
  const filteredSongs = useMemo(() => {
    const term = search.trim().toLowerCase();

    return songs.filter((song) => {
      // Language filter
      if (language !== "All" && song.language !== language) return false;

      if (!term) return true;

      // Search by title, dtitle or ID
      const inTitle = (song.title || "")
        .toLowerCase()
        .includes(term);
      const inDtitle = (song.dtitle || "")
        .toLowerCase()
        .includes(term);
      const inId = (song.id || "").toLowerCase().includes(term);

      return inTitle || inDtitle || inId;
    });
  }, [songs, search, language]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#e2e8f0",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "#020617",
          color: "white",
          padding: "12px 16px",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "20px" }}>HymnConnect</h1>
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              opacity: 0.75,
            }}
          >
            Digital hymnbook – Web version
          </p>
        </div>
        <a
          href="#https://apps.apple.com/us/app/hymnconnectapp/id6752904013"
          style={{
            fontSize: "11px",
            borderRadius: "999px",
            border: "1px solid rgba(148, 163, 184, 0.7)",
            padding: "4px 10px",
            textDecoration: "none",
            color: "white",
            whiteSpace: "nowrap",
          }}
        >
          Download iOS App
        </a>
      </header>

      {/* Main content: list (left) + lyrics (right) */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          gap: "12px",
          flexWrap: "wrap", // helps on narrow screens
        }}
      >
        {/* Left: search + filters + list */}
        <section
          style={{
            flexBasis: "40%",
            maxWidth: "420px",
            minWidth: "0", // prevent overflow
            display: "flex",
            flexDirection: "column",
            background: "white",
            borderRadius: "16px",
            padding: "12px",
            boxShadow: "0 4px 10px rgba(15,23,42,0.08)",
            boxSizing: "border-box",
          }}
        >
          {/* Search */}
          <div
            style={{
              marginBottom: "8px",
              position: "relative",
            }}
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or ID…"
              style={{
                width: "100%",
                borderRadius: "999px",
                border: "1px solid #cbd5f5",
                padding: search ? "8px 28px 8px 12px" : "8px 12px",
                fontSize: "13px",
                boxSizing: "border-box", // ensures it stays inside section
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "16px",
                  lineHeight: 1,
                  color: "#94a3b8",
                  padding: 0,
                }}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Language filter */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              marginBottom: "8px",
            }}
          >
            {allLanguages.map((lang) => {
              const isActive = language === lang;
              const label =
                lang === "All" ? "All" : getLanguageLabel(lang);

              return (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  style={{
                    borderRadius: "999px",
                    padding: "4px 10px",
                    fontSize: "11px",
                    border: isActive
                      ? "1px solid #020617"
                      : "1px solid #cbd5f5",
                    background: isActive ? "#020617" : "#f8fafc",
                    color: isActive ? "white" : "#020617",
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Results count */}
          <div
            style={{
              fontSize: "11px",
              color: "#64748b",
              marginBottom: "6px",
            }}
          >
            {loading
              ? "Loading songs…"
              : `${filteredSongs.length} song${
                  filteredSongs.length !== 1 ? "s" : ""
                } found`}
          </div>

          {/* Song list */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              background: "#f8fafc",
            }}
          >
            {loading && (
              <div
                style={{
                  padding: "12px",
                  fontSize: "12px",
                  color: "#94a3b8",
                }}
              >
                Loading songs from HymnConnect database…
              </div>
            )}

            {!loading && error && (
              <div
                style={{
                  padding: "12px",
                  fontSize: "12px",
                  color: "#b91c1c",
                }}
              >
                {error}
              </div>
            )}

            {!loading &&
              !error &&
              filteredSongs.map((song) => {
                const isSelected =
                  selectedSong && selectedSong.id === song.id;
                const languageName = getLanguageNameOnly(
                  song.language
                );

                return (
                  <button
                    key={song.id}
                    onClick={() => setSelectedSong(song)}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 10px",
                      border: "none",
                      borderBottom: "1px solid #e2e8f0",
                      background: isSelected ? "#e2e8f0" : "transparent",
                      cursor: "pointer",
                    }}
                  >
                    <div
  style={{
    fontSize: "13px",
    fontWeight: 600,
    color: "#020617",
  }}
>
  {song.id}. {song.dtitle}
</div>
                  </button>
                );
              })}

            {!loading && !error && filteredSongs.length === 0 && (
              <div
                style={{
                  padding: "12px",
                  fontSize: "12px",
                  color: "#94a3b8",
                }}
              >
                No songs match your search.
              </div>
            )}
          </div>
        </section>

        {/* Right: lyrics viewer */}
        <section
          style={{
            flex: 1,
            minWidth: "0",
            display: "flex",
            flexDirection: "column",
            background: "white",
            borderRadius: "16px",
            padding: "12px",
            boxShadow: "0 4px 10px rgba(15,23,42,0.08)",
            boxSizing: "border-box",
          }}
        >
          {selectedSong ? (
            <>
              {/* Song header + font size control */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <div>
                  <h2
  style={{
    margin: 0,
    fontSize: "18px",
  }}
>
  {selectedSong.id}. {selectedSong.dtitle}
</h2>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "4px",
                    alignItems: "center",
                  }}
                >
                  <button
                    onClick={() =>
                      setFontScale((s) => Math.max(0.8, s - 0.1))
                    }
                    style={{
  width: "26px",
  height: "26px",
  borderRadius: "999px",
  border: "1px solid #cbd5f5",
  fontSize: "12px",
  cursor: "pointer",
  background: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  lineHeight: 1,
}}
                  >
                    A-
                  </button>
                  <button
                    onClick={() =>
                      setFontScale((s) => Math.min(1.6, s + 0.1))
                    }
                    style={{
  width: "26px",
  height: "26px",
  borderRadius: "999px",
  border: "1px solid #cbd5f5",
  fontSize: "12px",
  cursor: "pointer",
  background: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  lineHeight: 1,
}}
                  >
                    A+
                  </button>
                </div>
              </div>

              {/* Lyrics area */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  padding: "10px",
                  fontSize: `${fontScale}rem`,
                  lineHeight: 1.5,
                  textAlign: "center"
                }}
              >
                {formatLyrics(selectedSong.lyrics)}
              </div>
            </>
          ) : (
            <div
              style={{
                margin: "auto",
                textAlign: "center",
                fontSize: "13px",
                color: "#94a3b8",
              }}
            >
              {loading
                ? "Loading songs…"
                : "Select a song from the list to view its lyrics."}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          fontSize: "11px",
          color: "#64748b",
          paddingTop: "4px",
        }}
      >
        © {new Date().getFullYear()} HymnConnect • For personal worship & devotion
      </footer>
    </div>
  );
}

export default App;