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

const MobileAppsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header with logo */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="HymnConnect"
              className="h-10 w-auto sm:h-12"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
                HymnConnect Mobile Apps
              </h1>
              <p className="text-sm text-slate-500">
                Compare HymnConnect and HymnConnect PRO.
              </p>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-slate-500">
            Available on iOS • Android coming soon
          </div>
        </header>

        {/* Feature comparison table */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Feature comparison
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Features 1–10 are available in both apps. Features 11–15 are exclusive to{" "}
            <span className="font-semibold">HymnConnect PRO</span>.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 w-12">
                    #
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Feature
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 w-32">
                    HymnConnect
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 w-40">
                    HymnConnect PRO
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={row.no}
                    className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
                  >
                    <td className="px-3 py-2 align-top text-slate-700">
                      {row.no}
                    </td>
                    <td className="px-3 py-2 align-top text-slate-800">
                      {row.feature}
                    </td>
                    <td className="px-3 py-2 align-top text-center">
                      {row.hymnConnect && (
                        <span className="text-emerald-600 font-semibold">✓</span>
                      )}
                    </td>
                    <td className="px-3 py-2 align-top text-center">
                      {row.hymnConnectPro && (
                        <span className="text-emerald-600 font-semibold">✓</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Download sections */}
        <section className="space-y-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Download the apps
          </h2>

          {/* HymnConnect card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                  HymnConnect
                </h3>
                <p className="text-sm text-slate-500">
                  The core HymnConnect experience with powerful search and offline access.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* App Store */}
              <a
                href="https://apps.apple.com/in/app/hymnconnectapp/id6752904013"
                target="_blank"
                rel="noreferrer"
                className="inline-block"
              >
                <img
                  src={appStoreBadge}
                  alt="Download HymnConnect on the App Store"
                  className="h-12 w-auto"
                />
              </a>

              {/* Play Store - Coming Soon */}
              <div className="flex items-center gap-2">
                <img
                  src={playStoreBadge}
                  alt="HymnConnect on Google Play (Coming Soon)"
                  className="h-12 w-auto opacity-40"
                />
                <span className="text-xs text-slate-500">
                  Coming soon on Google Play
                </span>
              </div>
            </div>
          </div>

          {/* HymnConnect PRO card */}
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4 sm:p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                  HymnConnect PRO
                </h3>
                <p className="text-sm text-slate-600">
                  Unlock playlists, slideshow mode and priority updates—designed for worship leaders and teams.
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-indigo-600 px-3 py-1 text-xs font-medium text-white">
                PRO Features
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* App Store */}
              <a
                href="https://apps.apple.com/in/app/hymnconnect-pro/id6754710563"
                target="_blank"
                rel="noreferrer"
                className="inline-block"
              >
                <img
                  src={appStoreBadge}
                  alt="Download HymnConnect PRO on the App Store"
                  className="h-12 w-auto"
                />
              </a>

              {/* Play Store - Coming Soon */}
              <div className="flex items-center gap-2">
                <img
                  src={playStoreBadge}
                  alt="HymnConnect PRO on Google Play (Coming Soon)"
                  className="h-12 w-auto opacity-40"
                />
                <span className="text-xs text-slate-500">
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