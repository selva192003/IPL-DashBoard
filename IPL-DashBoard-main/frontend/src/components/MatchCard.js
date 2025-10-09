import { React } from 'react';
import { Link } from 'react-router-dom';

const MatchCard = ({ match, teamName }) => {
    const opponentTeam = match.team1 === teamName ? match.team2 : match.team1;
    const isMatchWinner = match.matchWinner === teamName;

    // Dynamic classes for winner/loser styling
    const matchResultClass = isMatchWinner ? 'bg-green-700 text-white' : 'bg-red-700 text-white';
    const opponentClass = isMatchWinner ? 'text-green-300' : 'text-red-300';
    const winnerClass = isMatchWinner ? 'text-green-300' : 'text-red-300'; // Color for the winner text

    return (
        // Wrap the entire card with a Link to the MatchPage
        <Link to={`/matches/${match.id}`} className="block">
            <div className={`card p-5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${matchResultClass}`}>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-light opacity-80">{match.season}</span>
                    <span className="text-sm font-light opacity-80">{match.date}</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">
                    <span className="text-yellow-300">{match.team1}</span> vs <span className="text-yellow-300">{match.team2}</span>
                </h3>
                <p className="text-md opacity-90 mb-3">{match.venue}</p>

                <div className="border-t border-gray-600 pt-3">
                    <p className="text-lg font-semibold">
                        Winner: <span className={`${winnerClass}`}>{match.matchWinner}</span>
                    </p>
                    <p className="text-sm opacity-80">
                        Won by {match.resultMargin} {match.result}
                    </p>
                    {match.playerOfMatch && (
                        <p className="text-sm mt-2 opacity-90">
                            Player of Match: <span className="font-medium text-blue-300">{match.playerOfMatch}</span>
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default MatchCard;
