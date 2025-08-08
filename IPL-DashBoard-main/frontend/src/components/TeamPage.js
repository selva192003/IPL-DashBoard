import { React, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MatchCard from './MatchCard';
import Loader from './Loader';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const TeamPage = () => {
    const [team, setTeam] = useState({ matches: [] });
    const { teamName } = useParams();
    const [selectedSeason, setSelectedSeason] = useState('');
    const [teamLogo, setTeamLogo] = useState(''); // NEW state for team logo

    // Fetch team details and logo on component mount or teamName/season change
    useEffect(
        () => {
            const fetchTeamAndLogo = async () => {
                try {
                    const apiUrl = selectedSeason
                        ? `${process.env.REACT_APP_API_ROOT_URL}/team/${teamName}?season=${selectedSeason}`
                        : `${process.env.REACT_APP_API_ROOT_URL}/team/${teamName}`;

                    const teamResponse = await fetch(apiUrl);
                    const teamData = await teamResponse.json();
                    setTeam(teamData);

                    // NEW: Fetch team logo from the API
                    const logoResponse = await fetch(`${process.env.REACT_APP_API_ROOT_URL.replace('/api/v1', '')}/api/images/team/${teamName}`);
                    const logoData = await logoResponse.json();
                    if (logoData) {
                        setTeamLogo(logoData.imageUrl);
                    }
                } catch (error) {
                    console.error("Error fetching team data:", error);
                }
            };
            fetchTeamAndLogo();
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

    const data = [
        { name: 'Wins', value: team.totalWins },
        { name: 'Losses', value: totalLosses },
    ];

    const COLORS = ['#4CAF50', '#F44336'];

    return (
        <div className="TeamPage p-4 text-white">
            <header className="flex items-center justify-center space-x-4 mb-8">
                {teamLogo && <img src={teamLogo} alt={`${team.teamName} logo`} className="w-24 h-24 rounded-full border-4 border-indigo-400" />}
                <h1 className="text-5xl font-extrabold text-center text-indigo-400">{team.teamName}</h1>
            </header>
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-4xl mx-auto mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    <div>
                        <h2 className="text-2xl font-bold text-yellow-300 mb-4">Season Performance</h2>
                        <p className="text-xl text-gray-300">Total Matches: <span className="font-semibold text-white">{team.totalMatches}</span></p>
                        <p className="text-xl text-gray-300">Total Wins: <span className="font-semibold text-white">{team.totalWins}</span></p>
                        <p className="text-xl text-gray-300">Total Losses: <span className="font-semibold text-white">{totalLosses}</span></p>
                        <p className="text-xl text-gray-300">Win Rate: <span className="font-semibold text-yellow-300">{winLossRatio}%</span></p>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-yellow-300 mb-4">Win/Loss Distribution</h2>
                        {team.totalMatches > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={90}
                                        dataKey="value"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-center text-gray-500 mt-8">No matches played yet to display chart.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="my-8">
                <label htmlFor="season-select" className="block text-xl font-bold text-yellow-300 mb-2">Filter by Season:</label>
                <select
                    id="season-select"
                    className="bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full max-w-xs mx-auto"
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(e.target.value === 'All Seasons' ? '' : e.target.value)}
                >
                    {seasonOptions.map(season => (
                        <option key={season} value={season}>{season}</option>
                    ))}
                </select>
            </div>

            <h2 className="text-3xl font-bold text-center mb-6 text-indigo-400">Match History</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {team.matches.length > 0 ? (
                    team.matches.map(match => <MatchCard key={match.id} match={match} teamName={team.teamName} />)
                ) : (
                    <p className="text-center text-gray-500">No matches found for this selection.</p>
                )}
            </div>
        </div>
    );
};

export default TeamPage;
