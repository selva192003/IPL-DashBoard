import { React } from 'react';
import { Link } from 'react-router-dom'; // <<<--- ADDED: Import Link
import teamMeta from '../data/teamMeta.json';

// helper: find meta by teamName case-insensitive, trimmed
function normalizeKey(s){
    return s ? s.toString().trim().toLowerCase().replace(/[^a-z0-9]/g, '') : '';
}

function findMeta(teamName) {
    if (!teamName) return null;
    const key = normalizeKey(teamName);
    // exact match
    for (const k of Object.keys(teamMeta)) {
        if (normalizeKey(k) === key) return teamMeta[k];
    }
    // includes (handle 'pune warriors india' vs 'pune warriors')
    for (const k of Object.keys(teamMeta)) {
        const nk = normalizeKey(k);
        if (nk.includes(key) || key.includes(nk)) return teamMeta[k];
    }
    return null;
}

const TeamCard = ({ team }) => { // <<<--- CHANGED: Destructure 'team' prop
    const meta = findMeta(team.teamName) || {};
    const primary = team.primaryColor || meta.primaryColor || '#1f2937';
    const secondary = team.secondaryColor || meta.secondaryColor || '#374151';
    const logo = encodeURI((team.logo || meta.logo) || '/logos/Csk.jpg');
    return (
        // <<<--- WRAPPED with Link component
        <Link to={`/teams/${team.teamName}`} className="block">
            <div className="TeamCard p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 text-white" style={{background: `linear-gradient(90deg, ${primary}, ${secondary})`, position: 'relative', overflow: 'hidden', paddingLeft: 140}}>
                {/* logo overlapped - inside left */}
                <div style={{position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', opacity: 0.98}}>
                    <img src={logo} alt={`${team.teamName} logo`} style={{width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.35))'}} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{team.teamName}</h3>
                {(team.tagline || meta.tagline) && <p className="text-sm italic mb-2">{team.tagline || meta.tagline}</p>}
                <p>Matches: {team.totalMatches}</p>
                <p>Wins: {team.totalWins}</p>
            </div>
        </Link>
        // <<<--- END Link wrapper
    );
};

export default TeamCard;