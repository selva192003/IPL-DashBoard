import { React } from 'react';
import { Link } from 'react-router-dom'; // <<<--- ADDED: Import Link

const TeamCard = ({ team }) => { // <<<--- CHANGED: Destructure 'team' prop
    return (
        // <<<--- WRAPPED with Link component
        <Link to={`/teams/${team.teamName}`} className="block">
            <div className="TeamCard p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-xl font-semibold mb-2">{team.teamName}</h3>
                <p>Matches: {team.totalMatches}</p>
                <p>Wins: {team.totalWins}</p>
            </div>
        </Link>
        // <<<--- END Link wrapper
    );
};

export default TeamCard;