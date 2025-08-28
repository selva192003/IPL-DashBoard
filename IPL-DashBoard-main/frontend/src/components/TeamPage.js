import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MatchCard from './MatchCard';
import Loader from './Loader';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export const TeamPage = () => {

    const [team, setTeam] = useState({ matches: [] });
    const { teamName } = useParams();
    const [selectedSeason, setSelectedSeason] = useState('');

    useEffect(
        () => {
            const fetchTeam = async () => {
                try {
                    // Use a relative URL to correctly route through the proxy
                    const apiUrl = selectedSeason
                        ? `/api/v1/team/${teamName}?season=${selectedSeason}`
                        : `/api/v1/team/${teamName}`;

                    const response = await fetch(apiUrl);
                    const data = await response.json();
                    setTeam(data);
                } catch (error) {
                    console.error("Error fetching team data:", error);
                }
            };
            fetchTeam();
        },
        [teamName, selectedSeason]
    );

    const allSeasons = team.matches && team.matches.length > 0
        ? [...new Set(team.matches.map(match => match.season))].sort((a, b) => b.localeCompare(a))
        : [];
    const seasonOptions = allSeasons.length > 0 ? ['All Seasons', ...allSeasons] : [];


    if (!team || !team.teamName) {
        return <Loader />;
    }

    const totalLosses = team.totalMatches - team.totalWins;
    const winLossRatio = team.totalMatches > 0
        ? (team.totalWins / team.totalMatches * 100).toFixed(2)
        : 0;

    // NEW: Data for the Pie Chart
    const data = [
        { name: 'Wins', value: team.totalWins },
        { name: 'Losses', value: totalLosses },
    ];

    // Colors for the pie chart slices
    const COLORS = ['#4CAF50', '#F44336']; // Green for wins, Red for losses


    return (
        <div className="TeamPage p-4">
            <h1 className="text-3xl font-bold mb-4">{team.teamName} Matches</h1>
            <p className="text-xl">Total Matches: {team.totalMatches}</p>
            <p className="text-xl">Total Wins: {team.totalWins}</p>
            <p className="text-xl">Total Losses: {totalLosses}</p>
            <p className="text-xl">Win %: {winLossRatio}%</p>

            {/* NEW: Pie Chart Section */}
            <div className="my-8 p-4 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Win/Loss Distribution</h2>
                {team.totalMatches > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {
                                    data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))
                                }
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-center text-gray-600">No matches played yet to display chart.</p>
                )}
            </div>
            {/* END NEW: Pie Chart Section */}


            <div className="my-4">
                <label htmlFor="season-select" className="block text-lg font-medium text-gray-700">Select Season:</label>
                <select
                    id="season-select"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(e.target.value === 'All Seasons' ? '' : e.target.value)}
                >
                    {seasonOptions.map(season => (
                        <option key={season} value={season}>{season}</option>
                    ))}
                </select>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Matches:</h2>
            {team.matches.length > 0 ? (
                team.matches.map(match => <MatchCard key={match.id} match={match} teamName={team.teamName} />)
            ) : (
                <p>No matches found for this selection.</p>
            )}
        </div>
    );
};