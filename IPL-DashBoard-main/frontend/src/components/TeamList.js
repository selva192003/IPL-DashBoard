// src/components/TeamList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import TeamCard from "./TeamCard"; // Assuming TeamCard is a default export

const TeamList = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    console.log('Resolved API Root URL:', process.env.REACT_APP_API_ROOT_URL);
    axios.get(`${process.env.REACT_APP_API_ROOT_URL}/team`) // Corrected: Use environment variable
      .then((response) => setTeams(response.data))
      .catch((error) => {
        console.error("Error fetching teams:", error);
      });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">IPL Teams</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {teams.map((team) => (
          // <<<--- CORRECTED: Pass the entire 'team' object as 'team' prop
          <TeamCard key={team.teamName} team={team} />
        ))}
      </div>
    </div>
  );
};

export default TeamList;