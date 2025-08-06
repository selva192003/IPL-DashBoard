// src/components/TeamList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import TeamCard from "./TeamCard"; // Corrected: Ensure this import path is correct

const TeamList = () => {
  const [allTeams, setAllTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    console.log('Frontend API URL being used:', `${process.env.REACT_APP_API_ROOT_URL}/team`);
    axios.get(`${process.env.REACT_APP_API_ROOT_URL}/team`)
      .then((response) => {
        setAllTeams(response.data);
        setFilteredTeams(response.data);
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
      });
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTeams(allTeams);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const results = allTeams.filter(team =>
        team.teamName.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredTeams(results);
    }
  }, [searchQuery, allTeams]);

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4 text-center">IPL Teams</h2>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search teams by name..."
          className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 w-full max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredTeams.length > 0 ? (
          filteredTeams.map((team) => (
            <TeamCard key={team.teamName} team={team} />
          ))
        ) : (
          <p className="text-center w-full col-span-full">No teams found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default TeamList;
