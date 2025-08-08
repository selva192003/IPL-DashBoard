import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TeamList from './components/TeamList';
import TeamPage from './components/TeamPage'; // CORRECTED: Default import is correct
import MatchPage from './components/MatchPage';
import PlayerList from './components/PlayerList';
import PlayerPage from './components/PlayerPage';
import HeadToHeadPage from './components/HeadToHeadPage';
import SearchResultsPage from './components/SearchResultsPage';
import HomePage from './components/HomePage';
import Layout from './components/Layout'; // NEW: Import Layout

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Routes without the Layout */}
          <Route path="/" element={<HomePage />} />
          <Route path="/teams/:teamName" element={<TeamPage />} />
          <Route path="/teams" element={<TeamList />} />
          <Route path="/matches/:id" element={<MatchPage />} />
          <Route path="/players/:playerName" element={<PlayerPage />} />
          <Route path="/players" element={<PlayerList />} />
          <Route path="/head-to-head" element={<HeadToHeadPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          {/* You can add a wrapper for routes that should have a common layout */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
