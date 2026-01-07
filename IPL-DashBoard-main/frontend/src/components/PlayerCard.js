import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

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

function initialsFromName(name) {
    const safe = (name || '').toString().trim();
    if (!safe) return 'P';

    const parts = safe.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

    return `${parts[0].slice(0, 1)}${parts[parts.length - 1].slice(0, 1)}`.toUpperCase();
}

function accentForName(name) {
    // Stable accent selection (no new colors). Uses Tailwind default palette tokens only.
    const s = (name || '').toString();
    let hash = 0;
    for (let i = 0; i < s.length; i += 1) {
        hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
    }

    const accents = ['indigo', 'cyan', 'fuchsia', 'emerald'];
    return accents[hash % accents.length];
}

export default function PlayerCard({ player }) {
    const reducedMotion = usePrefersReducedMotion();
    const cardRef = useRef(null);

    const accent = useMemo(() => accentForName(player?.name), [player?.name]);

    const gradientClass =
        accent === 'cyan'
            ? 'bg-gradient-to-br from-cyan-500/18 via-white/5 to-indigo-600/10'
            : accent === 'fuchsia'
                ? 'bg-gradient-to-br from-fuchsia-500/18 via-white/5 to-indigo-600/10'
                : accent === 'emerald'
                    ? 'bg-gradient-to-br from-emerald-500/18 via-white/5 to-cyan-500/10'
                    : 'bg-gradient-to-br from-indigo-600/18 via-white/5 to-cyan-500/10';

    const chipClass =
        accent === 'cyan'
            ? 'bg-cyan-500/15 group-hover:bg-cyan-500/25'
            : accent === 'fuchsia'
                ? 'bg-fuchsia-500/15 group-hover:bg-fuchsia-500/25'
                : accent === 'emerald'
                    ? 'bg-emerald-500/15 group-hover:bg-emerald-500/25'
                    : 'bg-indigo-600/15 group-hover:bg-indigo-600/25';

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

    const name = player?.name || 'Player';
    const awards = typeof player?.totalPlayerOfMatchAwards === 'number' ? player.totalPlayerOfMatchAwards : 0;

    return (
        <Link
            to={`/players/${name}`}
            ref={cardRef}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className={`ui-feature-card group block ${gradientClass}`.trim()}
            aria-label={`Open ${name}`}
        >
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute inset-0 ui-scrim" />
                <div className="absolute left-0 top-0 ui-hairline" />
            </div>

            <div className="relative ui-feature-card-inner p-6 text-left">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-4 min-w-0">
                        <div
                            className="relative h-14 w-14 overflow-hidden rounded-2xl border"
                            style={{ background: 'var(--ui-surface-muted)', borderColor: 'var(--ui-border)' }}
                        >
                            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-100" aria-hidden="true">
                                {initialsFromName(name)}
                            </div>
                        </div>

                        <div className="min-w-0">
                            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-white line-clamp-2">
                                {name}
                            </h2>
                            <div className="mt-1 inline-flex items-center gap-2 text-xs text-slate-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" aria-hidden="true" />
                                Profile-ready · Tap to open
                            </div>
                        </div>
                    </div>

                    <span className={`ui-badge shrink-0 ${chipClass} text-slate-100`}>
                        View
                    </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="ui-stat-pill">
                        <div className="value">{awards}</div>
                        <div className="label">Player of Match</div>
                        <div className="mt-1 text-[11px] text-slate-300">Clutch performances</div>
                    </div>
                    <div className="ui-stat-pill">
                        <div className="value">Impact</div>
                        <div className="label">Signal</div>
                        <div className="mt-1 text-[11px] text-slate-300">Profile depth</div>
                    </div>
                </div>

                <div className="mt-5 ui-divider-soft" />
                <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-100 group-hover:text-white">Open profile</span>
                    <span className="ui-badge">Awards • Matches</span>
                </div>
            </div>
        </Link>
    );
}
