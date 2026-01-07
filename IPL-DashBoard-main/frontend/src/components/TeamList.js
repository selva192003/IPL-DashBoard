import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Loader from './Loader';
import TeamCard from './TeamCard';

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

const TeamList = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const safeTeams = Array.isArray(teams) ? teams : [];

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                // Use relative API by default (Vercel rewrite / CRA proxy). Optionally allow REACT_APP_API_URL to prefix.
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
                setLoading(false);
            } catch (err) {
                console.error('Failed to load teams:', err);
                setError('Failed to load teams for selection. Please check your backend server and API URL.');
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

    if (loading) {
        return <Loader label="Loading teams" />;
    }

    if (error) {
        return (
            <div className="ui-panel p-6 text-center">
                <div className="text-base font-semibold text-white">Unable to load teams</div>
                <div className="mt-2 text-sm text-red-300">{error}</div>
            </div>
        );
    }

    if (safeTeams.length === 0) {
        return (
            <div className="ui-panel p-6 text-center">
                <div className="text-base font-semibold text-white">No teams available</div>
                <div className="mt-2 text-sm text-slate-400">Try again in a moment.</div>
            </div>
        );
    }

    return (
        <div className="TeamList">
            <Reveal className="mb-7">
                <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/0 via-slate-950/20 to-slate-950/60" />
                        <div className="absolute -top-32 left-1/2 h-[360px] w-[760px] -translate-x-1/2 rounded-full bg-indigo-600/12 blur-3xl" />
                        <div className="absolute -bottom-48 right-[-140px] h-[420px] w-[420px] rounded-full bg-cyan-500/12 blur-3xl" />
                    </div>

                    <div className="relative px-6 py-10 sm:px-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h1 className="ui-title">Teams</h1>
                                <p className="ui-subtitle max-w-2xl">
                                    A grid built like a franchise showcase — identity-forward visuals with fast access to each
                                    team’s seasons, match history, and outcomes.
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="ui-badge">Franchises</span>
                                <span className="ui-badge">Identity</span>
                                <span className="ui-badge">History</span>
                            </div>
                        </div>
                    </div>
                </section>
            </Reveal>

            <div className="mt-8 ui-glass relative overflow-hidden rounded-3xl border border-white/10 px-6 py-12 shadow-xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(99,102,241,0.35),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(14,165,233,0.3),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(45,212,191,0.25),transparent_35%)]" aria-hidden="true" />
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-white/0 via-white/30 to-white/0" />
                    <div className="absolute right-0 top-10 h-px w-1/2 bg-gradient-to-l from-cyan-300/60 via-transparent to-transparent" />
                </div>

                <div className="relative flex flex-col gap-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/80">Teams</p>
                            <h1 className="text-3xl font-semibold text-white">Franchises & Legacies</h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-200/80">
                                Explore every IPL franchise, their history, captains, and win records. Each card gives you a quick pulse of performance and identity.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-cyan-100/80">
                            <span className="chip chip-soft">Season 2024</span>
                            <span className="chip chip-soft">Live Tracker</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200/80">
                        <span className="chip chip-ghost">Total Teams: {safeTeams.length}</span>
                        <span className="chip chip-ghost">Historic Champions Included</span>
                        <span className="chip chip-ghost">Click a card to dive in</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {safeTeams.map((team, idx) => (
                    <Reveal key={team.teamName || team.id || idx} delayMs={60 + (idx % 9) * 55}>
                        <TeamCard team={team} />
                    </Reveal>
                ))}
            </div>
        </div>
    );
};

export default TeamList;