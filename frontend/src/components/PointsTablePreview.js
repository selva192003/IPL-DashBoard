import React from "react";

const PointsTablePreview = ({ table = [] }) => {
  const rows = table.length
    ? table
    : [
        { team: "KKR", played: 10, won: 7, pts: 14 },
        { team: "CSK", played: 10, won: 6, pts: 12 },
        { team: "MI", played: 10, won: 5, pts: 10 },
        { team: "RCB", played: 10, won: 5, pts: 10 },
      ];

  return (
    <div className="rounded-2xl bg-[#0c1635] text-white ring-1 ring-white/10 shadow-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Points Table</h3>
        <span className="text-xs text-white/60">Preview</span>
      </div>
      <div className="px-5 py-4">
        <div className="grid grid-cols-4 text-xs uppercase tracking-widest text-white/60">
          <div>Team</div>
          <div className="text-center">Played</div>
          <div className="text-center">Won</div>
          <div className="text-right">Pts</div>
        </div>
        <div className="mt-3 space-y-2">
          {rows.map((r, idx) => (
            <div
              key={`${r.team}-${idx}`}
              className="grid grid-cols-4 items-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors px-3 py-2"
            >
              <div className="font-medium">{r.team}</div>
              <div className="text-center">{r.played}</div>
              <div className="text-center">{r.won}</div>
              <div className="text-right font-semibold">{r.pts}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PointsTablePreview;
