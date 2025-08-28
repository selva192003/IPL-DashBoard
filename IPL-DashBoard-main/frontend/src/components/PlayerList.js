import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from './Loader';
import { Link } from 'react-router-dom';

const PlayerList = () => {
    const [allPlayers, setAllPlayers] = useState([]); // Store all fetched players
    const [filteredPlayers, setFilteredPlayers] = useState([]); // Players displayed after filtering
    const [searchQuery, setSearchQuery] = useState(''); // New state for local search input
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                setLoading(true);
                setError(null);
                // Use a relative URL to correctly route through the proxy
                const response = await axios.get(`/api/v1/players`);
                setAllPlayers(response.data);
                setFilteredPlayers(response.data); // Initially display all players
            } catch (err) {
                console.error("Error fetching players:", err);
                setError("Failed to load players. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchPlayers();
    }, []);

    // New: Effect to filter players based on search query
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredPlayers(allPlayers); // If search is empty, show all players
        } else {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const results = allPlayers.filter(player =>
                player.name.toLowerCase().includes(lowerCaseQuery)
            );
            setFilteredPlayers(results);
        }
    }, [searchQuery, allPlayers]); // Re-filter when search query or allPlayers change

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-center text-red-500 p-4">{error}</div>;
    }

    if (allPlayers.length === 0 && !loading) { // Check allPlayers length only after loading
        return <div className="text-center p-4">No players found in the database.</div>;
    }

    return (
        <div className="PlayerList p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">All IPL Players</h1>

            {/* NEW: Local Search Bar for Players */}
            <div className="mb-6 flex justify-center">
                <input
                    type="text"
                    placeholder="Search players by name..."
                    className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 w-full max-w-md"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            {/* END NEW: Local Search Bar */}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredPlayers.length > 0 ? (
                    filteredPlayers.map(player => (
                        <Link to={`/players/${player.name}`} key={player.name} className="block">
                            <div className="player-card bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                                <h2 className="text-xl font-semibold text-indigo-700">{player.name}</h2>
                                <p className="text-gray-600">Player of the Match Awards: <span className="font-medium">{player.totalPlayerOfMatchAwards}</span></p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-center w-full col-span-full">No players found matching your search.</p>
                )}
            </div>
        </div>
    );
};

export default PlayerList;