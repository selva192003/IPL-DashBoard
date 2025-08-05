    import React, { useEffect, useState } from 'react';
    import axios from 'axios';
    import Loader from './Loader';
    import MatchCard from './MatchCard'; // Assuming MatchCard is a default export

    const HeadToHeadPage = () => {
        const [teams, setTeams] = useState([]); // All available teams for dropdowns
        const [selectedTeam1, setSelectedTeam1] = useState('');
        const [selectedTeam2, setSelectedTeam2] = useState('');
        const [headToHeadData, setHeadToHeadData] = useState(null);
        const [loading, setLoading] = useState(false); // Set to false initially as we don't fetch until teams are selected
        const [error, setError] = useState(null);

        // Fetch all teams for the dropdowns
        useEffect(() => {
            const fetchAllTeams = async () => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_ROOT_URL}/team`);
                    const teamNames = response.data.map(team => team.teamName).sort(); // Get just names, sorted
                    setTeams(teamNames);
                    // Optionally pre-select first two teams
                    if (teamNames.length >= 2) {
                        setSelectedTeam1(teamNames[0]);
                        setSelectedTeam2(teamNames[1]);
                    }
                } catch (err) {
                    console.error("Error fetching all teams for dropdowns:", err);
                    setError("Failed to load teams for selection.");
                }
            };
            fetchAllTeams();
        }, []);

        // Fetch head-to-head data when teams are selected
        useEffect(() => {
            const fetchHeadToHead = async () => {
                if (!selectedTeam1 || !selectedTeam2 || selectedTeam1 === selectedTeam2) {
                    setHeadToHeadData(null); // Clear data if selection is invalid
                    return;
                }

                try {
                    setLoading(true);
                    setError(null);
                    const response = await axios.get(
                        `${process.env.REACT_APP_API_ROOT_URL}/team/head-to-head?team1Name=${selectedTeam1}&team2Name=${selectedTeam2}`
                    );
                    setHeadToHeadData(response.data);
                } catch (err) {
                    console.error("Error fetching head-to-head data:", err);
                    setError("Failed to load head-to-head data.");
                } finally {
                    setLoading(false);
                }
            };

            fetchHeadToHead();
        }, [selectedTeam1, selectedTeam2]); // Re-fetch when selected teams change

        return (
            <div className="HeadToHeadPage p-4">
                <h1 className="text-3xl font-bold mb-6 text-center">Team Head-to-Head Comparison</h1>

                <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-8">
                    <div className="w-full md:w-1/3">
                        <label htmlFor="team1-select" className="block text-lg font-medium text-gray-700 mb-2">Select Team 1:</label>
                        <select
                            id="team1-select"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            value={selectedTeam1}
                            onChange={(e) => setSelectedTeam1(e.target.value)}
                        >
                            <option value="">-- Select Team 1 --</option>
                            {teams.map(teamName => (
                                <option key={teamName} value={teamName}>{teamName}</option>
                            ))}
                        </select>
                    </div>

                    <span className="text-2xl font-bold text-gray-700">VS</span>

                    <div className="w-full md:w-1/3">
                        <label htmlFor="team2-select" className="block text-lg font-medium text-gray-700 mb-2">Select Team 2:</label>
                        <select
                            id="team2-select"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            value={selectedTeam2}
                            onChange={(e) => setSelectedTeam2(e.target.value)}
                        >
                            <option value="">-- Select Team 2 --</option>
                            {teams.map(teamName => (
                                <option key={teamName} value={teamName}>{teamName}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {error && <div className="text-center text-red-500 p-4">{error}</div>}
                {loading && <Loader />}

                {headToHeadData && selectedTeam1 && selectedTeam2 && selectedTeam1 !== selectedTeam2 && (
                    <div className="results-section mt-8 bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4 text-center">Summary: {selectedTeam1} vs {selectedTeam2}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-lg mb-6">
                            <p>Total Matches: <span className="font-semibold">{headToHeadData.totalMatches}</span></p>
                            <p>{selectedTeam1} Wins: <span className="font-semibold text-green-700">{headToHeadData.team1Wins}</span></p>
                            <p>{selectedTeam2} Wins: <span className="font-semibold text-blue-700">{headToHeadData.team2Wins}</span></p>
                        </div>

                        <h3 className="text-xl font-bold mb-4">Match History:</h3>
                        {headToHeadData.matches.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {headToHeadData.matches.map(match => (
                                    <MatchCard key={match.id} match={match} teamName={selectedTeam1} /> // Pass selectedTeam1 for context
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-600">No historical matches found between these two teams.</p>
                        )}
                    </div>
                )}
                {!headToHeadData && (!selectedTeam1 || !selectedTeam2 || selectedTeam1 === selectedTeam2) && (
                    <p className="text-center text-gray-600 mt-8">Please select two different teams to see their head-to-head comparison.</p>
                )}
            </div>
        );
    };

    export default HeadToHeadPage;
    