import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from './Loader'; // Assuming you have a Loader component
import { Link } from 'react-router-dom'; // Import Link

const PlayerList = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`${process.env.REACT_APP_API_ROOT_URL}/players`);
                setPlayers(response.data);
            } catch (err) {
                console.error("Error fetching players:", err);
                setError("Failed to load players. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchPlayers();
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-center text-red-500 p-4">{error}</div>;
    }

    if (players.length === 0) {
        return <div className="text-center p-4">No players found.</div>;
    }

    return (
        <div className="PlayerList p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">All IPL Players</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {players.map(player => (
                    // Wrap player card with Link component
                    <Link to={`/players/${player.name}`} key={player.name} className="block">
                        <div className="player-card bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                            <h2 className="text-xl font-semibold text-indigo-700">{player.name}</h2>
                            <p className="text-gray-600">Player of the Match Awards: <span className="font-medium">{player.totalPlayerOfMatchAwards}</span></p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default PlayerList;
