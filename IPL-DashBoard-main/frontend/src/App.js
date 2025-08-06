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

function App() {
  return (
    // Apply overall app styling classes
    <div className="App bg-gray-900 text-white min-h-screen">
      <Router>
        {/* The HomePage itself will contain navigation links */}
        {/* Other pages will be rendered within the main container */}
        <div className="container mx-auto p-4 flex-grow"> {/* flex-grow to push footer down */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/teams/:teamName" element={<TeamPage />} />
            <Route path="/teams" element={<TeamList />} />
            <Route path="/matches/:id" element={<MatchPage />} />
            <Route path="/players/:playerName" element={<PlayerPage />} />
            <Route path="/players" element={<PlayerList />} />
            <Route path="/head-to-head" element={<HeadToHeadPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
