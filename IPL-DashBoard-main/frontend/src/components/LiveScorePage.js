import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import Confetti from './Confetti';

function getTeamColor(teamName) {
    const colors = {
        'Chennai Super Kings': { bg: 'bg-yellow-600', text: 'text-yellow-100', hex: '#ca8a04' },
        'CSK': { bg: 'bg-yellow-600', text: 'text-yellow-100', hex: '#ca8a04' },
        'Mumbai Indians': { bg: 'bg-blue-600', text: 'text-blue-100', hex: '#2563eb' },
        'MI': { bg: 'bg-blue-600', text: 'text-blue-100', hex: '#2563eb' },
        'Royal Challengers Bangalore': { bg: 'bg-red-600', text: 'text-red-100', hex: '#dc2626' },
        'RCB': { bg: 'bg-red-600', text: 'text-red-100', hex: '#dc2626' },
        'Kolkata Knight Riders': { bg: 'bg-purple-700', text: 'text-purple-100', hex: '#7e22ce' },
        'KKR': { bg: 'bg-purple-700', text: 'text-purple-100', hex: '#7e22ce' },
        'Delhi Capitals': { bg: 'bg-cyan-600', text: 'text-cyan-100', hex: '#0891b2' },
        'DC': { bg: 'bg-cyan-600', text: 'text-cyan-100', hex: '#0891b2' },
        'Rajasthan Royals': { bg: 'bg-pink-600', text: 'text-pink-100', hex: '#db2777' },
        'RR': { bg: 'bg-pink-600', text: 'text-pink-100', hex: '#db2777' },
        'Punjab Kings': { bg: 'bg-red-700', text: 'text-red-100', hex: '#b91c1c' },
        'PBKS': { bg: 'bg-red-700', text: 'text-red-100', hex: '#b91c1c' },
        'Sunrisers Hyderabad': { bg: 'bg-orange-600', text: 'text-orange-100', hex: '#ea580c' },
        'SRH': { bg: 'bg-orange-600', text: 'text-orange-100', hex: '#ea580c' },
    };
    return colors[teamName] || { bg: 'bg-slate-600', text: 'text-slate-100', hex: '#475569' };
}

function TeamAvatar({ teamName }) {
    const color = getTeamColor(teamName);
    const initials = teamName.split(' ').map(w => w[0]).join('').substring(0, 2);
    return (
        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${color.bg} ${color.text}`}>
            {initials}
        </div>
    );
}

function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
        if (!mq) return;

        const onChange = () => setReduced(!!mq.matches);
        onChange();

        if (mq.addEventListener) mq.addEventListener('change', onChange);
        else mq.addListener(onChange);

        return () => {
            if (mq.removeEventListener) mq.removeEventListener('change', onChange);
            else mq.removeListener(onChange);
        };
    }, []);

    return reduced;
}

function Reveal({ children, className = '', delayMs = 0 }) {
    const ref = useRef(null);
    const reducedMotion = usePrefersReducedMotion();

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const hasIO = typeof window !== 'undefined' && typeof window.IntersectionObserver === 'function';
        if (reducedMotion || !hasIO) {
            el.classList.add('ui-reveal-in');
            return;
        }

        const io = new window.IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        window.setTimeout(() => {
                            entry.target.classList.add('ui-reveal-in');
                        }, delayMs);
                        io.unobserve(entry.target);
                    }
                }
            },
            { threshold: 0.12 }
        );

        io.observe(el);
        return () => io.disconnect();
    }, [delayMs, reducedMotion]);

    return (
        <div ref={ref} className={`ui-reveal ${className}`.trim()}>
            {children}
        </div>
    );
}

const LiveScorePage = () => {
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const fetchIconicMatch = async () => {
            try {
                setLoading(true);
                setError(null);
                setIsAnimating(true);
                
                // First, try to load from localStorage (passed from homepage widget)
                const saved = localStorage.getItem('currentIconicMatch');
                if (saved) {
                    try {
                        const matchData = JSON.parse(saved);
                        setTimeout(() => {
                            setMatch(matchData);
                            setIsAnimating(false);
                        }, 200);
                        setLoading(false);
                        return;
                    } catch (e) {
                        console.warn('Failed to parse saved match', e);
                    }
                }

                // If not in localStorage, fetch from backend
                const API_BASE = process.env.REACT_APP_API_URL || '';
                const response = await axios.get(`${API_BASE}/api/v1/iconic-match`);
                
                if (response.data) {
                    // Small delay for animation effect
                    setTimeout(() => {
                        setMatch(response.data);
                        setIsAnimating(false);
                    }, 200);
                } else {
                    setError('No iconic match data available.');
                    setLoading(false);
                    setIsAnimating(false);
                }
                setLoading(false);
            } catch (err) {
                console.error('Failed to load iconic match:', err);
                setError('Failed to load iconic match data. Please try again later.');
                setLoading(false);
                setIsAnimating(false);
            }
        };

        fetchIconicMatch();
    }, []);

    if (loading) {
        return <Loader label="Loading iconic match" />;
    }

    if (error) {
        return (
            <div className="py-10">
                <Reveal>
                    <div className="ui-panel p-6 text-center">
                        <div className="text-base font-semibold text-white">Unable to load match</div>
                        <div className="mt-2 text-sm text-red-300">{error}</div>
                    </div>
                </Reveal>
            </div>
        );
    }

    if (!match) {
        return (
            <div className="py-10">
                <Reveal>
                    <div className="ui-panel p-6 text-center">
                        <div className="text-base font-semibold text-white">No data available</div>
                        <div className="mt-2 text-sm text-slate-400">Try refreshing the page.</div>
                    </div>
                </Reveal>
            </div>
        );
    }

    const stageLabel = (match.matchType || '').toLowerCase();
    const isFinal = stageLabel.includes('final');
    const isQualifier = stageLabel.includes('qualifier');
    const isEliminator = stageLabel.includes('eliminator');
    const isSuperOver = (match.superOver || '').toLowerCase().includes('yes') || (match.method || '').toLowerCase().includes('super');
    const finishType = (match.result || '').toLowerCase().includes('wicket') ? 'wickets' : 'runs';
    const closeFinish = (() => { const n = parseInt(match.resultMargin || '', 10); if (Number.isNaN(n)) return false; return finishType === 'wickets' ? n <= 2 : n <= 5; })();
    const shouldShowConfetti = isFinal || isQualifier || isEliminator || isSuperOver || closeFinish;

    return (
        <>
            {match && <Confetti active={shouldShowConfetti} teamColor={getTeamColor(match.matchWinner).hex} />}
        <div className="py-10">
            <Reveal>
                <section className={`relative overflow-hidden rounded-3xl border border-white/10 ${isFinal ? 'bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10' : 'bg-white/5'}`}>
                    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/0 via-slate-950/20 to-slate-950/60" />
                        {isFinal && <div className="absolute -top-36 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-amber-400/15 blur-3xl" />}
                        <div className="absolute -bottom-48 right-[-140px] h-[420px] w-[420px] rounded-full bg-cyan-500/12 blur-3xl" />
                    </div>

                    <div className="relative px-6 py-10 sm:px-8">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-wrap items-center gap-2 w-fit">
                                <span className="ui-chip bg-emerald-500/15 text-emerald-200">Iconic</span>
                                {isFinal && <span className="ui-chip bg-amber-500/20 text-amber-100 font-semibold">🏆 Final</span>}
                                {isQualifier && <span className="ui-chip bg-indigo-500/20 text-indigo-100">Qualifier</span>}
                                {isEliminator && <span className="ui-chip bg-rose-500/20 text-rose-100">Eliminator</span>}
                                {isSuperOver && <span className="ui-chip bg-fuchsia-500/20 text-fuchsia-100">⚡ Super Over</span>}
                                {closeFinish && <span className="ui-chip bg-cyan-500/20 text-cyan-100">Nail-biter</span>}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2">
                                <div className="flex items-center gap-3">
                                    <TeamAvatar teamName={match.team1} />
                                    <div>
                                        <div className="text-sm text-slate-400">Team 1</div>
                                        <div className="text-lg font-semibold text-white">{match.team1}</div>
                                    </div>
                                </div>
                                <div className="hidden sm:block text-slate-500 font-bold">vs</div>
                                <div className="flex items-center gap-3">
                                    <div>
                                        <div className="text-sm text-slate-400">Team 2</div>
                                        <div className="text-lg font-semibold text-white">{match.team2}</div>
                                    </div>
                                    <TeamAvatar teamName={match.team2} />
                                </div>
                            </div>

                            <div className={`mt-3 inline-flex items-center gap-3 rounded-2xl border px-4 py-2 ${isFinal ? 'border-amber-400/30 bg-amber-500/10' : 'border-white/10 bg-white/5'}`}>
                                <span className="text-base font-semibold text-white">{match.matchWinner} won</span>
                                <span className="text-sm text-slate-300">by {match.resultMargin} {match.result}</span>
                                {isFinal && <span className="ui-badge bg-amber-500/30 text-amber-100 ring-amber-300/30">Champion</span>}
                            </div>
                        </div>
                    </div>
                </section>
            </Reveal>

            <Reveal delayMs={120}>
                <div className={`mt-8 ui-glass relative overflow-hidden rounded-3xl border border-white/10 p-6 sm:p-8 transition-opacity duration-300 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(99,102,241,0.2),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(14,165,233,0.15),transparent_30%)]" aria-hidden="true" />
                    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-white/0 via-white/25 to-white/0" />
                    </div>

                    <div className="relative">
                            {/* Match Header */}
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between pb-6 border-b border-white/10">
                                <div className="flex-1">
                                    <div className="text-xs uppercase tracking-widest text-slate-400">Season {match.season}</div>
                                    <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-white leading-tight">
                                        <span className="flex items-center gap-2 sm:inline-flex">
                                            <TeamAvatar teamName={match.team1} />
                                            {match.team1}
                                        </span>
                                        <span className="text-slate-400"> vs </span>
                                        <span className="flex items-center gap-2 sm:inline-flex">
                                            {match.team2}
                                            <TeamAvatar teamName={match.team2} />
                                        </span>
                                    </h2>
                                    <p className="mt-2 text-sm text-slate-300">{match.venue}</p>
                                    <p className="mt-1 text-xs text-slate-400">{match.date}</p>
                                </div>

                                <div className="flex flex-col items-start sm:items-end gap-3 flex-shrink-0">
                                    <span className="ui-chip bg-emerald-500/20 text-emerald-200 text-sm">✓ {match.matchWinner} Won</span>
                                    <span className="text-sm text-slate-300 font-semibold">By {match.resultMargin} {match.result}</span>
                                </div>
                            </div>

                        {/* Key Notes */}
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="text-xs uppercase tracking-widest text-slate-400">Stage</div>
                                <div className="mt-1 text-sm font-semibold text-white">{match.matchType || (isSuperOver ? 'Super Over' : 'Featured')}</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="text-xs uppercase tracking-widest text-slate-400">Result</div>
                                <div className="mt-1 text-sm font-semibold text-white">{match.matchWinner} by {match.resultMargin} {match.result}</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="text-xs uppercase tracking-widest text-slate-400">Venue · Date</div>
                                <div className="mt-1 text-sm font-semibold text-white">{match.venue}</div>
                                <div className="text-xs text-slate-300">{match.date} · Season {match.season}</div>
                            </div>
                        </div>

                        {match.significance && (
                            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30">
                                <p className="text-sm text-slate-200 leading-relaxed">
                                    <span className="font-semibold text-cyan-300">📌 Why It Matters: </span>
                                    {match.significance}
                                </p>
                            </div>
                        )}

                        {/* Player of Match */}
                        {match.playerOfMatch && (
                            <div className="mt-6 p-5 rounded-xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-red-500/15 border border-amber-400/30">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <div className="text-xs uppercase tracking-widest text-amber-200 font-bold">👑 Player of the Match</div>
                                        <div className="mt-2 text-xl font-bold text-white">{match.playerOfMatch}</div>
                                    </div>
                                    <span className="ui-chip bg-amber-500/20 text-amber-200 font-bold">MVP</span>
                                </div>
                            </div>
                        )}

                        {/* Additional Stats */}
                        {(match.highest_partnership || match.wicket_taker) && (
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {match.highest_partnership && (
                                    <div className="p-3 rounded-lg bg-white/5 border border-indigo-500/20">
                                        <div className="text-xs text-slate-400 font-semibold">HIGHEST PARTNERSHIP</div>
                                        <div className="mt-1 text-sm font-bold text-white">{match.highest_partnership}</div>
                                    </div>
                                )}
                                {match.wicket_taker && (
                                    <div className="p-3 rounded-lg bg-white/5 border border-rose-500/20">
                                        <div className="text-xs text-slate-400 font-semibold">KEY BOWLER</div>
                                        <div className="mt-1 text-sm font-bold text-white">{match.wicket_taker}</div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Enhanced Data Features */}
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Toss Information */}
                            {(match.toss_winner || match.toss_decision) && (
                                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
                                    <div className="text-xs uppercase tracking-widest text-purple-300 font-bold">🎲 Toss Winner</div>
                                    <div className="mt-2 text-lg font-bold text-white">{match.toss_winner || 'N/A'}</div>
                                    {match.toss_decision && (
                                        <div className="mt-1 text-xs text-purple-200">Chose to {match.toss_decision}</div>
                                    )}
                                </div>
                            )}

                            {/* Umpires */}
                            {(match.umpire1 || match.umpire2) && (
                                <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20">
                                    <div className="text-xs uppercase tracking-widest text-cyan-300 font-bold">🏏 Umpires</div>
                                    <div className="mt-2 text-sm font-bold text-white">
                                        {match.umpire1 && <div>{match.umpire1}</div>}
                                        {match.umpire2 && <div className="text-xs text-cyan-200 mt-1">{match.umpire2}</div>}
                                    </div>
                                </div>
                            )}

                            {/* City */}
                            {match.city && (
                                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
                                    <div className="text-xs uppercase tracking-widest text-emerald-300 font-bold">📍 City</div>
                                    <div className="mt-2 text-lg font-bold text-white">{match.city}</div>
                                </div>
                            )}

                            {/* Team 1 Top Bowler */}
                            {match.team1_top_bowler && (
                                <div className="p-4 rounded-xl bg-gradient-to-br from-rose-500/10 to-rose-500/5 border border-rose-500/20">
                                    <div className="text-xs uppercase tracking-widest text-rose-300 font-bold">⚡ {match.team1} Bowler</div>
                                    <div className="mt-2 text-sm font-bold text-white">{match.team1_top_bowler}</div>
                                    {match.team1_top_bowler_wickets && (
                                        <div className="text-xs text-rose-200 mt-1">🎯 {match.team1_top_bowler_wickets} wickets</div>
                                    )}
                                </div>
                            )}

                            {/* Team 2 Top Bowler */}
                            {match.team2_top_bowler && (
                                <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20">
                                    <div className="text-xs uppercase tracking-widest text-orange-300 font-bold">⚡ {match.team2} Bowler</div>
                                    <div className="mt-2 text-sm font-bold text-white">{match.team2_top_bowler}</div>
                                    {match.team2_top_bowler_wickets && (
                                        <div className="text-xs text-orange-200 mt-1">🎯 {match.team2_top_bowler_wickets} wickets</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Reveal>

            {/* Team Explorer */}
            <Reveal delayMs={280}>
                <div className="mt-8 flex flex-col gap-4">
                    <h3 className="text-lg font-semibold text-white">Explore Teams</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {/* Team 1 */}
                        <Link 
                            to={`/teams/${match.team1}`}
                            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4 transition-all duration-300 hover:border-white/30 hover:shadow-lg hover:shadow-white/10"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            <div className="relative flex flex-col items-center gap-3">
                                <TeamAvatar teamName={match.team1} />
                                <div className="text-center">
                                    <div className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">{match.team1}</div>
                                    <div className="text-xs text-slate-400 group-hover:text-slate-300">View matches</div>
                                </div>
                            </div>
                        </Link>

                        {/* Team 2 */}
                        <Link 
                            to={`/teams/${match.team2}`}
                            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4 transition-all duration-300 hover:border-white/30 hover:shadow-lg hover:shadow-white/10"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            <div className="relative flex flex-col items-center gap-3">
                                <TeamAvatar teamName={match.team2} />
                                <div className="text-center">
                                    <div className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">{match.team2}</div>
                                    <div className="text-xs text-slate-400 group-hover:text-slate-300">View matches</div>
                                </div>
                            </div>
                        </Link>

                        {/* All Teams - Always shown */}
                        <Link 
                            to="/teams"
                            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4 transition-all duration-300 hover:border-white/30 hover:shadow-lg hover:shadow-white/10"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            <div className="relative flex flex-col items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm bg-cyan-600/50 text-cyan-200">
                                    👥
                                </div>
                                <div className="text-center">
                                    <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">All Teams</div>
                                    <div className="text-xs text-slate-400 group-hover:text-slate-300">Browse</div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </Reveal>

            {/* Actions */}
            <Reveal delayMs={240}>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-xs text-slate-300">
                        💡 Tip: Use the buttons to explore or share memorable matches
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="ui-btn px-4 py-2"
                            title="Get another iconic match"
                        >
                            Refresh iconic match
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const summary = `${match.team1} vs ${match.team2} — ${match.matchWinner} won by ${match.resultMargin} ${match.result} (${match.matchType || 'Featured'}; ${match.venue}, ${match.date})`;
                                navigator.clipboard && navigator.clipboard.writeText(summary).catch(() => {});
                            }}
                            className="ui-btn-secondary px-4 py-2"
                            title="Copy summary to clipboard"
                        >
                            Copy summary
                        </button>
                    </div>
                </div>
            </Reveal>
        </div>
        </>
    );
};

export default LiveScorePage;