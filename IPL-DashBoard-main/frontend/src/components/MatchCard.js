import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MatchCard = ({ match, teamName }) => {
    const [team1Logo, setTeam1Logo] = useState('');
    const [team2Logo, setTeam2Logo] = useState('');
    const [playerImage, setPlayerImage] = useState('');
    const [imageLoadErrors, setImageLoadErrors] = useState({
        team1: false,
        team2: false,
        player: false
    });

    const opponentTeam = match.team1 === teamName ? match.team2 : match.team1;
    const isMatchWinner = match.matchWinner === teamName;

    const matchResultClass = isMatchWinner ? 'bg-green-700 text-white' : 'bg-red-700 text-white';

    // Fetch team logos and player image on component mount
    useEffect(() => {
        const fetchImages = async () => {
            try {
                // Fetch Team 1 Logo
                try {
                    const team1Response = await fetch(`${process.env.REACT_APP_API_ROOT_URL.replace('/api/v1', '')}/api/images/team/${encodeURIComponent(match.team1)}`);
                    if (team1Response.ok) {
                        const team1Data = await team1Response.json();
                        if (team1Data && team1Data.imageUrl) {
                            setTeam1Logo(team1Data.imageUrl);
                        }
                    } else {
                        setImageLoadErrors(prev => ({ ...prev, team1: true }));
                    }
                } catch (err) {
                    console.error(`Error fetching ${match.team1} logo:`, err);
                    setImageLoadErrors(prev => ({ ...prev, team1: true }));
                }

                // Fetch Team 2 Logo
                try {
                    const team2Response = await fetch(`${process.env.REACT_APP_API_ROOT_URL.replace('/api/v1', '')}/api/images/team/${encodeURIComponent(match.team2)}`);
                    if (team2Response.ok) {
                        const team2Data = await team2Response.json();
                        if (team2Data && team2Data.imageUrl) {
                            setTeam2Logo(team2Data.imageUrl);
                        }
                    } else {
                        setImageLoadErrors(prev => ({ ...prev, team2: true }));
                    }
                } catch (err) {
                    console.error(`Error fetching ${match.team2} logo:`, err);
                    setImageLoadErrors(prev => ({ ...prev, team2: true }));
                }

                // Fetch Player of the Match Image
                if (match.playerOfMatch && match.playerOfMatch !== 'NA') {
                    try {
                        const playerResponse = await fetch(`${process.env.REACT_APP_API_ROOT_URL.replace('/api/v1', '')}/api/images/player/${encodeURIComponent(match.playerOfMatch)}`);
                        if (playerResponse.ok) {
                            const playerData = await playerResponse.json();
                            if (playerData && playerData.imageUrl) {
                                setPlayerImage(playerData.imageUrl);
                            }
                        } else {
                            setImageLoadErrors(prev => ({ ...prev, player: true }));
                        }
                    } catch (err) {
                        console.error(`Error fetching ${match.playerOfMatch} image:`, err);
                        setImageLoadErrors(prev => ({ ...prev, player: true }));
                    }
                }
            } catch (err) {
                console.error("Error fetching images:", err);
            }
        };

        fetchImages();
    }, [match]);

    return (
        <Link to={`/matches/${match.id}`} className="block">
            <div className={`card p-5 rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${matchResultClass}`}>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-light opacity-80">{match.season}</span>
                    <span className="text-sm font-light opacity-80">{match.date}</span>
                </div>
                <h3 className="text-2xl font-bold mb-2 flex items-center justify-center space-x-2">
                    {team1Logo && !imageLoadErrors.team1 ? (
                        <img 
                            src={team1Logo} 
                            alt={`${match.team1} logo`} 
                            className="w-8 h-8 rounded-full object-cover"
                            onError={() => setImageLoadErrors(prev => ({ ...prev, team1: true }))}
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold">
                            {match.team1.substring(0, 2).toUpperCase()}
                        </div>
                    )}
                    <span className="text-yellow-300">{match.team1}</span>
                    <span> vs </span>
                    {team2Logo && !imageLoadErrors.team2 ? (
                        <img 
                            src={team2Logo} 
                            alt={`${match.team2} logo`} 
                            className="w-8 h-8 rounded-full object-cover"
                            onError={() => setImageLoadErrors(prev => ({ ...prev, team2: true }))}
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold">
                            {match.team2.substring(0, 2).toUpperCase()}
                        </div>
                    )}
                    <span className="text-yellow-300">{match.team2}</span>
                </h3>
                <p className="text-md opacity-90 mb-3">{match.venue}</p>

                <div className="border-t border-gray-600 pt-3">
                    <p className="text-lg font-semibold">
                        Winner: <span className="text-yellow-300">{match.matchWinner}</span>
                    </p>
                    <p className="text-sm opacity-80">
                        Won by {match.resultMargin} {match.result}
                    </p>
                    {match.playerOfMatch && match.playerOfMatch !== 'NA' && (
                        <div className="mt-4 flex items-center justify-between bg-gray-900 p-3 rounded-lg">
                            <div className="flex items-center space-x-3">
                                {playerImage && !imageLoadErrors.player ? (
                                    <img 
                                        src={playerImage} 
                                        alt={match.playerOfMatch} 
                                        className="w-12 h-12 rounded-full border-2 border-yellow-400 object-cover"
                                        onError={() => setImageLoadErrors(prev => ({ ...prev, player: true }))}
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-yellow-400 border-2 border-yellow-400 flex items-center justify-center text-gray-900 font-bold text-sm">
                                        {match.playerOfMatch.split(' ').map(name => name[0]).join('').toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-semibold text-yellow-400">Player of the Match:</p>
                                    <Link to={`/players/${match.playerOfMatch}`} className="font-medium text-blue-300 hover:underline text-lg">
                                        {match.playerOfMatch}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default MatchCard;
