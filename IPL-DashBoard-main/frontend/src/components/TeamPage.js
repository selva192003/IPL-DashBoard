import React, { useEffect, useState } from 'react';
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
                    // Always use same-origin API paths so Vercel rewrites / CRA proxy can handle routing.
                    const encodedTeamName = encodeURIComponent(teamName);
                    const seasonParam = selectedSeason && selectedSeason !== 'All Seasons'
                        ? `?season=${encodeURIComponent(selectedSeason)}`
                        : '';
                    const apiUrl = `/api/v1/team/${encodedTeamName}${seasonParam}`;

                    const response = await fetch(apiUrl);
                    const contentType = response.headers.get('content-type') || '';
                    if (!response.ok) {
                        const text = await response.text();
                        throw new Error(`Failed to fetch team (${response.status}): ${text.slice(0, 120)}`);
                    }
                    if (!contentType.includes('application/json')) {
                        const text = await response.text();
                        throw new Error(`Expected JSON but got: ${text.slice(0, 120)}`);
                    }
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
        return <Loader label="Loading team" />;
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
        <div className="TeamPage">
            <section className="relative overflow-hidden ui-glass rounded-3xl">
                <div
                    className="absolute inset-x-0 top-0 h-28 opacity-95"
                    style={{ background: `linear-gradient(90deg, ${primary}, ${secondary})` }}
                    aria-hidden="true"
                />
                <div className="absolute inset-0 ui-scrim" aria-hidden="true" />
                <div className="absolute left-0 top-0 ui-hairline" aria-hidden="true" />

                <div className="relative px-6 py-6 sm:px-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4 min-w-0">
                            <div
                                className="relative h-16 w-16 rounded-3xl border overflow-hidden"
                                style={{ background: 'var(--ui-surface-muted)', borderColor: 'var(--ui-border)' }}
                            >
                                <img
                                    src={logo}
                                    alt={`${team.teamName} logo`}
                                    className="h-14 w-14 object-contain"
                                    style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.35))' }}
                                />
                            </div>
                            <div className="min-w-0">
                                <div className="ui-chip mb-1">Franchise</div>
                                <h1 className="ui-title truncate">{team.teamName}</h1>
                                {(team.tagline || meta.tagline) && (
                                    <p className="mt-1 text-sm text-slate-300">{team.tagline || meta.tagline}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="ui-stat-pill">
                                <div className="value">{team.totalMatches}</div>
                                <div className="label">Matches</div>
                                <div className="mt-1 text-[11px] text-slate-300">Played</div>
                            </div>
                            <div className="ui-stat-pill">
                                <div className="value">{team.totalWins}</div>
                                <div className="label">Wins</div>
                                <div className="mt-1 text-[11px] text-slate-300">Franchise tally</div>
                            </div>
                            <div className="ui-stat-pill">
                                <div className="value">{totalLosses}</div>
                                <div className="label">Losses</div>
                                <div className="mt-1 text-[11px] text-slate-300">Recorded</div>
                            </div>
                            <div className="ui-stat-pill">
                                <div className="value">{winLossRatio}%</div>
                                <div className="label">Win %</div>
                                <div className="mt-1 text-[11px] text-slate-300">Across seasons</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEW: Pie Chart Section */}
            <div className="my-8 ui-glass p-5 relative overflow-hidden rounded-3xl">
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    <div className="absolute inset-0 ui-scrim" />
                    <div className="absolute left-0 top-0 ui-hairline" />
                </div>
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Win/Loss Distribution</h2>
                    <div className="text-xs text-slate-400">{team.totalMatches} matches</div>
                </div>
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
                    <p className="mt-4 text-center text-sm text-slate-400">No matches played yet to display chart.</p>
                )}
            </div>
            {/* END NEW: Pie Chart Section */}

            <div className="my-6 ui-glass p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="text-sm font-semibold text-white">Season</div>
                        <div className="text-sm text-slate-400">Filter matches by season</div>
                    </div>
                    <select
                        id="season-select"
                        className="ui-input sm:w-72"
                        value={selectedSeason || 'All Seasons'}
                        onChange={(e) => setSelectedSeason(e.target.value === 'All Seasons' ? '' : e.target.value)}
                    >
                        {seasonOptions.map((season) => (
                            <option key={season} value={season}>{season}</option>
                        ))}
                    </select>
                </div>
            </div>

            <h2 className="text-lg sm:text-xl font-semibold text-white mt-8 mb-4">Matches</h2>
            {team.matches.length > 0 ? (
                team.matches.map(match => <MatchCard key={match.id} match={match} teamName={team.teamName} />)
            ) : (
                <div className="ui-glass p-6 text-center text-sm text-slate-300">
                    No matches found for this selection.
                </div>
            )}
        </div>
    );
};