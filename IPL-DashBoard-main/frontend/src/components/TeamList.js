import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loader from './Loader';

const TeamList = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                // Use the proxied URL for the backend API endpoint
                const response = await axios.get('/api/v1/team');
                setTeams(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load teams:", err);
                setError("Failed to load teams for selection. Please check your backend server and API URL.");
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-center text-red-500 p-4">{error}</div>;
    }

    if (teams.length === 0) {
        return <div className="text-center p-4">No teams available.</div>;
    }

    return (
        <div className="TeamList p-4">
            <h1 className="text-4xl font-bold text-center mb-6 text-indigo-400">IPL Teams</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map(team => (
                    <div key={team.teamName} className="bg-gray-800 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <Link to={`/teams/${team.teamName}`} className="text-white hover:text-indigo-300">
                            <h2 className="text-2xl font-semibold mb-2">{team.teamName}</h2>
                            <p className="text-sm text-gray-400">Total Matches: {team.totalMatches}</p>
                            <p className="text-sm text-gray-400">Total Wins: {team.totalWins}</p>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamList;