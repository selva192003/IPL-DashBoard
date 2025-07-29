import { React } from 'react';
// import './MatchCard.css'; // <<<--- REMOVED: This line was causing the "Module not found" error

const MatchCard = ({ match, teamName }) => { // <<<--- CHANGED: No 'export' here
    const opponentTeam = match.team1 === teamName ? match.team2 : match.team1;
    const isMatchWinner = match.matchWinner === teamName;

    const matchResultClass = isMatchWinner ? 'match-won' : 'match-lost';

    return (
        <div className={`MatchCard ${matchResultClass}`}>
            <p>vs <span className="font-bold">{opponentTeam}</span></p>
            <p>{match.date}</p>
            <p>{match.venue}</p>
            <p><span className="font-bold">{match.matchWinner}</span> won by {match.resultMargin} {match.result}</p>
        </div>
    );
};

export default MatchCard; // <<<--- ADDED: Default export here