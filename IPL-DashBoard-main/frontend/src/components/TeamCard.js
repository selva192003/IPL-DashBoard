import React from 'react';
import { Link } from 'react-router-dom';

const TeamCard = ({ team }) => {
    return (
        <Link to={`/teams/${team.teamName}`} className="block">
            <div className="card bg-gray-800 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                <h3 className="text-3xl font-extrabold text-center text-yellow-300 mb-2">
                    {team.teamName}
                </h3>
                <div className="mt-4 text-left">
                    <p className="text-lg text-gray-300">
                        <span className="font-semibold text-white">Total Matches:</span> {team.totalMatches}
                    </p>
                    <p className="text-lg text-gray-300 mt-1">
                        <span className="font-semibold text-white">Total Wins:</span> {team.totalWins}
                    </p>
                    <p className="text-lg text-gray-300 mt-1">
                        <span className="font-semibold text-white">Total Losses:</span> {team.totalMatches - team.totalWins}
                    </p>
                    <p className="text-lg text-gray-300 mt-1">
                        <span className="font-semibold text-white">Win Rate:</span> {team.totalMatches > 0 ? ((team.totalWins / team.totalMatches) * 100).toFixed(2) : 0}%
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default TeamCard;
