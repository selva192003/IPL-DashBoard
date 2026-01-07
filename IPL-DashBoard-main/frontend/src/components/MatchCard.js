import React from 'react';
import { Link } from 'react-router-dom';

const MatchCard = ({ match, teamName }) => {
    const opponentTeam = match.team1 === teamName ? match.team2 : match.team1;
    const isMatchWinner = match.matchWinner === teamName;

    return (
        <Link to={`/matches/${match.id}`} className="block">
            <div className="ui-glass ui-tilt-card p-5 sm:p-6 text-left relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-slate-950/65" />
                    <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-white/0 via-white/25 to-white/0" />
                </div>

                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Season {match.season}</div>
                        <h3 className="mt-1 text-base sm:text-lg font-semibold text-white truncate">
                            {match.team1}
                            <span className="text-slate-500"> vs </span>
                            {match.team2}
                        </h3>
                        <div className="mt-1 text-sm text-slate-300 truncate">{match.venue}</div>
                    </div>

                    <div className="shrink-0 text-right">
                        <div className="ui-chip text-[11px] bg-white/5">{match.date}</div>
                        <div className="mt-2">
                            <span className="ui-badge">View</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="ui-stat-pill">
                        <div className="value">{match.matchWinner}</div>
                        <div className="label">Winner</div>
                        <div className="mt-1 text-[11px] text-slate-300">Won by {match.resultMargin} {match.result}</div>
                    </div>

                    <div className="ui-stat-pill">
                        <div className="value">{opponentTeam}</div>
                        <div className="label">Opponent</div>
                        {match.playerOfMatch ? (
                            <div className="mt-1 text-[11px] text-slate-300 truncate">
                                Player of Match: <span className="text-sky-200">{match.playerOfMatch}</span>
                            </div>
                        ) : (
                            <div className="mt-1 text-[11px] text-slate-500">Player of Match: —</div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default MatchCard;
