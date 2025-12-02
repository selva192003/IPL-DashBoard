import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import teamMeta from '../data/teamMeta.json';

// helper: find meta by teamName case-insensitive, trimmed
function normalizeKey(s){
    return s ? s.toString().trim().toLowerCase().replace(/[^a-z0-9]/g, '') : '';
}

function findMeta(teamName) {
    if (!teamName) return null;
    const key = normalizeKey(teamName);
    for (const k of Object.keys(teamMeta)) {
        if (normalizeKey(k) === key) return teamMeta[k];
    }
    for (const k of Object.keys(teamMeta)) {
        const nk = normalizeKey(k);
        if (nk.includes(key) || key.includes(nk)) return teamMeta[k];
    }
    return null;
}

const TeamList = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                // Use the proxied URL for the backend API endpoint
                const response = await axios.get('/api/v1/team');
                setTeams(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load teams:", err);
                setError("Failed to load teams for selection. Please check your backend server and API URL.");
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-center text-red-500 p-4">{error}</div>;
    }

    if (teams.length === 0) {
        return <div className="text-center p-4">No teams available.</div>;
    }

    return (
        <div className="TeamList p-4">
            <h1 className="text-4xl font-bold text-center mb-6 text-indigo-400">IPL Teams</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map(team => {
                    const meta = findMeta(team.teamName) || {};
                    const primary = team.primaryColor || meta.primaryColor || '#1f2937';
                    const secondary = team.secondaryColor || meta.secondaryColor || '#374151';
                    const logo = encodeURI((team.logo || meta.logo) || '/logos/Csk.jpg');
                    return (
                        <div key={team.teamName} className="p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 text-white" style={{background: `linear-gradient(90deg, ${primary}, ${secondary})`, position: 'relative', overflow: 'hidden', paddingLeft: 160}}>
                            <div style={{position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', opacity: 0.98}}>
                                <img src={logo} alt={`${team.teamName} logo`} style={{width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.35))'}} />
                            </div>
                            <Link to={`/teams/${team.teamName}`} className="text-white relative">
                                <h2 className="text-2xl font-semibold mb-2">{team.teamName}</h2>
                                {(team.tagline || meta.tagline) && <p className="text-sm italic mb-2">{team.tagline || meta.tagline}</p>}
                                <p className="text-sm">Total Matches: {team.totalMatches}</p>
                                <p className="text-sm">Total Wins: {team.totalWins}</p>
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default TeamList;