import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MatchCard from './MatchCard';
import Loader from './Loader';

// Define the base URL using the environment variable.
// This is crucial for Vercel to connect to the Render backend in production.
const BASE_URL = process.env.REACT_APP_BACKEND_URL || '';

const PlayerPage = () => {
    const [player, setPlayer] = useState(null);
    const [playerMatches, setPlayerMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { playerName } = useParams();

    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                setLoading(true);
                setError(null);

                // CORRECTED: Use BASE_URL prefix for player details API call
                const playerResponse = await fetch(`${BASE_URL}/api/v1/players/${playerName}`);
                const playerData = await playerResponse.json();
                setPlayer(playerData);

                // CORRECTED: Use BASE_URL prefix for player matches API call
                const matchesResponse = await fetch(`${BASE_URL}/api/v1/players/${playerName}/player-of-match-awards`);
                const matchesData = await matchesResponse.json();
                setPlayerMatches(matchesData);

            } catch (err) {
                console.error("Error fetching player data:", err);
                setError("Failed to load player data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchPlayerData();
    }, [playerName]);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-center text-red-500 p-4">{error}</div>;
    }

    if (!player) {
        return <div className="text-center p-4">Player not found.</div>;
    }

    return (
        <div className="PlayerPage p-4">
            <h1 className="text-3xl font-bold mb-4 text-center text-indigo-800">{player.name}</h1>
            <p className="text-xl text-center text-gray-700">Total Player of the Match Awards: <span className="font-semibold">{player.totalPlayerOfMatchAwards}</span></p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Matches where {player.name} was Player of the Match:</h2>
            {playerMatches.length > 0 ? (
                playerMatches.map(match => (
                    <MatchCard key={match.id} match={match} teamName={match.matchWinner} />
                ))
            ) : (
                <p>No "Player of the Match" awards found for this player.</p>
            )}
        </div>
    );
};

export default PlayerPage;