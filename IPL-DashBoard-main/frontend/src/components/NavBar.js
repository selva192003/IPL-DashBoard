import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const THEME_KEY = 'iplTheme';

function SunIcon({ className = '' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <path d="M12 2v2.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M12 19.8V22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M4.2 12H2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M22 12h-2.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M5.6 5.6l1.6 1.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M16.8 16.8l1.6 1.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M18.4 5.6l-1.6 1.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M7.2 16.8l-1.6 1.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

function MoonIcon({ className = '' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M21 13.2A7.7 7.7 0 0 1 10.8 3a6.7 6.7 0 1 0 10.2 10.2Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
        </svg>
    );
}

const NavBar = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [theme, setTheme] = useState('night');

    useEffect(() => {
        const saved = window.localStorage ? window.localStorage.getItem(THEME_KEY) : null;
        const initial = saved === 'day' || saved === 'night' ? saved : 'night';
        setTheme(initial);
        document.documentElement.classList.toggle('theme-day', initial === 'day');
    }, []);

    const toggleTheme = () => {
        const next = theme === 'day' ? 'night' : 'day';
        setTheme(next);
        document.documentElement.classList.toggle('theme-day', next === 'day');
        if (window.localStorage) window.localStorage.setItem(THEME_KEY, next);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) return;
        navigate(`/search?query=${encodeURIComponent(trimmed)}`);
    };

    return (
        <header className="sticky top-0 z-40 ui-nav ui-chrome backdrop-blur">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
                <div className="ui-glass relative flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
                    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                        <div className="absolute left-0 top-0 ui-hairline" />
                    </div>

                    <div className="flex items-center gap-3">
                        <Link to="/" className="group flex items-center gap-2">
                            <div
                                className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-2xl border flex items-center justify-center overflow-hidden"
                                style={{ background: 'var(--ui-surface-muted)', borderColor: 'var(--ui-border)' }}
                            >
                                <img
                                    src={`${process.env.PUBLIC_URL || ''}/logo.png`}
                                    alt="CricPulse"
                                    className="h-full w-full object-contain p-1.5 sm:p-2"
                                    draggable="false"
                                />
                            </div>
                            <div className="leading-tight">
                                <div className="text-sm sm:text-base font-extrabold tracking-tighter text-white">CricPulse</div>
                                <div className="mt-0.5 text-sm italic text-gray-400 transition-colors duration-200 group-hover:text-emerald-300 group-hover:drop-shadow-sm">
                                    Finally, a dashboard that doesn't choke in the qualifiers.
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <form onSubmit={onSubmit} className="hidden md:flex items-center gap-2">
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search teams or players"
                                className="ui-input w-72"
                            />
                            <button type="submit" className="ui-btn px-3">
                                Search
                            </button>
                        </form>

                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="ui-btn-secondary px-3"
                            aria-label="Toggle day/night theme"
                            title={theme === 'day' ? 'Night look (reversed)' : 'Day look (reversed)'}
                        >
                            {theme === 'day' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default NavBar;