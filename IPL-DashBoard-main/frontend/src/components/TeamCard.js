import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import teamMeta from '../data/teamMeta.json';

// helper: find meta by teamName case-insensitive, trimmed
function normalizeKey(s){
    return s ? s.toString().trim().toLowerCase().replace(/[^a-z0-9]/g, '') : '';
}

function findMeta(teamName) {
    if (!teamName) return null;
    const key = normalizeKey(teamName);
    // exact match
    for (const k of Object.keys(teamMeta)) {
        if (normalizeKey(k) === key) return teamMeta[k];
    }
    // includes (handle 'pune warriors india' vs 'pune warriors')
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

const TeamCard = ({ team }) => {
    const meta = findMeta(team.teamName) || {};
    const primary = team.primaryColor || meta.primaryColor || '#1f2937';
    const secondary = team.secondaryColor || meta.secondaryColor || '#374151';
    const logo = encodeURI((team.logo || meta.logo) || '/logos/Csk.jpg');

    const reducedMotion = usePrefersReducedMotion();
    const cardRef = useRef(null);

    const onMove = (e) => {
        if (reducedMotion) return;
        const el = cardRef.current;
        if (!el) return;

        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;

        const mx = Math.round(px * 100);
        const my = Math.round(py * 100);

        const rx = (0.5 - py) * 7;
        const ry = (px - 0.5) * 11;

        el.style.setProperty('--mx', `${mx}%`);
        el.style.setProperty('--my', `${my}%`);
        el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    };

    const onLeave = () => {
        const el = cardRef.current;
        if (!el) return;
        el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    };

    return (
        <Link
            to={`/teams/${team.teamName}`}
            ref={cardRef}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className="ui-feature-card ui-tilt-card group block"
            aria-label={`Open ${team.teamName}`}
        >
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div
                    className="absolute inset-x-0 top-0 h-28 opacity-95"
                    style={{ background: `linear-gradient(90deg, ${primary}, ${secondary})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/65" />
                <div
                    className="absolute -top-36 left-1/2 h-[360px] w-[640px] -translate-x-1/2 rounded-full blur-3xl"
                    style={{ background: `radial-gradient(circle at 50% 40%, ${primary}33, transparent 60%)` }}
                />
                <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-white/0 via-white/25 to-white/0" />
            </div>

            <div className="relative ui-feature-card-inner p-6 text-left">
                <div className="flex items-start gap-4">
                    <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-slate-950/45 ring-1 ring-white/10">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/0 to-white/20" aria-hidden="true" />
                        <img
                            src={logo}
                            alt={`${team.teamName} logo`}
                            className="h-12 w-12 object-contain"
                            style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.35))' }}
                        />
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                            <h3 className="text-lg font-semibold tracking-tight text-white truncate">{team.teamName}</h3>
                            <span className="shrink-0 ui-chip bg-white/10 text-[11px]">Team</span>
                        </div>
                        {(team.tagline || meta.tagline) && (
                            <p className="mt-1 text-sm text-slate-300 leading-relaxed line-clamp-2">
                                {team.tagline || meta.tagline}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
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

                <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/25">
                    <div className="relative h-12">
                        <div className="absolute inset-0" aria-hidden="true">
                            <div
                                className="absolute inset-0 opacity-70"
                                style={{ background: `linear-gradient(135deg, ${secondary}2A, ${primary}14)` }}
                            />
                            <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
                            <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10" />
                            <div className="absolute right-6 top-0 bottom-0 w-px bg-white/10" />
                        </div>
                        <div className="relative h-full p-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold tracking-wide text-slate-300">Franchise card</span>
                                <span className="ui-badge bg-white/5">Open</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-5 ui-divider-soft" />
                <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-100 group-hover:text-white">Open team page</span>
                    <span
                        className="ui-chip bg-white/10"
                        style={{ backgroundColor: `${primary}22` }}
                    >
                        View
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default TeamCard;