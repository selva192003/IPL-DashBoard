    import React, { useEffect, useState } from 'react';
    import axios from 'axios';
    import { Link } from 'react-router-dom';
    import Loader from './Loader';

    const LeaderboardPage = () => {
        const [players, setPlayers] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        useEffect(() => {
            const fetchLeaderboard = async () => {
                try {
                    setLoading(true);
                    setError(null);
                    const response = await axios.get(`${process.env.REACT_APP_API_ROOT_URL}/players/leaderboard`);
                    setPlayers(response.data);
                } catch (err) {
                    console.error("Error fetching leaderboard:", err);
                    setError("Failed to load leaderboard. Please try again later.");
                } finally {
                    setLoading(false);
                }
            };

            fetchLeaderboard();
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
            <div className="LeaderboardPage p-4">
                <h1 className="text-4xl font-extrabold text-center mb-6 text-indigo-400">
                    Player of the Match Leaderboard
                </h1>

                <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-4xl mx-auto">
                    {players.map((player, index) => (
                        <div key={player.name} className="flex items-center space-x-6 p-4 rounded-lg bg-gray-900 mb-4 transform hover:scale-105 transition-transform duration-300">
                            <span className="text-3xl font-bold text-yellow-400">{index + 1}.</span>
                            <div className="flex-grow text-left">
                                <h2 className="text-2xl font-bold text-white">
                                    <Link to={`/players/${player.name}`} className="hover:underline">{player.name}</Link>
                                </h2>
                                <p className="text-lg text-indigo-200">
                                    Player of the Match Awards: <span className="font-semibold text-yellow-300">{player.totalPlayerOfMatchAwards}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    export default LeaderboardPage;
    