import { React, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import MatchCard from './MatchCard';
import Loader from './Loader';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export const TeamPage = () => {
    const [team, setTeam] = useState({ matches: [] });
    const { teamName } = useParams();
    const [selectedSeason, setSelectedSeason] = useState('');
    
    // New: Hook to access URL search parameters
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const venueFilter = queryParams.get('venue');
    const matchTypeFilter = queryParams.get('matchType');
    
    // Removed venueStats state variables

    useEffect(() => {
        const fetchTeamData = async () => {
            try {
                // Construct query parameters including season filter (if selected) 
                // and the venue/matchType filters passed from the TeamList page
                const params = new URLSearchParams();
                
                if (selectedSeason && selectedSeason !== 'All Seasons') {
                    params.append('season', selectedSeason);
                }
                // Pass through filters from TeamList URL if present
                if (venueFilter) {
                    params.append('venue', venueFilter);
                }
                if (matchTypeFilter) {
                    params.append('matchType', matchTypeFilter);
                }
                
                const query = params.toString();
                const matchesApiUrl = `/api/v1/team/${teamName}${query ? '?' + query : ''}`;
                
                const matchesResponse = await fetch(matchesApiUrl);
                const matchesData = await matchesResponse.json();
                
                setTeam(matchesData);
                
                // Removed venue stats fetching logic
            } catch (error) {
                console.error("Error fetching team data:", error);
                // Handle error state if needed
            }
        };

        fetchTeamData();
    }, [teamName, selectedSeason, venueFilter, matchTypeFilter]); // Depend on filters and season

    const allSeasons = team.matches && team.matches.length > 0
        ? [...new Set(team.matches.map(match => match.season))].sort((a, b) => b.localeCompare(a))
        : [];
    const seasonOptions = allSeasons.length > 0 ? ['All Seasons', ...allSeasons] : [];

    // Removed logic related to currentVenueStats
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
    
    // Conditional display of filters in a subheading for context
    const filterContext = (venueFilter || matchTypeFilter) ? 
        ` (Filtered by: ${venueFilter ? `Venue: ${venueFilter}` : ''}${venueFilter && matchTypeFilter ? ', ' : ''}${matchTypeFilter ? `Match Type: ${matchTypeFilter}` : ''})` 
        : '';

    return (
        <div className="TeamPage p-4 text-gray-900">
            <h1 className="text-3xl font-bold mb-1">{team.teamName}</h1>
            <p className="text-lg font-semibold mb-4 text-gray-600">{filterContext}</p> 

            <p className="text-xl">Total Matches: {team.totalMatches}</p>
            <p className="text-xl">Total Wins: {team.totalWins}</p>
            <p className="text-xl">Total Losses: {totalLosses}</p>
            <p className="text-xl">Win %: {winLossRatio}%</p>
            
            <div className="flex justify-center my-4">
                <select 
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(e.target.value)}
                    className="p-2 border rounded-md text-gray-900"
                >
                    {seasonOptions.map(season => (
                        <option key={season} value={season}>{season}</option>
                    ))}
                </select>
            </div>


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
                    <p className="text-center text-gray-600">No matches played yet to display chart (under current filters).</p>
                )}
            </div>

            {/* Removed the 'Venue Performance' section */}
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Matches:</h2>
            {team.matches.length > 0 ? (
                team.matches.map(match => <MatchCard key={match.id} match={match} teamName={team.teamName} />)
            ) : (
                <p>No matches found for this selection.</p>
            )}
        </div>
    );
};