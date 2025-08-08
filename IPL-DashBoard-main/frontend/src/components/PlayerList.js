import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import getPlayerImageUrl from './playerImages';

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
        return <div className="text-center p-4">No player data available.</div>;
    }

    return (
        <div className="PlayerList p-4 text-white">
            <h1 className="text-4xl font-bold text-center mb-8 text-indigo-400">All IPL Players</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {players.map(player => (
                    <Link to={`/players/${player.name}`} key={player.name} className="block">
                        <div className="card bg-gray-800 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                            <div className="flex flex-col items-center">
                                {/* Player Image */}
                                <img
                                    src={getPlayerImageUrl(player.name)}
                                    alt={player.name}
                                    className="w-24 h-24 rounded-full border-4 border-yellow-300 object-cover mb-4"
                                />
                                <h2 className="text-2xl font-extrabold text-yellow-300 mb-1">{player.name}</h2>
                                <p className="text-lg text-gray-300">
                                    Awards: <span className="font-semibold text-white">{player.totalPlayerOfMatchAwards}</span>
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default PlayerList;
