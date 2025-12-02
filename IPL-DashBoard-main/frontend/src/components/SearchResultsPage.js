import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader';

// Define the base URL using the environment variable.
// This is crucial for Vercel to connect to the Render backend in production.
const BASE_URL = process.env.REACT_APP_BACKEND_URL || '';

const SearchResultsPage = () => {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation(); // Hook to access URL query parameters
    const searchQuery = new URLSearchParams(location.search).get('query'); // Get 'query' param

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!searchQuery) {
                setResults(null);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                // CORRECTED: Use BASE_URL prefix for the search API call
                const response = await axios.get(`${BASE_URL}/api/v1/search?query=${searchQuery}`);
                setResults(response.data);
            } catch (err) {
                console.error("Error fetching search results:", err);
                setError("Failed to load search results. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [searchQuery]); // Re-fetch when search query changes

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-center text-red-500 p-4">{error}</div>;
    }

    if (!results || (results.teams.length === 0 && results.players.length === 0)) {
        return <div className="text-center p-4">No results found for "{searchQuery}".</div>;
    }

    return (
        <div className="SearchResultsPage p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Search Results for "{searchQuery}"</h1>

            {results.teams.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Teams:</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {results.teams.map(team => (
                            <Link to={`/teams/${team.teamName}`} key={team.teamName} className="block">
                                <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                                    <h3 className="text-xl font-semibold text-indigo-700">{team.teamName}</h3>
                                    <p>Matches: {team.totalMatches}</p>
                                    <p>Wins: {team.totalWins}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {results.players.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Players:</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {results.players.map(player => (
                            <Link to={`/players/${player.name}`} key={player.name} className="block">
                                <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                                    <h3 className="text-xl font-semibold text-green-700">{player.name}</h3>
                                    <p>Player of the Match Awards: {player.totalPlayerOfMatchAwards}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchResultsPage;