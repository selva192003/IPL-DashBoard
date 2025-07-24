package com.ipl.ipl_dashboard.data;

import com.ipl.ipl_dashboard.model.Match;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class MatchProcessor {

    public static Match process(MatchInput input) {
        Match match = new Match();

        // Date format in your CSV is like: 18-04-2008
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

        match.setCity(input.getCity());
        match.setDate(LocalDate.parse(input.getDate(), formatter));
        match.setPlayerOfMatch(input.getPlayer_of_match());
        match.setVenue(input.getVenue());
        match.setTeam1(input.getTeam1());
        match.setTeam2(input.getTeam2());
        match.setTossWinner(input.getToss_winner());
        match.setTossDecision(input.getToss_decision());
        match.setMatchWinner(input.getWinner());
        match.setResult(input.getResult());
        match.setResultMargin(input.getResult_margin());
        match.setUmpire1(input.getUmpire1());
        match.setUmpire2(input.getUmpire2());
        match.setSeason(input.getSeason());
match.setMatchType(input.getMatch_type());
match.setTargetRuns(input.getTarget_runs());
match.setTargetOvers(input.getTarget_overs());
match.setSuperOver(input.getSuper_over());
match.setMethod(input.getMethod());


        return match;
    }
}
