import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import TeamList from "./components/TeamList";
import TeamPage from "./components/TeamPage";
import MatchPage from "./components/MatchPage";

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="App">
        <h1>IPL Dashboard</h1>
        <Routes>
          <Route path="/" element={<TeamList />} />
          <Route path="/team/:teamName" element={<TeamPage />} />
          <Route path="/match/:matchId" element={<MatchPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
