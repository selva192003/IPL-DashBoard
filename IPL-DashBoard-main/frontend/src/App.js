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

        <footer className="border-t" style={{ borderColor: 'var(--ui-border)' }}>
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-sm text-slate-400">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span>IPL Dashboard</span>
              <span>Stats and match insights</span>
            </div>
          </div>
        </footer>
      </Router>
    </div>
  );
}

export default App;