import React from "react";

const Loader = ({ label = "Loading" }) => (
  <div className="flex items-center justify-center py-16">
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <div
        className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white/70"
        aria-hidden="true"
      />
      <div className="text-sm text-slate-200">
        {label}
        <span className="text-slate-400">…</span>
      </div>
    </div>
  </div>
);

export default Loader;
