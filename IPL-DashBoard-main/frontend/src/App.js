import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TeamList from './components/TeamList';
import { TeamPage } from './components/TeamPage';
import MatchPage from './components/MatchPage';
import PlayerList from './components/PlayerList';
import PlayerPage from './components/PlayerPage';
import HeadToHeadPage from './components/HeadToHeadPage';
import SearchResultsPage from './components/SearchResultsPage';
import HomePage from './components/HomePage';
import NavBar from './components/NavBar';
import LiveScorePage from './components/LiveScorePage';

function App() {
  return (
    <div className="App ui-app min-h-screen text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="ui-backdrop-base" />
        <div className="ui-backdrop-glow-a" />
        <div className="ui-backdrop-glow-b" />
      </div>

      <Router>
        <NavBar />

        <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/live" element={<LiveScorePage />} />
            <Route path="/teams/:teamName" element={<TeamPage />} />
            <Route path="/teams" element={<TeamList />} />
            <Route path="/matches/:id" element={<MatchPage />} />
            <Route path="/players/:playerName" element={<PlayerPage />} />
            <Route path="/players" element={<PlayerList />} />
            <Route path="/head-to-head" element={<HeadToHeadPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
          </Routes>
        </main>

        <footer className="ui-chrome border-t" style={{ borderColor: 'var(--ui-border)' }}>
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-sm">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="flex items-center justify-center gap-3">
                <a
                  className="ui-btn-secondary h-10 w-10 p-0 grid place-items-center"
                  href="https://www.linkedin.com/in/selva-j-89ba092b5"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.047c.476-.9 1.637-1.85 3.368-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.727v20.545C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.273V1.727C24 .774 23.2 0 22.222 0h.003Z" />
                  </svg>
                </a>
              </div>

              <div className="text-base sm:text-lg font-medium italic tracking-wide text-sky-200">
                Crafted with code, driven by an unconditional love for cricket
              </div>

              <div className="w-28 ui-divider-soft" />

              <div className="text-slate-200">© {new Date().getFullYear()} Selva J Project. All rights reserved.</div>
              <div className="text-slate-400">
                For any queries and suggestions, contact:{' '}
                <a href="mailto:selvaj192003@gamil.com" className="underline underline-offset-4 text-slate-200">
                  selvaj192003@gamil.com
                </a>
              </div>
            </div>
          </div>
        </footer>
      </Router>
    </div>
  );
}

export default App;