import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MatchCard from './MatchCard'; // Assuming MatchCard is a default export
import Loader from './Loader';     // Assuming Loader is a default export

const PlayerPage = () => {
    const [player, setPlayer] = useState(null);
    const [playerMatches, setPlayerMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { playerName } = useParams(); // Get player name from URL parameter

    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch player details
                const playerResponse = await fetch(`${process.env.REACT_APP_API_ROOT_URL}/players/${playerName}`);
                const playerData = await playerResponse.json();
                setPlayer(playerData);

                // Fetch matches where this player was Player of the Match
                const matchesResponse = await fetch(`${process.env.REACT_APP_API_ROOT_URL}/players/${playerName}/player-of-match-awards`);
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
    }, [playerName]); // Re-fetch data when playerName changes in the URL

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
                    <MatchCard key={match.id} match={match} teamName={match.matchWinner} /> // Pass matchWinner as teamName for context
                ))
            ) : (
                <p>No "Player of the Match" awards found for this player.</p>
            )}
        </div>
    );
};

export default PlayerPage;
