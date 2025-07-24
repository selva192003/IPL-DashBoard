import React from "react";
import "./MatchCard.css";

const MatchCard = ({ match, teamName }) => {
  const isWin = match.matchWinner === teamName;

  return (
    <div className={`match-card ${isWin ? "win" : "loss"}`}>
      <p><strong>{match.date}</strong> — {match.team1} vs {match.team2}</p>
      <p>Winner: <strong>{match.matchWinner}</strong></p>
      <p>Result: {match.result} by {match.resultMargin}</p>
    </div>
  );
};

export default MatchCard;
