    import { React, useEffect, useState } from 'react';
    import { useParams } from 'react-router-dom';
    import MatchCard from './MatchCard'; // Corrected: Use default import
    import Loader from './Loader';     // Corrected: Use default import

    export const TeamPage = () => { // Keep this as named export if App.js imports it as { TeamPage }

        const [team, setTeam] = useState({ matches: [] }); // Initialize matches as an empty array
        const { teamName } = useParams();
        const [selectedSeason, setSelectedSeason] = useState(''); // New state for selected season

        useEffect(
            () => {
                const fetchTeam = async () => {
                    try {
                        // Construct the URL with season filter if selectedSeason is not empty
                        const apiUrl = selectedSeason
                            ? `${process.env.REACT_APP_API_ROOT_URL}/team/${teamName}?season=${selectedSeason}`
                            : `${process.env.REACT_APP_API_ROOT_URL}/team/${teamName}`;

                        const response = await fetch(apiUrl); // Using fetch directly
                        const data = await response.json();
                        setTeam(data);
                    } catch (error) {
                        console.error("Error fetching team data:", error);
                    }
                };
                fetchTeam();
            },
            [teamName, selectedSeason] // Re-fetch data when teamName or selectedSeason changes
        );

        // Get unique seasons from the matches data for the dropdown
        // Ensure team.matches is an array before mapping
        const allSeasons = team.matches && team.matches.length > 0
            ? [...new Set(team.matches.map(match => match.season))].sort((a, b) => b.localeCompare(a))
            : [];
        // Include an option for "All Seasons" if there are actual seasons
        const seasonOptions = allSeasons.length > 0 ? ['All Seasons', ...allSeasons] : [];


        if (!team || !team.teamName) {
            return <Loader />; // Display loader while fetching or if team not found
        }

        // Calculate losses and win/loss ratio
        const totalLosses = team.totalMatches - team.totalWins;
        const winLossRatio = team.totalMatches > 0
            ? (team.totalWins / team.totalMatches * 100).toFixed(2) // Format to 2 decimal places
            : 0; // Avoid division by zero


        return (
            <div className="TeamPage p-4"> {/* Added padding for better spacing */}
                <h1 className="text-3xl font-bold mb-4">{team.teamName} Matches</h1>
                <p className="text-xl">Total Matches: {team.totalMatches}</p>
                <p className="text-xl">Total Wins: {team.totalWins}</p>
                <p className="text-xl">Total Losses: {totalLosses}</p> {/* New: Display Total Losses */}
                <p className="text-xl">Win %: {winLossRatio}%</p> {/* New: Display Win Percentage */}

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
