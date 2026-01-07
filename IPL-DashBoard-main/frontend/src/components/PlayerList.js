import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Loader from './Loader';
import PlayerCard from './PlayerCard';

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

function SearchIcon({ className = '' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <path
                d="M20 20l-3.4-3.4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    );
}

const PlayerList = () => {
    const [allPlayers, setAllPlayers] = useState([]); // Store all fetched players
    const [filteredPlayers, setFilteredPlayers] = useState([]); // Players displayed after filtering
    const [searchQuery, setSearchQuery] = useState(''); // New state for local search input
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const safeAllPlayers = Array.isArray(allPlayers) ? allPlayers : [];
    const safeFilteredPlayers = Array.isArray(filteredPlayers) ? filteredPlayers : [];

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                setLoading(true);
                setError(null);
                // Use relative API by default (Vercel rewrite / CRA proxy). Optionally allow REACT_APP_API_URL to prefix.
                const API_BASE = process.env.REACT_APP_API_URL || '';
                const response = await axios.get(`${API_BASE}/api/v1/players`);

                const data = response.data;
                const playersArray = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.players)
                        ? data.players
                        : [];

                if (!Array.isArray(data)) {
                    console.warn('Expected array from /api/v1/players but got:', data);
                }

                setAllPlayers(playersArray);
                setFilteredPlayers(playersArray); // Initially display all players
            } catch (err) {
                console.error("Error fetching players:", err);
                setError("Failed to load players. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchPlayers();
    }, []);

    // New: Effect to filter players based on search query
    useEffect(() => {
        const sourcePlayers = Array.isArray(allPlayers) ? allPlayers : [];
        if (searchQuery.trim() === '') {
            setFilteredPlayers(sourcePlayers); // If search is empty, show all players
        } else {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const results = sourcePlayers.filter(player =>
                player.name.toLowerCase().includes(lowerCaseQuery)
            );
            setFilteredPlayers(results);
        }
    }, [searchQuery, allPlayers]); // Re-filter when search query or allPlayers change

    if (loading) {
        return <Loader label="Loading players" />;
    }

    if (error) {
        return (
            <div className="ui-panel p-6 text-center">
                <div className="text-base font-semibold text-white">Unable to load players</div>
                <div className="mt-2 text-sm text-red-300">{error}</div>
            </div>
        );
    }

    if (safeAllPlayers.length === 0 && !loading) { // Check allPlayers length only after loading
        return (
            <div className="ui-panel p-6 text-center">
                <div className="text-base font-semibold text-white">No players found</div>
                <div className="mt-2 text-sm text-slate-400">The database returned an empty list.</div>
            </div>
        );
    }

    return (
        <div className="PlayerList">
            <Reveal className="mb-7">
                <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/0 via-slate-950/20 to-slate-950/65" />
                        <div className="absolute -top-40 left-1/2 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
                        <div className="absolute -bottom-56 right-[-160px] h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-3xl" />
                        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-white/0 via-white/25 to-white/0" />
                    </div>

                    <div className="relative px-6 py-10 sm:px-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <div className="ui-chip mb-2 w-fit">Motion-ready roster</div>
                                <h1 className="ui-title">Players</h1>
                                <p className="ui-subtitle max-w-2xl">
                                    Profiles tuned for scanning — crisp naming, impact signal, and a glide path to awards and head-to-heads.
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="ui-badge">Profiles</span>
                                <span className="ui-badge">Hierarchy</span>
                                <span className="ui-badge">Smooth flow</span>
                            </div>
                        </div>
                    </div>
                </section>
            </Reveal>

            <Reveal className="mb-7" delayMs={120}>
                <section className="ui-panel p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <SearchIcon className="h-5 w-5 text-slate-300" />
                            <div className="text-sm font-semibold text-white">Search players</div>
                        </div>
                        <span className="ui-badge">{safeFilteredPlayers.length} results</span>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            placeholder="Type a player name"
                            className="ui-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="ui-btn-secondary w-full sm:w-auto"
                        >
                            Clear
                        </button>
                    </div>

                    <div className="mt-4 ui-divider-soft" />
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span className="ui-chip bg-white/5 text-[11px]">Local search · No extra API calls</span>
                        <span className="ui-chip bg-white/5 text-[11px]">Live count updates</span>
                    </div>
                </section>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {safeFilteredPlayers.length > 0 ? (
                    safeFilteredPlayers.map((player, idx) => (
                        <Reveal key={player.name} delayMs={60 + (idx % 12) * 45}>
                            <PlayerCard player={player} />
                        </Reveal>
                    ))
                ) : (
                    <div className="ui-panel p-6 text-center text-sm text-slate-400 col-span-full">
                        No players found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlayerList;