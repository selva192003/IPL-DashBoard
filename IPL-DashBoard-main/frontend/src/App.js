    import './App.css';
    import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
    import TeamList from './components/TeamList';
    import { TeamPage } from './components/TeamPage';
    import MatchPage from './components/MatchPage';
    import PlayerList from './components/PlayerList';
    import PlayerPage from './components/PlayerPage';
    import HeadToHeadPage from './components/HeadToHeadPage'; // New: Import HeadToHeadPage

    function App() {
      return (
        <div className="App min-h-screen bg-gray-100 font-sans text-gray-800">
          <Router>
            {/* Simple Navigation Header */}
            <nav className="bg-gray-800 p-4 shadow-md">
              <ul className="flex justify-center space-x-6">
                <li>
                  <Link to="/teams" className="text-white hover:text-indigo-300 text-lg font-medium transition-colors duration-200">IPL Teams</Link>
                </li>
                <li>
                  <Link to="/players" className="text-white hover:text-indigo-300 text-lg font-medium transition-colors duration-200">IPL Players</Link>
                </li>
                <li>
                  <Link to="/head-to-head" className="text-white hover:text-indigo-300 text-lg font-medium transition-colors duration-200">Head-to-Head</Link> {/* New: Link to Head-to-Head */}
                </li>
              </ul>
            </nav>

            <div className="container mx-auto p-4">
              <Routes>
                {/* Redirect from "/" to "/teams" */}
                <Route path="/" element={<Navigate to="/teams" replace />} />

                <Route path="/teams/:teamName" element={<TeamPage />} />
                <Route path="/teams" element={<TeamList />} />
                <Route path="/matches/:id" element={<MatchPage />} />
                <Route path="/players/:playerName" element={<PlayerPage />} />
                <Route path="/players" element={<PlayerList />} />
                <Route path="/head-to-head" element={<HeadToHeadPage />} /> {/* New: Route for HeadToHeadPage */}
              </Routes>
            </div>
          </Router>
        </div>
      );
    }

    export default App;
    