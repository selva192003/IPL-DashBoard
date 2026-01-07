import React, { useEffect, useMemo, useRef, useState } from 'react';
import IconicMatchWidget from './IconicMatchWidget';
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

function Reveal({ children, className = '', delayMs = 0 }) {
    const ref = useRef(null);
    const reducedMotion = usePrefersReducedMotion();

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        // In test environments (jsdom) and older browsers, IntersectionObserver may not exist.
        // Fall back to showing content immediately.
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
            { threshold: 0.15 }
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

function IplMark({ className = '' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M4.5 16.5c3.2-7.6 8.7-12.1 15-12.4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
            <path
                d="M6.2 19.2c5.1-1.7 10.7-1.6 14.8-0.4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.8"
            />
            <path
                d="M10.2 9.1l3.3 3.3"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.85"
            />
        </svg>
    );
}

function ModuleCard({
    eyebrow,
    title,
    description,
    cta,
    to,
    accent = 'indigo',
    graphic,
}) {
    const cardRef = useRef(null);
    const reducedMotion = usePrefersReducedMotion();

    const onMove = (e) => {
        if (reducedMotion) return;
        const el = cardRef.current;
        if (!el) return;

        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;

        const mx = Math.round(px * 100);
        const my = Math.round(py * 100);

        // Premium tilt: controlled, readable.
        const rx = (0.5 - py) * 7;
        const ry = (px - 0.5) * 10;

        el.style.setProperty('--mx', `${mx}%`);
        el.style.setProperty('--my', `${my}%`);
        el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    };

    const onLeave = () => {
        const el = cardRef.current;
        if (!el) return;
        el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    };

    const accentChip =
        accent === 'cyan'
            ? 'bg-cyan-500/15 group-hover:bg-cyan-500/25'
            : accent === 'fuchsia'
                ? 'bg-fuchsia-500/15 group-hover:bg-fuchsia-500/25'
                : 'bg-indigo-600/15 group-hover:bg-indigo-600/25';

    const accentGlow =
        accent === 'cyan'
            ? 'bg-cyan-500/15'
            : accent === 'fuchsia'
                ? 'bg-fuchsia-500/15'
                : 'bg-indigo-600/15';

    return (
        <Link
            to={to}
            ref={cardRef}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className="ui-feature-card group block"
            aria-label={cta}
        >
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-slate-950/55" />
                <div className={`absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full ${accentGlow} blur-3xl`} />
            </div>

            <div className="relative ui-feature-card-inner p-7 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <div className="text-xs font-semibold tracking-wide text-slate-300/90">
                            {eyebrow}
                        </div>
                        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                            {title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                            {description}
                        </p>
                    </div>

                    <span className="ui-badge shrink-0 group-hover:bg-white/15">Module</span>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/30">
                    <div className="relative h-28 sm:h-32">
                        <div className="absolute inset-0" aria-hidden="true">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/0 to-white/0" />
                            <div className="absolute -right-20 -top-16 h-56 w-56 rounded-full bg-white/5 blur-2xl" />
                        </div>
                        <div className="relative h-full p-4">{graphic}</div>
                    </div>
                </div>

                <div className="mt-6 ui-divider" />

                <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-100 group-hover:text-white">
                        {cta}
                    </span>
                    <span className={`ui-badge ${accentChip} text-slate-100 ring-white/10`}>
                        Open
                    </span>
                </div>
            </div>
        </Link>
    );
}

const HomePage = () => {
    const storyMoments = useMemo(
        () => [
            {
                title: 'Franchise identity',
                body: 'Colors, culture, and home-ground energy — every team is a world of its own.',
                tag: 'Teams',
            },
            {
                title: 'Player impact',
                body: 'From powerplay intent to death-overs control — performances define narratives.',
                tag: 'Players',
            },
            {
                title: 'Rivalry memory',
                body: 'Head-to-head is where history repeats, breaks, and surprises.',
                tag: 'Head-to-Head',
            },
        ],
        []
    );

    const heroStats = useMemo(
        () => [
            { label: 'Teams', value: '10', helper: 'Identity-first cards' },
            { label: 'Players', value: '200+', helper: 'Profiles & insights' },
            { label: 'Rivalries', value: '35+', helper: 'Head-to-head splits' },
        ],
        []
    );

    const marqueeItems = useMemo(
        () => [
            'Instant navigation',
            'Motion-first UI',
            'Glass surfaces',
            'Scroll storytelling',
            'Responsive by default',
            'Premium typography',
        ],
        []
    );

    const eras = useMemo(
        () => [
            {
                range: '2008–2010',
                title: 'The Opening Overs',
                body: 'A new format lands — franchises form identities, stars adapt, fans fall in love with tempo.',
                badge: 'Foundation',
                linkLabel: 'Official IPL',
                linkUrl: 'https://www.iplt20.com/',
            },
            {
                range: '2011–2017',
                title: 'The Expansion Era',
                body: 'Matchups become mythology. Teams evolve strategies. Fans start following form, venues, and roles.',
                badge: 'Rivalries',
                linkLabel: 'IPL News',
                linkUrl: 'https://www.iplt20.com/news',
            },
            {
                range: '2018–Today',
                title: 'The Modern IPL',
                body: 'Digital-first viewing. Faster insights. Cleaner storytelling — every season is a product experience.',
                badge: 'Insights',
                linkLabel: 'Live & Blogs',
                linkUrl: 'https://www.espncricinfo.com/series/indian-premier-league-2024-1410320',
            },
        ],
        []
    );

    return (
        <div className="HomePage">
            {/* 1) HERO (Above the fold) */}
            <section className="ui-hero relative overflow-hidden rounded-[32px] border border-white/10">
                <div className="ui-hero-aurora" aria-hidden="true">
                    <div className="ui-gridlines" />
                    <div className="ui-noise" />
                    <div className="ui-rings" />
                </div>

                <div className="relative px-6 py-16 sm:px-10 sm:py-20 lg:px-14">
                    <div className="grid items-center gap-10 lg:grid-cols-12">
                        <Reveal className="lg:col-span-7">
                            <div className="flex flex-col gap-5">
                                <div className="ui-chip w-fit">
                                    <span className="h-2 w-2 rounded-full bg-emerald-300" aria-hidden="true" />
                                    Season ready · Live-grade UI
                                </div>
                                <div>
                                    <p className="ui-tagline">Premium IPL product surface</p>
                                    <h1 className="mt-2 text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-white">
                                        A modern IPL cockpit designed for motion, depth, and clarity.
                                    </h1>
                                    <p className="mt-4 max-w-3xl text-base sm:text-lg text-slate-300 leading-relaxed">
                                        Glide through teams, players, and rivalries with a visual language that mirrors top-tier sports platforms.
                                        Clean hierarchy, purposeful spacing, and thoughtful micro-interactions guide every scroll.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <Link to="/teams" className="ui-btn w-full sm:w-auto px-6 py-3">
                                        Browse Teams
                                    </Link>
                                    <Link to="/head-to-head" className="ui-btn-secondary w-full sm:w-auto px-6 py-3">
                                        Head-to-Head View
                                    </Link>
                                    <a href="#ecosystem" className="ui-scroll-cue sm:ml-3">Scroll to modules</a>
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    {heroStats.map((stat) => (
                                        <div key={stat.label} className="ui-stat-pill">
                                            <div className="value">{stat.value}</div>
                                            <div className="label">{stat.label}</div>
                                            <div className="mt-1 text-xs text-slate-300">{stat.helper}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3">
                                    <div className="ui-marquee">
                                        {[...marqueeItems, ...marqueeItems].map((item, idx) => (
                                            <span key={`${item}-${idx}`} className="ui-chip bg-white/5 text-slate-100">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Reveal>

                        <Reveal delayMs={160} className="lg:col-span-5">
                            {/* Live iconic match widget replacing mock capsule */}
                            <IconicMatchWidget />
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* 2) ABOUT IPL */}
            <section id="about" className="mt-14">
                <Reveal>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="ui-chip">Context, not clutter</div>
                            <h2 className="ui-title mt-2">About the IPL</h2>
                            <p className="ui-subtitle max-w-2xl">
                                Franchise-first T20 built on momentum, storylines, and rivalry memory. We frame it with clarity so
                                you can glide between identity, impact, and history without losing the thread.
                            </p>
                        </div>
                        <span className="ui-badge">Built to scroll</span>
                    </div>
                </Reveal>

                <div className="mt-8 grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
                    <Reveal delayMs={120} className="lg:col-span-5">
                        <div className="ui-glass p-7 lg:self-start">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-semibold text-white">A fan-first league</div>
                                <span className="ui-badge">Overview</span>
                            </div>
                            <p className="mt-3 text-sm text-slate-200 leading-relaxed">
                                A sprint format that rewards intent, data, and narrative. Teams are brands, players are storyline anchors,
                                and conditions are characters. This dashboard honors that balance with a product-grade surface.
                            </p>
                            <div className="mt-5 ui-divider-soft" />
                            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                                <div className="ui-stat-pill">
                                    <div className="value">T20</div>
                                    <div className="label">Format</div>
                                    <div className="mt-1 text-[11px] text-slate-300">High tempo</div>
                                </div>
                                <div className="ui-stat-pill">
                                    <div className="value">Fan-first</div>
                                    <div className="label">DNA</div>
                                    <div className="mt-1 text-[11px] text-slate-300">Culture + data</div>
                                </div>
                                <div className="ui-stat-pill">
                                    <div className="value">Matchups</div>
                                    <div className="label">Edge</div>
                                    <div className="mt-1 text-[11px] text-slate-300">Roles & venues</div>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    <div className="lg:col-span-7">
                        <div className="relative">
                            <div className="absolute left-3 top-2 bottom-2 w-px bg-white/10" aria-hidden="true" />
                            <div className="space-y-4">
                                {storyMoments.map((m, idx) => (
                                    <Reveal key={m.title} delayMs={160 + idx * 90}>
                                        <div className="relative ui-panel-muted ui-tilt-card p-6 pl-10">
                                            <div className="absolute left-2.5 top-6 h-3 w-3 rounded-full bg-white/10 ring-1 ring-white/10" aria-hidden="true" />
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <div className="text-sm font-semibold text-white">{m.title}</div>
                                                    <div className="mt-1 text-sm text-slate-300 leading-relaxed">{m.body}</div>
                                                </div>
                                                <span className="ui-badge shrink-0">{m.tag}</span>
                                            </div>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3) IPL HISTORY */}
            <section id="history" className="mt-14">
                <Reveal>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="ui-chip">Era-based story</div>
                            <h2 className="ui-title mt-2">IPL History</h2>
                            <p className="ui-subtitle max-w-2xl">
                                Reinvention every cycle — identity-building at launch, strategy wars in the middle overs, and today’s
                                digital clarity. Browse the eras like highlight reels.
                            </p>
                        </div>
                        <div className="text-sm text-slate-300">Built for quick scanning</div>
                    </div>
                </Reveal>

                <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3 auto-rows-fr">
                    {eras.map((e, idx) => (
                        <Reveal key={e.range} delayMs={120 + idx * 90}>
                            <div className="ui-panel ui-tilt-card p-6 sm:p-7 text-left h-full flex flex-col">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <div className="text-xs font-semibold tracking-wide text-slate-400">{e.range}</div>
                                        <div className="mt-2 text-lg font-semibold text-white leading-tight">{e.title}</div>
                                    </div>
                                    <span className="ui-badge shrink-0">{e.badge}</span>
                                </div>
                                <p className="mt-4 text-sm text-slate-300 leading-relaxed flex-grow">{e.body}</p>
                                <div className="mt-6 ui-divider-soft" />
                                <div className="mt-4 flex items-center justify-between text-xs text-slate-200 flex-shrink-0">
                                    <a
                                        href={e.linkUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="font-semibold hover:text-white underline underline-offset-4"
                                    >
                                        {e.linkLabel}
                                    </a>
                                    <IplMark className="h-5 w-5 text-slate-300" />
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>

                <Reveal delayMs={420}>
                    <div className="mt-6 ui-glass p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="text-sm font-semibold text-white">Live updates</div>
                                <div className="mt-1 text-sm text-slate-300">External destinations for real-time IPL news and blogs.</div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <a className="ui-btn-secondary" href="https://www.iplt20.com/news" target="_blank" rel="noreferrer">IPL News</a>
                                <a className="ui-btn-secondary" href="https://www.espncricinfo.com/" target="_blank" rel="noreferrer">ESPNcricinfo</a>
                                <a className="ui-btn-secondary" href="https://www.cricbuzz.com/cricket-series/ipl-2024" target="_blank" rel="noreferrer">Cricbuzz IPL</a>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </section>

            {/* 4) IPL ECOSYSTEM / COMPONENTS (MOST IMPORTANT) */}
            <section id="ecosystem" className="mt-14">
                <Reveal>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="ui-chip">The main gateways</div>
                            <h2 className="ui-title mt-2">IPL Ecosystem</h2>
                            <p className="ui-subtitle max-w-2xl">
                                Three hero modules sit front-and-center. Each opens to a focused surface with hierarchy, motion, and high-contrast readability.
                            </p>
                        </div>
                        <span className="ui-badge">No clutter</span>
                    </div>
                </Reveal>

                <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Reveal delayMs={140}>
                        <ModuleCard
                            eyebrow="🏏 Franchise Universe"
                            title="Teams"
                            description="Explore franchises with identity-first cards, match history, and a modern sports surface."
                            cta="Explore Teams"
                            to="/teams"
                            accent="indigo"
                            graphic={
                                <div className="h-full w-full">
                                    <div className="flex h-full items-end justify-between gap-3">
                                        <div className="flex-1">
                                            <div className="text-xs font-semibold tracking-wide text-slate-300">Team identity</div>
                                            <div className="mt-2 h-2 w-24 rounded-full bg-white/10" />
                                            <div className="mt-2 h-2 w-32 rounded-full bg-white/10" />
                                            <div className="mt-2 h-2 w-20 rounded-full bg-white/10" />
                                        </div>
                                        <div className="flex items-end gap-2">
                                            <div className="h-10 w-3 rounded-full bg-indigo-500/25" />
                                            <div className="h-16 w-3 rounded-full bg-indigo-500/35" />
                                            <div className="h-12 w-3 rounded-full bg-indigo-500/25" />
                                            <div className="h-20 w-3 rounded-full bg-indigo-500/40" />
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                    </Reveal>

                    <Reveal delayMs={200}>
                        <ModuleCard
                            eyebrow="👤 Player Impact"
                            title="Players"
                            description="Profile-style browsing built for clarity — quick scanning, strong hierarchy, smooth flow."
                            cta="View Players"
                            to="/players"
                            accent="cyan"
                            graphic={
                                <div className="h-full w-full">
                                    <div className="flex h-full items-center gap-4">
                                        <div className="h-16 w-16 rounded-2xl bg-white/10 ring-1 ring-white/10" />
                                        <div className="min-w-0 flex-1">
                                            <div className="h-2 w-28 rounded-full bg-white/10" />
                                            <div className="mt-3 h-2 w-40 rounded-full bg-white/10" />
                                            <div className="mt-3 flex items-center gap-2">
                                                <span className="h-2 w-16 rounded-full bg-cyan-500/25" />
                                                <span className="h-2 w-10 rounded-full bg-cyan-500/20" />
                                                <span className="h-2 w-12 rounded-full bg-cyan-500/20" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                    </Reveal>

                    <Reveal delayMs={260}>
                        <ModuleCard
                            eyebrow="📊 Rivalry Intelligence"
                            title="Head-to-Head"
                            description="Compare franchises with visual balance and readable deltas — built for rivalry memory."
                            cta="Compare Teams"
                            to="/head-to-head"
                            accent="fuchsia"
                            graphic={
                                <div className="h-full w-full">
                                    <div className="flex h-full items-end justify-between gap-3">
                                        <div className="flex-1">
                                            <div className="text-xs font-semibold tracking-wide text-slate-300">Rivalry split</div>
                                            <div className="mt-3 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                                                <div className="h-full w-[58%] bg-fuchsia-500/30" />
                                            </div>
                                            <div className="mt-3 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                                                <div className="h-full w-[42%] bg-indigo-500/25" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="ui-badge bg-white/5">Wins</span>
                                            <span className="ui-badge bg-white/5">Runs</span>
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                    </Reveal>
                </div>

                <Reveal delayMs={320}>
                    <div className="mt-7 ui-glass p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="text-sm font-semibold text-white">Pro tip</div>
                                <div className="mt-1 text-sm text-slate-300">
                                    Use the header search to jump straight to any team, player, or rivalry — it respects the new hierarchy.
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <a href="#history" className="ui-btn-secondary">Back to History</a>
                                <Link to="/teams" className="ui-btn">Start with Teams</Link>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </section>
        </div>
    );
};

export default HomePage;
