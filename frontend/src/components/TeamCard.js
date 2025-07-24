import React from "react";
import { Link } from "react-router-dom";

const teamLogos = {
  "Chennai Super Kings": "/logos/csk.png",
  "Mumbai Indians": "/logos/mi.png",
  "Royal Challengers Bangalore": "/logos/rcb.png",
  // Add more teams here
};

const TeamCard = ({ team }) => {
  const { teamName, totalMatches, totalWins } = team;
  const logo = teamLogos[teamName] || "/logos/default.png"; // fallback image

  const winRate = (totalWins / totalMatches) * 100;

  return (
    <Link to={`/team/${teamName}`} className="block">
      <div
        className={`rounded-2xl shadow-lg p-4 m-3 transition-transform hover:scale-105 
        ${winRate >= 50 ? "bg-green-100" : "bg-red-100"}`}
      >
        <div className="flex items-center gap-4">
          <img src={logo} alt={teamName} className="w-16 h-16 object-contain" />
          <div>
            <h2 className="text-xl font-bold text-gray-800">{teamName}</h2>
            <p className="text-sm text-gray-600">Matches: {totalMatches}</p>
            <p className="text-sm text-gray-600">Wins: {totalWins}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TeamCard;
