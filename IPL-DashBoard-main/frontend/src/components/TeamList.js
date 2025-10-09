import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loader from './Loader';

// Hardcoded comprehensive lists for filters extracted from DataLoader.java / CSV data
const ALL_VENUES = [
    'All Venues',
    'MA Chidambaram Stadium, Chennai', 'M Chinnaswamy Stadium, Bengaluru', 'Arun Jaitley Stadium, Delhi', 
    'Wankhede Stadium, Mumbai', 'Rajiv Gandhi International Stadium, Hyderabad', 'Narendra Modi Stadium, Ahmedabad', 
    'Maharashtra Cricket Association Stadium, Pune', 'HPCA Stadium, Dharamshala', 'JSCA International Stadium Complex, Ranchi', 
    'Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium, Visakhapatnam', 'Punjab Cricket Association Stadium, Mohali', 
    'Subrata Roy Sahara Stadium, Pune', 'Saurashtra Cricket Association Stadium, Rajkot', 'Holkar Cricket Stadium, Indore', 
    'Sawai Mansingh Stadium, Jaipur', 'Green Park, Kanpur', 'Eden Gardens, Kolkata', 
    'Dr DY Patil Sports Academy, Mumbai', 'Sheikh Zayed Stadium, Abu Dhabi', 'Dubai International Cricket Stadium, Dubai', 
    'Sharjah Cricket Stadium, Sharjah', 'Newlands, Cape Town', 'St George\'s Park, Port Elizabeth', 
    'Kingsmead, Durban', 'SuperSport Park, Centurion', 'OUTsurance Oval, Bloemfontein', 
    'New Wanderers Stadium, Johannesburg', 'Buffalo Park, East London', 'De Beers Diamond Oval, Kimberley', 
    'Ekana Cricket Stadium, Lucknow', 'Barsapara Cricket Stadium, Guwahati', 'Shaheed Veer Narayan Singh International Stadium, Raipur', 
    'Zayed Cricket Stadium, Abu Dhabi', 'Nehru Stadium, Kochi', 'Brabourne Stadium, Mumbai', 
    'Vidarbha Cricket Association Stadium, Nagpur', 'Greenfield International Stadium, Thiruvananthapuram'
];

const ALL_MATCH_TYPES = [
    'All Match Types',
    'League', 'Eliminator', 'Qualifier 1', 'Qualifier 2', 'Final', 'Semi Final', '3rd Place Play-Off'
];

const TeamList = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [venueFilter, setVenueFilter] = useState('All Venues'); // New state for venue filter
    const [matchTypeFilter, setMatchTypeFilter] = useState('All Match Types'); // New state for match type filter

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Construct query parameters
                const params = new URLSearchParams();
                if (venueFilter !== 'All Venues') {
                    params.append('venue', venueFilter);
                }
                if (matchTypeFilter !== 'All Match Types') {
                    params.append('matchType', matchTypeFilter);
                }
                
                const query = params.toString();
                const apiUrl = `/api/v1/team/stats${query ? '?' + query : ''}`;

                // Use the new /api/v1/team/stats endpoint for filtered aggregated data
                const response = await axios.get(apiUrl);
                setTeams(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load teams:", err);
                setError("Failed to load teams. Please check your backend server and API URL.");
                setLoading(false);
            }
        };

        fetchTeams();
    }, [venueFilter, matchTypeFilter]); // Re-fetch on filter change

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-center text-red-500 p-4">{error}</div>;
    }
    
    const teamsToShow = teams.filter(team => team.totalMatches > 0);

    return (
        <div className="TeamList p-4">
            <h1 className="text-4xl font-bold text-center mb-6 text-indigo-400">IPL Teams Performance</h1>
            
            {/* NEW: Filter Bar */}
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6 mb-8">
                {/* Venue Filter */}
                <select 
                    className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-auto"
                    value={venueFilter} 
                    onChange={(e) => setVenueFilter(e.target.value)}>
                    {ALL_VENUES.map(venue => (
                        <option key={venue} value={venue}>{venue}</option>
                    ))}
                </select>

                {/* Match Type Filter */}
                <select 
                    className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-auto"
                    value={matchTypeFilter} 
                    onChange={(e) => setMatchTypeFilter(e.target.value)}>
                    {ALL_MATCH_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>
            {/* END NEW: Filter Bar */}


            {teamsToShow.length === 0 ? (
                <div className="text-center p-4">
                    No teams found matching the current filter criteria ({venueFilter}, {matchTypeFilter}).
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamsToShow.map(team => (
                        <div key={team.teamName} className="bg-gray-800 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
                            {/* Pass filters as URL parameters to TeamPage for accurate match list filtering */}
                            <Link 
                                to={`/teams/${team.teamName}?venue=${venueFilter === 'All Venues' ? '' : venueFilter}&matchType=${matchTypeFilter === 'All Match Types' ? '' : matchTypeFilter}`} 
                                className="text-white hover:text-indigo-300"
                            >
                                <h2 className="text-2xl font-semibold mb-2">{team.teamName}</h2>
                                <p className="text-sm text-gray-400">Total Matches: {team.totalMatches}</p>
                                <p className="text-sm text-gray-400">Total Wins: {team.totalWins}</p>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeamList;