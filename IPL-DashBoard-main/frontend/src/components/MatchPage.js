import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import Link
import Loader from './Loader'; // Assuming you have a Loader component

const MatchPage = () => {
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams(); // Get match ID from URL parameter

    useEffect(() => {
        const fetchMatch = async () => {
            try {
                setLoading(true);
                setError(null);
                // Fetch match details via same-origin proxy:
                // Frontend route remains /match/:id, backend data is fetched from /api/match/:id.
                const response = await fetch(`/api/match/${encodeURIComponent(id)}`);
                const contentType = response.headers.get('content-type') || '';
                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(`Failed to fetch match (${response.status}): ${text.slice(0, 120)}`);
                }
                if (!contentType.includes('application/json')) {
                    const text = await response.text();
                    throw new Error(`Expected JSON but got: ${text.slice(0, 120)}`);
                }
                const data = await response.json();
                setMatch(data);
            } catch (err) {
                console.error("Error fetching match data:", err);
                setError("Failed to load match details. Please check the match ID and try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchMatch();
    }, [id]); // Re-fetch data when match ID changes in the URL

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-center text-red-500 p-4">{error}</div>;
    }

    if (!match) {
        return <div className="text-center p-4">Match not found.</div>;
    }

    // Determine winner and loser for display
    const isTeam1Winner = match.matchWinner === match.team1;
    const winnerTeam = isTeam1Winner ? match.team1 : match.team2;
    const loserTeam = isTeam1Winner ? match.team2 : match.team1;

    return (
        <div className="MatchPage p-6 bg-gray-800 rounded-lg shadow-xl text-white max-w-3xl mx-auto my-8">
            <h1 className="text-4xl font-extrabold text-center mb-6 text-indigo-400">
                Match Details
            </h1>

            <div className="text-left space-y-4 text-lg">
                <p><strong>Season:</strong> {match.season}</p>
                <p><strong>Date:</strong> {match.date}</p>
                <p><strong>Venue:</strong> {match.venue}, {match.city}</p>
                <p><strong>Match Type:</strong> {match.matchType}</p>

                <div className="border-t border-gray-700 pt-4 mt-4">
                    <p className="text-2xl font-bold mb-2">
                        <Link to={`/teams/${match.team1}`} className="text-yellow-300 hover:underline">{match.team1}</Link> vs <Link to={`/teams/${match.team2}`} className="text-yellow-300 hover:underline">{match.team2}</Link>
                    </p>
                    <p><strong>Toss Winner:</strong> {match.tossWinner} ({match.tossDecision})</p>
                </div>

                <div className="border-t border-gray-700 pt-4 mt-4">
                    <p className="text-2xl font-bold mb-2">
                        Winner: <span className="text-green-400">{winnerTeam}</span>
                    </p>
                    <p>
                        <span className="font-semibold">{winnerTeam}</span> won by {match.resultMargin} {match.result} against <span className="text-red-400">{loserTeam}</span>.
                    </p>
                </div>

                {match.playerOfMatch && (
                    <div className="border-t border-gray-700 pt-4 mt-4">
                        <p><strong>Player of the Match:</strong> <Link to={`/players/${match.playerOfMatch}`} className="text-blue-400 hover:underline">{match.playerOfMatch}</Link></p>
                    </div>
                )}

                {(match.umpire1 || match.umpire2) && (
                    <div className="border-t border-gray-700 pt-4 mt-4">
                        <p><strong>Umpires:</strong> {match.umpire1} {match.umpire2 ? `& ${match.umpire2}` : ''}</p>
                    </div>
                )}

                {match.superOver === 'Y' && (
                    <p className="text-xl font-bold text-orange-400 mt-4">This match went to a Super Over!</p>
                )}
                {match.method && match.method !== 'NA' && (
                    <p className="text-xl font-bold text-orange-400 mt-4">Method Applied: {match.method}</p>
                )}
            </div>

            <div className="mt-8 text-center">
                <Link to={`/teams/${match.team1}`} className="inline-block bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200">
                    View {match.team1} Team Page
                </Link>
                <Link to={`/teams/${match.team2}`} className="inline-block bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors duration-200 ml-4">
                    View {match.team2} Team Page
                </Link>
            </div>
        </div>
    );
};

export default MatchPage;