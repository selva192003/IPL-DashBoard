import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MatchCard from './MatchCard';
import Loader from './Loader';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import teamMeta from '../data/teamMeta.json';

// helper: find meta by teamName case-insensitive, trimmed
function normalizeKey(s){
    return s ? s.toString().trim().toLowerCase().replace(/[^a-z0-9]/g, '') : '';
}

function findMeta(teamName) {
    if (!teamName) return null;
    const key = normalizeKey(teamName);
    for (const k of Object.keys(teamMeta)) {
        if (normalizeKey(k) === key) return teamMeta[k];
    }
    for (const k of Object.keys(teamMeta)) {
        const nk = normalizeKey(k);
        if (nk.includes(key) || key.includes(nk)) return teamMeta[k];
    }
    return null;
}

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

    const meta = findMeta(team.teamName) || {};
    const primary = team.primaryColor || meta.primaryColor || '#1f2937';
    const secondary = team.secondaryColor || meta.secondaryColor || '#374151';
    const logo = encodeURI((team.logo || meta.logo) || '/logos/Csk.jpg');

    // Colors for the pie chart slices - use team colors as primary/secondary
    const COLORS = [primary, secondary];

    return (
        <div className="TeamPage p-4">
            <div className="rounded-lg p-6 mb-6 text-white" style={{background: `linear-gradient(90deg, ${primary}, ${secondary})`, position: 'relative', overflow: 'hidden', paddingLeft: 160}}>
                <div style={{position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', opacity: 0.98}}>
                    <img src={logo} alt={`${team.teamName} logo`} style={{width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.35))'}} />
                </div>
                <h1 className="text-3xl font-bold mb-2">{team.teamName}</h1>
                {(team.tagline || meta.tagline) && <p className="italic text-lg">{team.tagline || meta.tagline}</p>}
                <div className="mt-4 flex gap-6">
                    <p className="text-xl">Total Matches: {team.totalMatches}</p>
                    <p className="text-xl">Total Wins: {team.totalWins}</p>
                    <p className="text-xl">Total Losses: {totalLosses}</p>
                    <p className="text-xl">Win %: {winLossRatio}%</p>
                </div>
            </div>

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