import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const MatchPage = () => {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);

  useEffect(() => {
    axios.get(`/match/${matchId}`)
      .then(res => setMatch(res.data))
      .catch(err => console.error("Error loading match", err));
  }, [matchId]);

  if (!match) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{match.team1} vs {match.team2}</h2>
      <p><strong>Date:</strong> {match.date}</p>
      <p><strong>Venue:</strong> {match.venue}</p>
      <p><strong>Toss Winner:</strong> {match.tossWinner} - {match.tossDecision}</p>
      <p><strong>Winner:</strong> {match.matchWinner}</p>
      <p><strong>Result:</strong> {match.result} by {match.resultMargin}</p>
      <p><strong>Player of Match:</strong> {match.playerOfMatch}</p>
      <p><strong>Umpires:</strong> {match.umpire1}, {match.umpire2}</p>
    </div>
  );
};

export default MatchPage;
