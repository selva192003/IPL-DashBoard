import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const TeamPage = () => {
  const { teamName } = useParams();
  const [team, setTeam] = useState(null);

  useEffect(() => {
    axios.get(`/team/${teamName}`)
      .then(res => setTeam(res.data))
      .catch(err => console.error("Error loading team data", err));
  }, [teamName]);

  if (!team) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{team.teamName}</h2>
      <p><strong>Total Matches:</strong> {team.totalMatches}</p>
      <p><strong>Total Wins:</strong> {team.totalWins}</p>

      <h3>Recent Matches</h3>
      <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
        {team.matches?.slice(0, 4).map((match) => (
          <li key={match.id} style={{ margin: "10px 0" }}>
            <Link to={`/match/${match.id}`} style={{ textDecoration: "none", color: "blue" }}>
              {match.date} - {match.team1} vs {match.team2} - Winner: {match.matchWinner}
            </Link>
            <br />
            {
              match.umpire1 && match.umpire2 &&
              isNaN(match.umpire1) && isNaN(match.umpire2) && (
                <small>Umpires: {match.umpire1}, {match.umpire2}</small>
              )
            }
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamPage;
