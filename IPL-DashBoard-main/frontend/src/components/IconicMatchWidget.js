import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import teamMeta from '../data/teamMeta.json';

function normalizeKey(s) {
  return String(s || '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function findMeta(teamName) {
  const key = normalizeKey(teamName);
  const entries = Object.entries(teamMeta || {});
  for (const [name, meta] of entries) {
    if (normalizeKey(name) === key) return meta;
  }
  return null;
}

function initials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || '';
  const last = (parts.length > 1 ? parts[parts.length - 1]?.[0] : '') || '';
  return (first + last).toUpperCase();
}

function TeamTile({ teamName, isWinner, score, overs }) {
  const meta = findMeta(teamName);
  const logo = meta?.logo;
  const hasLine2 = Boolean(score) || Boolean(overs);

  return (
    <div
      className={`rounded-xl border p-3 ${isWinner ? 'border-emerald-400/25 bg-emerald-500/10' : ''}`}
      style={!isWinner ? { borderColor: 'var(--ui-border)', background: 'var(--ui-surface-muted)' } : undefined}
    >
      <div className="flex items-center gap-3">
        {logo ? (
          <img
            src={logo}
            alt={`${teamName} logo`}
            className="h-11 w-11 rounded-full border object-contain"
            style={{ background: 'var(--ui-surface)', borderColor: 'var(--ui-border)' }}
            loading="lazy"
          />
        ) : (
          <div
            className="grid h-11 w-11 place-items-center rounded-full border text-sm font-semibold text-white"
            style={{ background: 'var(--ui-surface)', borderColor: 'var(--ui-border)' }}
          >
            {initials(teamName)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-white leading-tight whitespace-normal break-words">{teamName}</div>

          {hasLine2 && (
            <div className="mt-1 text-xs text-slate-300">
              {score ? score : null}
              {score && overs ? ' · ' : null}
              {overs ? `${overs} ov` : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const IconicMatchWidget = () => {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    const API_BASE = process.env.REACT_APP_API_URL || '';

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${API_BASE}/api/v1/iconic-match`);
        if (!ignore && res.data) {
          // Save to localStorage so /live page shows same match
          localStorage.setItem('currentIconicMatch', JSON.stringify(res.data));
          setMatch(res.data);
        }
      } catch (e) {
        if (!ignore) setError('Unable to load iconic match');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, []);

  return (
    <div className="ui-glass relative overflow-hidden p-6">
      <div className="ui-spotlight" aria-hidden="true" />
      <div className="flex items-center justify-between">
        <div className="ui-chip">Iconic moment</div>
        <span className="text-xs font-semibold text-slate-300">Legendary matches</span>
      </div>

      <div className="mt-5 ui-panel p-4 shadow-xl">
        {loading && (
          <div className="text-sm text-slate-300">Loading iconic match…</div>
        )}
        {error && (
          <div className="text-sm text-red-300">{error}</div>
        )}
        {!loading && !error && match && (
          <>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Historic IPL</div>
                <div className="mt-2 text-lg font-semibold text-white">{match.team1} vs {match.team2}</div>
                <div className="text-sm text-slate-300">{match.venue} · {match.date}</div>
              </div>
              <div className="text-right">
                <div className="ui-chip bg-emerald-500/20 text-emerald-100">
                  {match.matchWinner} won
                </div>
                <div className="mt-2 text-xs text-slate-300">By {match.resultMargin} {match.result}</div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-center">
              <TeamTile
                teamName={match.team1}
                isWinner={match.matchWinner === match.team1}
                score={match.team1_score}
                overs={match.team1_overs}
              />
              <TeamTile
                teamName={match.team2}
                isWinner={match.matchWinner === match.team2}
                score={match.team2_score}
                overs={match.team2_overs}
              />
            </div>
          </>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-slate-300">Click to see full scorecard</span>
        <Link to="/live" className="ui-btn-secondary px-3 py-1.5 text-sm">Full scorecard</Link>
      </div>
    </div>
  );
};

export default IconicMatchWidget;
