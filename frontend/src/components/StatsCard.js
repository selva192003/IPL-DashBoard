import React from "react";

const StatsCard = ({ title, value, accent = "cyan" }) => {
  const accentMap = {
    cyan: "from-cyan-500/20 to-transparent ring-cyan-400/40",
    purple: "from-purple-500/20 to-transparent ring-purple-400/40",
    indigo: "from-indigo-500/20 to-transparent ring-indigo-400/40",
    amber: "from-amber-500/20 to-transparent ring-amber-400/40",
  };

  const accentClass = accentMap[accent] || accentMap.cyan;

  return (
    <div className={`relative rounded-xl bg-gradient-to-br ${accentClass} ring-1 p-5 backdrop-blur-md text-white shadow-lg hover:shadow-xl transition-all hover:translate-y-[-2px]`}> 
      <div className="absolute -top-5 -right-5 h-16 w-16 rounded-full bg-white/5 blur-xl" />
      <p className="text-xs uppercase tracking-widest text-white/70">{title}</p>
      <p className="mt-2 text-2xl md:text-3xl font-bold">{value}</p>
    </div>
  );
};

export default StatsCard;
