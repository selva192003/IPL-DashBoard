import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import MatchCard from './MatchCard';
import Loader from './Loader';
import teamMeta from '../data/teamMeta.json';

function normalizeKey(s) {
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

function clamp01(x) {
    if (Number.isNaN(x)) return 0;
    return Math.max(0, Math.min(1, x));
}

function percent(n) {
    return `${Math.round(n * 100)}%`;
}

function SwapIcon({ className = '' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path d="M7 7h12l-3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17 17H5l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

const HeadToHeadPage = () => {
    const [teams, setTeams] = useState([]);
    const [selectedTeam1, setSelectedTeam1] = useState('');
    const [selectedTeam2, setSelectedTeam2] = useState('');
    const [headToHeadData, setHeadToHeadData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [teamsLoading, setTeamsLoading] = useState(true);
    const [teamsError, setTeamsError] = useState(null);
    const [matchupError, setMatchupError] = useState(null);

    const safeTeams = Array.isArray(teams) ? teams : [];
    const safeMatches = Array.isArray(headToHeadData?.matches) ? headToHeadData.matches : [];
    const team1Wins = typeof headToHeadData?.team1Wins === 'number' ? headToHeadData.team1Wins : 0;
    const team2Wins = typeof headToHeadData?.team2Wins === 'number' ? headToHeadData.team2Wins : 0;
    const totalMatches = typeof headToHeadData?.totalMatches === 'number' ? headToHeadData.totalMatches : safeMatches.length;

    const meta1 = useMemo(() => findMeta(selectedTeam1) || {}, [selectedTeam1]);
    const meta2 = useMemo(() => findMeta(selectedTeam2) || {}, [selectedTeam2]);
    const team1Primary = meta1.primaryColor || '#1f2937';
    const team1Secondary = meta1.secondaryColor || '#374151';
    const team2Primary = meta2.primaryColor || '#1f2937';
    const team2Secondary = meta2.secondaryColor || '#374151';

    const logo1 = encodeURI(meta1.logo || '/logos/Csk.jpg');
    const logo2 = encodeURI(meta2.logo || '/logos/mi.jpg');

    const sameTeams = selectedTeam1 && selectedTeam2 && normalizeKey(selectedTeam1) === normalizeKey(selectedTeam2);

    const team1Share = totalMatches > 0 ? clamp01(team1Wins / totalMatches) : 0;
    const team2Share = totalMatches > 0 ? clamp01(team2Wins / totalMatches) : 0;
    const dominanceDelta = team1Wins - team2Wins;
    const dominanceText =
        totalMatches === 0
            ? 'No matchup data yet.'
            : dominanceDelta === 0
                ? 'Perfectly balanced rivalry.'
                : dominanceDelta > 0
                    ? `${selectedTeam1} leads by ${dominanceDelta}.`
                    : `${selectedTeam2} leads by ${Math.abs(dominanceDelta)}.`;

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                // Use the backend URL from environment variable
                const API_BASE = process.env.REACT_APP_API_URL || '';
                const response = await axios.get(`${API_BASE}/api/v1/team`);
                const data = response.data;
                const teamsArray = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.teams)
                        ? data.teams
                        : [];

                if (!Array.isArray(data)) {
                    console.warn('Expected array from /api/v1/team but got:', data);
                }

                setTeams(teamsArray);
                if (teamsArray.length > 1) {
                    setSelectedTeam1(teamsArray[0].teamName);
                    setSelectedTeam2(teamsArray[1].teamName);
                }
                setTeamsLoading(false);
            } catch (err) {
                console.error("Failed to load teams for selection:", err);
                setTeamsError("Failed to load teams for selection. Please check your backend server and API URL.");
                setTeamsLoading(false);
            }
        };

        fetchTeams();
    }, []);

    const fetchHeadToHead = async () => {
        if (!selectedTeam1 || !selectedTeam2) return;
        if (sameTeams) {
            setMatchupError('Choose two different teams to compare.');
            return;
        }
        setLoading(true);
        setMatchupError(null);
        try {
            // Use the backend URL from environment variable
            const API_BASE = process.env.REACT_APP_API_URL || '';
            const team1 = encodeURIComponent(selectedTeam1);
            const team2 = encodeURIComponent(selectedTeam2);
            const response = await axios.get(`${API_BASE}/api/v1/team/head-to-head?team1Name=${team1}&team2Name=${team2}`);
            setHeadToHeadData(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch head-to-head data:", err);
            setMatchupError("Failed to fetch head-to-head data. Please try again later.");
            setLoading(false);
        }
    };

    if (teamsLoading) {
        return <Loader label="Loading teams" />;
    }

    if (teamsError) {
        return (
            <div className="ui-panel p-6 text-center">
                <div className="text-base font-semibold text-white">Unable to load head-to-head</div>
                <div className="mt-2 text-sm text-red-300">{teamsError}</div>
            </div>
        );
    }

    return (
        <div className="HeadToHeadPage">
            <Reveal className="mb-7">
                <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 ui-glass">
                    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/0 via-slate-950/25 to-slate-950/75" />
                        <div
                            className="absolute -top-40 left-1/2 h-[520px] w-[980px] -translate-x-1/2 rounded-full blur-3xl"
                            style={{ background: `radial-gradient(circle at 40% 40%, ${team1Primary}22, transparent 60%)` }}
                        />
                        <div
                            className="absolute -bottom-56 right-[-180px] h-[560px] w-[560px] rounded-full blur-3xl"
                            style={{ background: `radial-gradient(circle at 55% 45%, ${team2Primary}22, ${team2Secondary}12, transparent 65%)` }}
                        />
                        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-white/0 via-white/25 to-white/0" />
                    </div>

                    <div className="relative px-6 py-10 sm:px-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <div className="ui-chip mb-2">Rivalry cockpit</div>
                                <h1 className="ui-title">Head-to-Head</h1>
                                <p className="ui-subtitle max-w-2xl">
                                    Rivalry comparison built for clarity: win-share, momentum, and a match list that reads like history.
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="ui-badge">Comparison</span>
                                <span className="ui-badge">Win-share</span>
                                <span className="ui-badge">Rivalry memory</span>
                            </div>
                        </div>
                    </div>
                </section>
            </Reveal>

            <Reveal delayMs={120}>
                <section className="ui-glass p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-white">Choose teams</div>
                        <span className="ui-badge">Compare</span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_1fr_auto] lg:items-center">
                        <select
                            className="ui-input"
                            value={selectedTeam1}
                            onChange={(e) => setSelectedTeam1(e.target.value)}
                        >
                            {safeTeams.map((team) => (
                                <option key={team.teamName} value={team.teamName}>{team.teamName}</option>
                            ))}
                        </select>

                        <button
                            type="button"
                            onClick={() => {
                                const a = selectedTeam1;
                                const b = selectedTeam2;
                                setSelectedTeam1(b);
                                setSelectedTeam2(a);
                            }}
                            className="ui-btn-secondary w-full lg:w-auto px-4"
                            aria-label="Swap teams"
                        >
                            <span className="inline-flex items-center gap-2">
                                <SwapIcon className="h-4 w-4" />
                                Swap
                            </span>
                        </button>

                        <select
                            className="ui-input"
                            value={selectedTeam2}
                            onChange={(e) => setSelectedTeam2(e.target.value)}
                        >
                            {safeTeams.map((team) => (
                                <option key={team.teamName} value={team.teamName}>{team.teamName}</option>
                            ))}
                        </select>

                        <button
                            onClick={fetchHeadToHead}
                            className="ui-btn w-full lg:w-auto"
                            disabled={!selectedTeam1 || !selectedTeam2 || sameTeams || loading}
                        >
                            {loading ? 'Loading…' : 'Get Matchup'}
                        </button>
                    </div>

                    {sameTeams && (
                        <div className="mt-3 text-sm text-amber-200/90">
                            Pick two different teams for a head-to-head comparison.
                        </div>
                    )}

                    {matchupError && (
                        <div className="mt-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                            {matchupError}
                        </div>
                    )}
                </section>
            </Reveal>

            {loading ? (
                <Loader label="Loading matchup" />
            ) : headToHeadData ? (
                <div className="mt-10">
                    <Reveal>
                        <section className="ui-glass p-6 sm:p-7">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <h2 className="text-lg sm:text-xl font-semibold text-white">Rivalry Summary</h2>
                                    <p className="mt-1 text-sm text-slate-400">{dominanceText}</p>
                                </div>
                                <div className="text-xs text-slate-400">{totalMatches} matches</div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
                                <div className="lg:col-span-4 ui-panel-muted ui-tilt-card p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-2xl bg-slate-950/35 ring-1 ring-white/10 flex items-center justify-center overflow-hidden">
                                            <img
                                                src={logo1}
                                                alt={`${selectedTeam1} logo`}
                                                className="h-10 w-10 object-contain"
                                                style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.35))' }}
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-sm font-semibold text-white truncate">{selectedTeam1}</div>
                                            <div className="text-xs text-slate-400">Win share</div>
                                        </div>
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <div className="ui-kpi">
                                            <div className="ui-kpi-label">Wins</div>
                                            <div className="ui-kpi-value">{team1Wins}</div>
                                        </div>
                                        <div className="ui-kpi">
                                            <div className="ui-kpi-label">Share</div>
                                            <div className="ui-kpi-value">{percent(team1Share)}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-4 ui-glass ui-tilt-card p-5">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <div className="text-sm font-semibold text-white">Win-share visual</div>
                                            <div className="mt-1 text-sm text-slate-400">A single glance at the split.</div>
                                        </div>
                                        <span className="ui-badge">Chart</span>
                                    </div>

                                    <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                                        <div className="flex items-center justify-between text-xs text-slate-300">
                                            <span className="truncate">{selectedTeam1}</span>
                                            <span className="truncate">{selectedTeam2}</span>
                                        </div>

                                        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-white/10">
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${Math.round(team1Share * 100)}%`,
                                                    background: `linear-gradient(90deg, ${team1Primary}, ${team1Secondary})`,
                                                    transition: 'width 700ms cubic-bezier(0.2, 0.9, 0.2, 1)',
                                                }}
                                                aria-hidden="true"
                                            />
                                        </div>

                                        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                                            <span>{team1Wins} wins</span>
                                            <span>{team2Wins} wins</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <div className="ui-kpi">
                                            <div className="ui-kpi-label">Total</div>
                                            <div className="ui-kpi-value">{totalMatches}</div>
                                        </div>
                                        <div className="ui-kpi">
                                            <div className="ui-kpi-label">Delta</div>
                                            <div className="ui-kpi-value">{Math.abs(dominanceDelta)}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-4 ui-panel-muted ui-tilt-card p-5">
                                    <div className="flex items-center gap-3 justify-end">
                                        <div className="min-w-0 text-right">
                                            <div className="text-sm font-semibold text-white truncate">{selectedTeam2}</div>
                                            <div className="text-xs text-slate-400">Win share</div>
                                        </div>
                                        <div className="h-12 w-12 rounded-2xl bg-slate-950/35 ring-1 ring-white/10 flex items-center justify-center overflow-hidden">
                                            <img
                                                src={logo2}
                                                alt={`${selectedTeam2} logo`}
                                                className="h-10 w-10 object-contain"
                                                style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.35))' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <div className="ui-kpi">
                                            <div className="ui-kpi-label">Share</div>
                                            <div className="ui-kpi-value">{percent(team2Share)}</div>
                                        </div>
                                        <div className="ui-kpi">
                                            <div className="ui-kpi-label">Wins</div>
                                            <div className="ui-kpi-value">{team2Wins}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </Reveal>

                    <div className="mt-10">
                        <Reveal>
                            <div className="flex items-end justify-between gap-3">
                                <div>
                                    <h2 className="text-lg sm:text-xl font-semibold text-white">Match History</h2>
                                    <p className="mt-1 text-sm text-slate-400">A timeline of games between these teams.</p>
                                </div>
                                <span className="ui-chip bg-white/10">{safeMatches.length} games</span>
                            </div>
                        </Reveal>

                        <div className="mt-4 space-y-4">
                            {safeMatches.length > 0 ? (
                                safeMatches.map((match, idx) => (
                                    <Reveal key={match.id} delayMs={70 + (idx % 10) * 55}>
                                        <MatchCard match={match} teamName={selectedTeam1} />
                                    </Reveal>
                                ))
                            ) : (
                                <Reveal delayMs={120}>
                                    <div className="ui-glass p-6 text-center text-sm text-slate-300">
                                        No matches found for this matchup.
                                    </div>
                                </Reveal>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <Reveal>
                    <div className="mt-8 ui-glass p-6 text-center text-sm text-slate-300">
                        Pick two teams and click “Get Matchup” to see the rivalry breakdown.
                    </div>
                </Reveal>
            )}
        </div>
    );
};

export default HeadToHeadPage;