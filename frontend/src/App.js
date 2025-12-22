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

function App() {
  return (
    // The main container for the entire application, holding both the nav bar and the content
    <div className="App bg-gray-900 text-white min-h-screen">
      <Router>
        <NavBar /> {/* The NavBar is now a top-level component */}
        <div className="container mx-auto p-4 flex-grow"> {/* This container holds all the pages */}
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