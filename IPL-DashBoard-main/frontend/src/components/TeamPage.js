import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MatchCard from './MatchCard';
import Loader from './Loader';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export const TeamPage = () => {
    const [team, setTeam] = useState({ matches: [] });
    const { teamName } = useParams();
    const [selectedSeason, setSelectedSeason] = useState('');
    const [venueStats, setVenueStats] = useState(null);
    const [selectedVenue, setSelectedVenue] = useState('');

    useEffect(() => {
        const fetchTeamData = async () => {
            try {
                // Fetch team matches data
                const matchesApiUrl = selectedSeason
                    ? `/api/v1/team/${teamName}?season=${selectedSeason}`
                    : `/api/v1/team/${teamName}`;
                
                const matchesResponse = await fetch(matchesApiUrl);
                const matchesData = await matchesResponse.json();
                
                setTeam(matchesData);
                
                // Fetch venue stats
                const venueStatsApiUrl = `/api/v1/team/${teamName}/venue-stats`;
                const venueStatsResponse = await fetch(venueStatsApiUrl);
                const venueStatsData = await venueStatsResponse.json();
                setVenueStats(venueStatsData.venueStats);
                
                if (Object.keys(venueStatsData.venueStats).length > 0) {
                    setSelectedVenue(Object.keys(venueStatsData.venueStats)[0]);
                }

            } catch (error) {
                console.error("Error fetching initial team data:", error);
            }
        };

        fetchTeamData();
    }, [teamName, selectedSeason]);

    const allSeasons = team.matches && team.matches.length > 0
        ? [...new Set(team.matches.map(match => match.season))].sort((a, b) => b.localeCompare(a))
        : [];
    const seasonOptions = allSeasons.length > 0 ? ['All Seasons', ...allSeasons] : [];

    const currentVenueStats = venueStats ? venueStats[selectedVenue] : null;
    const totalLosses = team.totalMatches - team.totalWins;
    const winLossRatio = team.totalMatches > 0
        ? (team.totalWins / team.totalMatches * 100).toFixed(2)
        : 0;

    const data = [
        { name: 'Wins', value: team.totalWins },
        { name: 'Losses', value: totalLosses },
    ];

    const COLORS = ['#4CAF50', '#F44336'];

    if (!team || !team.teamName) {
        return <Loader />;
    }

    return (
        <div className="TeamPage p-4 text-gray-900">
            <h1 className="text-3xl font-bold mb-4">{team.teamName} Matches</h1>
            <p className="text-xl">Total Matches: {team.totalMatches}</p>
            <p className="text-xl">Total Wins: {team.totalWins}</p>
            <p className="text-xl">Total Losses: {totalLosses}</p>
            <p className="text-xl">Win %: {winLossRatio}%</p>

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

            {venueStats && Object.keys(venueStats).length > 0 && (
                <div className="my-8 p-4 bg-white rounded-lg shadow-md text-gray-900">
                    <h2 className="text-2xl font-bold mb-4 text-center">Venue Performance</h2>
                    <div className="mb-4">
                        <label htmlFor="venue-select" className="block text-lg font-medium">Select Venue:</label>
                        <select
                            id="venue-select"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            value={selectedVenue}
                            onChange={(e) => setSelectedVenue(e.target.value)}
                        >
                            {Object.keys(venueStats).map(venue => (
                                <option key={venue} value={venue}>{venue}</option>
                            ))}
                        </select>
                    </div>
                    {currentVenueStats && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-lg">
                            <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
                                <h3 className="font-semibold">Matches at {selectedVenue}</h3>
                                <p className="text-2xl font-bold">{currentVenueStats.totalMatches}</p>
                            </div>
                            <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
                                <h3 className="font-semibold">Wins at {selectedVenue}</h3>
                                <p className="text-2xl font-bold text-green-600">{currentVenueStats.totalWins}</p>
                            </div>
                            <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
                                <h3 className="font-semibold">Win Percentage</h3>
                                <p className="text-2xl font-bold text-blue-600">{currentVenueStats.winPercentage}%</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Matches:</h2>
            {team.matches.length > 0 ? (
                team.matches.map(match => <MatchCard key={match.id} match={match} teamName={team.teamName} />)
            ) : (
                <p>No matches found for this selection.</p>
            )}
        </div>
    );
};