import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader';

const SearchResultsPage = () => {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();

    const searchQuery = useMemo(() => {
        return new URLSearchParams(location.search).get('query') || '';
    }, [location.search]);

    useEffect(() => {
        const fetchSearchResults = async () => {
            const trimmed = searchQuery.trim();
            if (!trimmed) {
                setResults(null);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Use same-origin API paths so Vercel rewrites / CRA proxy can handle routing.
                const API_BASE = process.env.REACT_APP_API_URL || '';
                const response = await axios.get(
                    `${API_BASE}/api/v1/search?query=${encodeURIComponent(trimmed)}`
                );
                setResults(response.data);
            } catch (err) {
                console.error('Error fetching search results:', err);
                setError('Failed to load search results. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [searchQuery]);

    const safeTeams = Array.isArray(results?.teams) ? results.teams : [];
    const safePlayers = Array.isArray(results?.players) ? results.players : [];

    if (loading) {
        return <Loader label="Searching" />;
    }

    if (error) {
        return (
            <div className="ui-panel p-6 text-center">
                <div className="text-base font-semibold text-white">Search failed</div>
                <div className="mt-2 text-sm text-red-300">{error}</div>
            </div>
        );
    }

    if (!searchQuery.trim()) {
        return (
            <div className="ui-panel p-6 text-center">
                <div className="text-base font-semibold text-white">Search</div>
                <div className="mt-2 text-sm text-slate-400">Type a query in the top search bar.</div>
            </div>
        );
    }

    if (!results || (safeTeams.length === 0 && safePlayers.length === 0)) {
        return (
            <div className="ui-glass p-6 text-center">
                <div className="text-base font-semibold text-white">No results</div>
                <div className="mt-2 text-sm text-slate-300">Nothing found for “{searchQuery}”.</div>
            </div>
        );
    }

    return (
        <div className="SearchResultsPage">
            <div className="mb-7 ui-glass overflow-hidden rounded-3xl border border-white/10 p-6 sm:p-7 relative">
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-slate-950/70" />
                    <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-white/0 via-white/25 to-white/0" />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="ui-chip mb-2">Unified search</div>
                        <h1 className="ui-title">Search</h1>
                        <p className="ui-subtitle">Results for “{searchQuery}”.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                        <span className="ui-chip bg-white/5">Teams: {safeTeams.length}</span>
                        <span className="ui-chip bg-white/5">Players: {safePlayers.length}</span>
                    </div>
                </div>
            </div>

            {safeTeams.length > 0 && (
                <section className="mb-8">
                    <div className="flex items-end justify-between gap-3">
                        <div>
                            <div className="ui-chip mb-1">Teams</div>
                            <h2 className="text-lg font-semibold text-white">Teams</h2>
                            <p className="mt-1 text-sm text-slate-400">{safeTeams.length} matches</p>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {safeTeams.map((team) => (
                            <Link
                                to={`/teams/${team.teamName}`}
                                key={team.teamName}
                                className="group ui-glass ui-tilt-card p-5 text-left relative overflow-hidden"
                            >
                                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-slate-950/70" />
                                    <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-white/0 via-white/25 to-white/0" />
                                </div>
                                <div className="flex items-start justify-between gap-3">
                                    <h3 className="text-base font-semibold text-white">{team.teamName}</h3>
                                    <span className="shrink-0 ui-chip bg-white/10 text-[11px]">View</span>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-3">
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
                                </div>
                                <div className="mt-4 ui-divider-soft" />
                                <div className="mt-3 text-sm font-medium text-slate-200 group-hover:text-white">Open team page</div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {safePlayers.length > 0 && (
                <section>
                    <div className="flex items-end justify-between gap-3">
                        <div>
                            <div className="ui-chip mb-1">Players</div>
                            <h2 className="text-lg font-semibold text-white">Players</h2>
                            <p className="mt-1 text-sm text-slate-400">{safePlayers.length} matches</p>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {safePlayers.map((player) => (
                            <Link
                                to={`/players/${player.name}`}
                                key={player.name}
                                className="group ui-glass ui-tilt-card p-5 text-left relative overflow-hidden"
                            >
                                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-slate-950/70" />
                                    <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-white/0 via-white/25 to-white/0" />
                                </div>
                                <div className="flex items-start justify-between gap-3">
                                    <h3 className="text-base font-semibold text-white">{player.name}</h3>
                                    <span className="shrink-0 ui-chip bg-white/10 text-[11px]">View</span>
                                </div>
                                <div className="mt-4 ui-stat-pill">
                                    <div className="value">{player.totalPlayerOfMatchAwards}</div>
                                    <div className="label">Player of Match</div>
                                    <div className="mt-1 text-[11px] text-slate-300">Awards</div>
                                </div>
                                <div className="mt-4 ui-divider-soft" />
                                <div className="mt-3 text-sm font-medium text-slate-200 group-hover:text-white">Open player page</div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default SearchResultsPage;
    