import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import Link
import Loader from './Loader'; // Assuming you have a Loader component

const MatchPage = () => {
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams(); // Get match ID from URL parameter

    useEffect(() => {
        const fetchMatch = async () => {
            try {
                setLoading(true);
                setError(null);
                // Fetch match details via same-origin proxy:
                // Frontend route remains /matches/:id, backend data is fetched from /api/v1/match/:id.
                const response = await fetch(`/api/v1/match/${encodeURIComponent(id)}`);
                const contentType = response.headers.get('content-type') || '';
                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(`Failed to fetch match (${response.status}): ${text.slice(0, 120)}`);
                }
                if (!contentType.includes('application/json')) {
                    const text = await response.text();
                    throw new Error(`Expected JSON but got: ${text.slice(0, 120)}`);
                }
                const data = await response.json();
                setMatch(data);
            } catch (err) {
                console.error("Error fetching match data:", err);
                setError("Failed to load match details. Please check the match ID and try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchMatch();
    }, [id]); // Re-fetch data when match ID changes in the URL

    if (loading) {
        return <Loader label="Loading match" />;
    }

    if (error) {
        return (
            <div className="ui-panel p-6 text-center">
                <div className="text-base font-semibold text-white">Unable to load match</div>
                <div className="mt-2 text-sm text-red-300">{error}</div>
            </div>
        );
    }

    if (!match) {
        return (
            <div className="ui-panel p-6 text-center">
                <div className="text-base font-semibold text-white">Match not found</div>
                <div className="mt-2 text-sm text-slate-400">Check the match ID and try again.</div>
            </div>
        );
    }

    // Determine winner and loser for display
    const isTeam1Winner = match.matchWinner === match.team1;
    const winnerTeam = isTeam1Winner ? match.team1 : match.team2;
    const loserTeam = isTeam1Winner ? match.team2 : match.team1;

    return (
        <div className="MatchPage">
            <section className="ui-glass rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    <div className="absolute inset-0 ui-scrim" />
                    <div className="absolute left-0 top-0 ui-hairline" />
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="ui-chip mb-2">Match sheet</div>
                        <h1 className="ui-title">Match Details</h1>
                        <p className="mt-1 text-sm text-slate-300">Season {match.season} • {match.date}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link to={`/teams/${match.team1}`} className="ui-btn-secondary">
                            {match.team1}
                        </Link>
                        <Link to={`/teams/${match.team2}`} className="ui-btn-secondary">
                            {match.team2}
                        </Link>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="ui-stat-pill">
                        <div className="value">{match.venue}</div>
                        <div className="label">Venue</div>
                        <div className="mt-1 text-[11px] text-slate-300">{match.city}</div>
                    </div>

                    <div className="ui-stat-pill">
                        <div className="value">{match.matchType}</div>
                        <div className="label">Match type</div>
                        <div className="mt-1 text-[11px] text-slate-300">Toss: {match.tossWinner} ({match.tossDecision})</div>
                    </div>
                </div>

                <div className="mt-6 ui-glass p-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="text-sm font-semibold text-white">Result</div>
                            <div className="mt-1 text-sm text-slate-300">
                                <span className="font-semibold text-emerald-300">{winnerTeam}</span>
                                <span className="text-slate-300"> won by </span>
                                <span className="font-semibold text-white">{match.resultMargin} {match.result}</span>
                                <span className="text-slate-300"> against </span>
                                <span className="font-semibold text-rose-300">{loserTeam}</span>
                                <span className="text-slate-300">.</span>
                            </div>
                        </div>

                        {(match.superOver === 'Y' || (match.method && match.method !== 'NA')) && (
                            <div className="flex flex-wrap gap-2">
                                {match.superOver === 'Y' && (
                                    <span className="ui-chip bg-orange-500/15 text-orange-100">Super Over</span>
                                )}
                                {match.method && match.method !== 'NA' && (
                                    <span className="ui-chip bg-orange-500/15 text-orange-100">Method: {match.method}</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {(match.playerOfMatch || match.umpire1 || match.umpire2) && (
                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                        {match.playerOfMatch && (
                            <div className="ui-stat-pill">
                                <div className="value">{match.playerOfMatch}</div>
                                <div className="label">Player of the Match</div>
                                <div className="mt-1 text-[11px] text-slate-300">
                                    <Link to={`/players/${match.playerOfMatch}`} className="font-semibold text-sky-300 hover:underline">
                                        View profile
                                    </Link>
                                </div>
                            </div>
                        )}

                        {(match.umpire1 || match.umpire2) && (
                            <div className="ui-stat-pill">
                                <div className="value">Officials</div>
                                <div className="label">Umpires</div>
                                <div className="mt-1 text-[11px] text-slate-300">
                                    {match.umpire1} {match.umpire2 ? `& ${match.umpire2}` : ''}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default MatchPage;