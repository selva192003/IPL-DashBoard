package com.ipl.ipl_dashboard.controller;

import com.ipl.ipl_dashboard.model.Match;
import com.ipl.ipl_dashboard.model.Team;
import com.ipl.ipl_dashboard.repository.MatchRepository;
import com.ipl.ipl_dashboard.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/team")
public class TeamController {

    private final TeamRepository teamRepo;
    private final MatchRepository matchRepo;

    // Get all teams
    @GetMapping
    public List<Team> getAllTeams() {
        return teamRepo.findAll();
    }

    // Get team details + all matches (or filtered by season)
    @GetMapping("/{teamName}")
    public Team getTeam(
            @PathVariable String teamName,
            @RequestParam(required = false) String season) {
        Team team = teamRepo.findById(teamName).orElse(null);

        if (team != null) {
            List<Match> matches;
            if (season != null && !season.isBlank()) {
                matches = matchRepo.findBySeasonAndTeam1OrSeasonAndTeam2OrderByDateDesc(
                        season, teamName, season, teamName);
            } else {
                matches = matchRepo.findByTeam1OrTeam2OrderByDateDesc(teamName, teamName);
            }
            team.setMatches(matches); // Corrected setter name
        }
        return team;
    }

    // Get head-to-head matches and stats between two teams
    @GetMapping("/head-to-head")
    public Map<String, Object> getHeadToHead(
            @RequestParam String team1Name,
            @RequestParam String team2Name) {

        List<Match> headToHeadMatches = matchRepo.findByTeam1AndTeam2OrTeam2AndTeam1OrderByDateDesc(
                team1Name, team2Name, team1Name, team2Name);

        long team1Wins = headToHeadMatches.stream()
                .filter(match -> match.getMatchWinner() != null && match.getMatchWinner().equals(team1Name)) // Corrected getter
                .count();

        long team2Wins = headToHeadMatches.stream()
                .filter(match -> match.getMatchWinner() != null && match.getMatchWinner().equals(team2Name)) // Corrected getter
                .count();

        Map<String, Object> result = new HashMap<>();
        result.put("team1Name", team1Name);
        result.put("team2Name", team2Name);
        result.put("totalMatches", headToHeadMatches.size());
        result.put("team1Wins", team1Wins);
        result.put("team2Wins", team2Wins);
        result.put("matches", headToHeadMatches);

        return result;
    }
}
