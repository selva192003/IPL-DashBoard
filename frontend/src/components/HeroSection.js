import React from "react";

const HeroSection = ({ onViewTeams, onViewStats }) => {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b1b3a] via-[#0f2559] to-[#132e7a] text-white shadow-xl">
      {/* Background visuals */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-purple-500 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-cyan-400 blur-3xl" />
        <div className="absolute left-1/3 top-1/3 h-40 w-40 rounded-full bg-indigo-500/60 blur-2xl" />
      </div>

      <div className="relative z-10 px-6 py-12 md:px-10 md:py-16">
        <div className="max-w-5xl mx-auto">
          <p className="uppercase tracking-widest text-cyan-300 text-xs md:text-sm font-semibold">Indian Premier League</p>
          <h1 className="mt-2 text-3xl md:text-5xl font-extrabold leading-tight">
            Analytics Dashboard for a High-Octane IPL Season
          </h1>
          <p className="mt-4 text-sm md:text-lg text-blue-100 max-w-2xl">
            Deep-dive into live action, team strength, and player brilliance. Built for speed, insight, and the thrill of T20 cricket.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={onViewTeams}
              className="px-5 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-sm md:text-base font-semibold shadow-lg shadow-cyan-500/30 transition-transform hover:scale-[1.02]"
            >
              Explore Teams
            </button>
            <button
              onClick={onViewStats}
              className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white ring-1 ring-white/20 text-sm md:text-base font-semibold backdrop-blur-md transition-transform hover:scale-[1.02]"
            >
              View Season Stats
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
