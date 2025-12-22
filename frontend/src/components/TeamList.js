import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import teamMeta from '../data/teamMeta.json';
import { API_BASE_URL } from '../config';
import TeamCard from './TeamCard';

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
                // Using centralized config for backend URL
                const response = await axios.get(`${API_BASE_URL}/api/v1/team`);
                setTeams(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load teams:", err);
                setError("Failed to load teams for selection. Please check your backend service URL.");
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
                    const primaryColor = team.primaryColor || meta.primaryColor;
                    const secondaryColor = team.secondaryColor || meta.secondaryColor;
                    const logo = encodeURI((team.logo || meta.logo) || '/logos/Csk.jpg');
                    const cardTeam = {
                        name: team.teamName,
                        shortName: meta.shortName,
                        captain: team.captain || meta.captain,
                        coach: team.coach || meta.coach,
                        wins: team.totalWins,
                        losses: team.totalMatches != null && team.totalWins != null ? Math.max(team.totalMatches - team.totalWins, 0) : undefined,
                        logo,
                        primaryColor,
                        secondaryColor,
                    };
                    return (
                        <Link key={team.teamName} to={`/teams/${team.teamName}`} className="block">
                            <TeamCard team={cardTeam} />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default TeamList;