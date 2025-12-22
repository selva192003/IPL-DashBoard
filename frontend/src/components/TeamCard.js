import React from 'react';

// Enhanced TeamCard with IPL-inspired gradients, hover depth, and clearer hierarchy
const TeamCard = ({ team }) => {
    const primary = team?.primaryColor || '#102a63';
    const secondary = team?.secondaryColor || '#0ea5e9';

    return (
        <div
            className="relative group rounded-2xl overflow-hidden ring-1 ring-white/10 bg-[#0c1635] text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            style={{
                backgroundImage: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
            }}
        >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
            <div className="relative z-10 p-5">
                <div className="flex items-center gap-3">
                    {team?.logo && (
                        <img
                            src={team.logo}
                            alt={`${team.name} logo`}
                            className="h-10 w-10 rounded-md bg-white/90 p-1 shadow-md"
                        />
                    )}
                    <div>
                        <h3 className="text-lg md:text-xl font-bold tracking-wide">{team.name}</h3>
                        {team?.shortName && (
                            <p className="text-xs uppercase tracking-widest text-white/70">{team.shortName}</p>
                        )}
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    {team?.captain && (
                        <div className="rounded-lg bg-white/10 px-3 py-2">
                            <p className="text-white/70">Captain</p>
                            <p className="font-semibold">{team.captain}</p>
                        </div>
                    )}
                    {team?.coach && (
                        <div className="rounded-lg bg-white/10 px-3 py-2">
                            <p className="text-white/70">Coach</p>
                            <p className="font-semibold">{team.coach}</p>
                        </div>
                    )}
                </div>

                {team?.wins != null && team?.losses != null && (
                    <div className="mt-4 flex items-center gap-2 text-xs">
                        <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-300 ring-1 ring-green-400/30">W {team.wins}</span>
                        <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-300 ring-1 ring-red-400/30">L {team.losses}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamCard;
