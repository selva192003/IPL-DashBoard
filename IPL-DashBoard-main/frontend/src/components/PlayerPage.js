import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MatchCard from './MatchCard';
import Loader from './Loader';

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

function initialsFromName(name) {
    const safe = (name || '').toString().trim();
    if (!safe) return 'P';
    const parts = safe.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0].slice(0, 1)}${parts[parts.length - 1].slice(0, 1)}`.toUpperCase();
}

function accentForName(name) {
    const s = (name || '').toString();
    let hash = 0;
    for (let i = 0; i < s.length; i += 1) {
        hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
    }
    const accents = ['indigo', 'cyan', 'fuchsia', 'emerald'];
    return accents[hash % accents.length];
}

const PlayerPage = () => {
    const [player, setPlayer] = useState(null);
    const [playerMatches, setPlayerMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { playerName } = useParams();

    const displayName = player?.name || playerName || '';
    const accent = useMemo(() => accentForName(displayName), [displayName]);
    const heroGlowClass =
        accent === 'cyan'
            ? 'bg-cyan-500/12'
            : accent === 'fuchsia'
                ? 'bg-fuchsia-500/12'
                : accent === 'emerald'
                    ? 'bg-emerald-500/12'
                    : 'bg-indigo-600/12';

    const chipClass =
        accent === 'cyan'
            ? 'bg-cyan-500/15'
            : accent === 'fuchsia'
                ? 'bg-fuchsia-500/15'
                : accent === 'emerald'
                    ? 'bg-emerald-500/15'
                    : 'bg-indigo-600/15';

    const matchCount = Array.isArray(playerMatches) ? playerMatches.length : 0;

    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Use relative URLs to correctly route through the proxy
                const encodedPlayer = encodeURIComponent(playerName);
                const playerResponse = await fetch(`/api/v1/players/${encodedPlayer}`);
                const playerData = await playerResponse.json();
                setPlayer(playerData);

                // Use relative URLs for the matches as well
                const matchesResponse = await fetch(`/api/v1/players/${encodedPlayer}/player-of-match-awards`);
                const matchesData = await matchesResponse.json();
                setPlayerMatches(matchesData);

            } catch (err) {
                console.error("Error fetching player data:", err);
                setError("Failed to load player data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchPlayerData();
    }, [playerName]);

    if (loading) {
        return <Loader label="Loading player" />;
    }

    if (error) {
        return (
            <div className="ui-panel p-6 text-center">
                <div className="text-base font-semibold text-white">Unable to load player</div>
                <div className="mt-2 text-sm text-red-300">{error}</div>
            </div>
        );
    }

    if (!player) {
        return (
            <div className="ui-panel p-6 text-center">
                <div className="text-base font-semibold text-white">Player not found</div>
                <div className="mt-2 text-sm text-slate-400">Try searching for a different name.</div>
            </div>
        );
    }

    return (
        <div className="PlayerPage">
            <Reveal>
                <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/0 via-slate-950/25 to-slate-950/70" />
                        <div className={`absolute -top-48 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full ${heroGlowClass} blur-3xl`} />
                        <div className="absolute -bottom-56 right-[-160px] h-[520px] w-[520px] rounded-full bg-white/5 blur-3xl" />
                        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-white/0 via-white/25 to-white/0" />
                    </div>

                    <div className="relative p-6 sm:p-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-start gap-4 min-w-0">
                                <div className="relative h-16 w-16 overflow-hidden rounded-3xl bg-slate-950/45 ring-1 ring-white/10">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/0 to-white/20" aria-hidden="true" />
                                    <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-100" aria-hidden="true">
                                        {initialsFromName(player.name)}
                                    </div>
                                </div>

                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={`ui-badge ${chipClass} text-slate-100 ring-white/10`}>
                                            Player
                                        </span>
                                        <span className="ui-badge">Profile</span>
                                        <span className="ui-chip bg-white/5 text-[11px]">Premium view</span>
                                    </div>
                                    <h1 className="mt-3 ui-title truncate">{player.name}</h1>
                                    <p className="ui-subtitle max-w-2xl">
                                        A focused profile canvas with impact highlights and Player of the Match reels.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
                                <div className="ui-stat-pill">
                                    <div className="value">{player.totalPlayerOfMatchAwards}</div>
                                    <div className="label">Player of Match</div>
                                    <div className="mt-1 text-[11px] text-slate-300">Clutch moments</div>
                                </div>
                                <div className="ui-stat-pill">
                                    <div className="value">{matchCount}</div>
                                    <div className="label">Award Matches</div>
                                    <div className="mt-1 text-[11px] text-slate-300">Matches listed</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 ui-divider-soft" />
                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-sm text-slate-300">
                                Browse award matches below, or jump back to the player grid.
                            </div>
                            <Link to="/players" className="ui-btn-secondary w-full sm:w-auto">
                                Back to Players
                            </Link>
                        </div>
                    </div>
                </section>
            </Reveal>

            <section className="mt-10">
                <Reveal>
                    <div className="flex items-end justify-between gap-3">
                        <div>
                            <div className="ui-chip mb-2">Highlights reel</div>
                            <h2 className="text-lg sm:text-xl font-semibold text-white">Player of the Match Games</h2>
                            <p className="mt-1 text-sm text-slate-400">
                                Matches where {player.name} took the spotlight.
                            </p>
                        </div>
                        <div className="text-xs text-slate-300">{matchCount} matches</div>
                    </div>
                </Reveal>

                <div className="mt-4">
                    {Array.isArray(playerMatches) && playerMatches.length > 0 ? (
                        playerMatches.map((match, idx) => (
                            <Reveal key={match.id} delayMs={80 + (idx % 10) * 55}>
                                <MatchCard match={match} teamName={match.matchWinner} />
                            </Reveal>
                        ))
                    ) : (
                        <Reveal delayMs={120}>
                            <div className="ui-panel p-6 text-center text-sm text-slate-400">
                                No Player of the Match awards found for this player.
                            </div>
                        </Reveal>
                    )}
                </div>
            </section>
        </div>
    );
};

export default PlayerPage;