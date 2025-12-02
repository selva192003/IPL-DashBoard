import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MatchCard from './MatchCard';
import Loader from './Loader';

// Define the base URL using the environment variable.
// In development, this will be an empty string, relying on the package.json proxy.
// In production (Vercel), it will be set to the Render backend URL.
const BASE_URL = process.env.REACT_APP_BACKEND_URL || '';

const HeadToHeadPage = () => {
    const [teams, setTeams] = useState([]);
    const [selectedTeam1, setSelectedTeam1] = useState('');
    const [selectedTeam2, setSelectedTeam2] = useState('');
    const [headToHeadData, setHeadToHeadData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [teamsLoading, setTeamsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                // Use the BASE_URL prefix for the team list API call
                const response = await axios.get(`${BASE_URL}/api/v1/team`);
                setTeams(response.data);
                if (response.data.length > 1) {
                    setSelectedTeam1(response.data[0].teamName);
                    setSelectedTeam2(response.data[1].teamName);
                }
                setTeamsLoading(false);
            } catch (err) {
                console.error("Failed to load teams for selection:", err);
                setError("Failed to load teams for selection. Please check your backend service URL.");
                setTeamsLoading(false);
            }
        };

        fetchTeams();
    }, []);

    const fetchHeadToHead = async () => {
        if (!selectedTeam1 || !selectedTeam2) return;
        setLoading(true);
        setError(null);
        try {
            // Use the BASE_URL prefix for the head-to-head API call
            const response = await axios.get(`${BASE_URL}/api/v1/team/head-to-head?team1Name=${selectedTeam1}&team2Name=${selectedTeam2}`);
            setHeadToHeadData(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch head-to-head data:", err);
            setError("Failed to fetch head-to-head data. Please try again later.");
            setLoading(false);
        }
    };

    if (teamsLoading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-center text-red-500 p-4">{error}</div>;
    }

    return (
        <div className="HeadToHeadPage p-4">
            <h1 className="text-4xl font-bold text-center mb-6 text-indigo-400">Head-to-Head Matchup</h1>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6 mb-8">
                <select 
                    className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={selectedTeam1} 
                    onChange={(e) => setSelectedTeam1(e.target.value)}>
                    {teams.map(team => (
                        <option key={team.teamName} value={team.teamName}>{team.teamName}</option>
                    ))}
                </select>
                <span className="text-xl font-bold text-gray-300">vs</span>
                <select 
                    className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={selectedTeam2} 
                    onChange={(e) => setSelectedTeam2(e.target.value)}>
                    {teams.map(team => (
                        <option key={team.teamName} value={team.teamName}>{team.teamName}</option>
                    ))}
                </select>
                <button 
                    onClick={fetchHeadToHead} 
                    className="mt-4 md:mt-0 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors duration-200">
                    Get Matches
                </button>
            </div>

            {loading ? <Loader /> : headToHeadData && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-center mb-4 text-gray-200">Match Statistics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-lg mb-8">
                        <div className="bg-gray-700 p-6 rounded-lg shadow-md">
                            <h3 className="font-semibold">{selectedTeam1} Wins</h3>
                            <p className="text-3xl font-extrabold text-green-400">{headToHeadData.team1Wins}</p>
                        </div>
                        <div className="bg-gray-700 p-6 rounded-lg shadow-md">
                            <h3 className="font-semibold">Total Matches</h3>
                            <p className="text-3xl font-extrabold text-blue-400">{headToHeadData.totalMatches}</p>
                        </div>
                        <div className="bg-gray-700 p-6 rounded-lg shadow-md">
                            <h3 className="font-semibold">{selectedTeam2} Wins</h3>
                            <p className="text-3xl font-extrabold text-green-400">{headToHeadData.team2Wins}</p>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-center mb-4 text-gray-200">Match History</h2>
                    <div className="space-y-4">
                        {headToHeadData.matches.map(match => (
                            <MatchCard key={match.id} match={match} teamName={selectedTeam1} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeadToHeadPage;