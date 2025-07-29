package com.ipl.ipl_dashboard.data;

import com.ipl.ipl_dashboard.model.Match;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class MatchProcessor {

    public static Match process(MatchInput input) {
        Match match = new Match();

        // Date format in your CSV is like: 18-04-2008
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

        // Setters for Match model (camelCase) using getters from MatchInput (snake_case)
        match.setCity(input.getCity());
        match.setDate(LocalDate.parse(input.getDate(), formatter));
        match.setPlayerOfMatch(input.getPlayer_of_match()); // Corrected: playerOfMatch
        match.setVenue(input.getVenue());
        match.setTeam1(input.getTeam1());
        match.setTeam2(input.getTeam2());
        match.setTossWinner(input.getToss_winner()); // Corrected: tossWinner
        match.setTossDecision(input.getToss_decision()); // Corrected: tossDecision
        match.setMatchWinner(input.getWinner()); // Corrected: matchWinner
        match.setResult(input.getResult());
        match.setResultMargin(input.getResult_margin()); // Corrected: resultMargin
        match.setUmpire1(input.getUmpire1());
        match.setUmpire2(input.getUmpire2());
        match.setSeason(input.getSeason());
        match.setMatchType(input.getMatch_type()); // Corrected: matchType
        match.setTargetRuns(input.getTarget_runs()); // Corrected: targetRuns
        match.setTargetOvers(input.getTarget_overs()); // Corrected: targetOvers
        match.setSuperOver(input.getSuper_over()); // Corrected: superOver
        match.setMethod(input.getMethod());

        return match;
    }
}
