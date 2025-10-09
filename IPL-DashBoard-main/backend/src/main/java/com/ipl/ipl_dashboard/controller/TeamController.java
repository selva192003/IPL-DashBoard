package com.ipl.ipl_dashboard.controller;

import com.ipl.ipl_dashboard.model.Match;
import com.ipl.ipl_dashboard.model.Team;
import com.ipl.ipl_dashboard.repository.MatchRepository;
import com.ipl.ipl_dashboard.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/team")
public class TeamController {

    private final TeamRepository teamRepo;
    private final MatchRepository matchRepo;

    // Helper method to apply all optional filters to a list of matches
    private List<Match> filterMatches(List<Match> matches, String season, String venue, String matchType) {
        return matches.stream()
                .filter(match -> season == null || match.getSeason().equals(season))
                .filter(match -> venue == null || match.getVenue().equals(venue))
                .filter(match -> matchType == null || match.getMatchType().equalsIgnoreCase(matchType))
                .collect(Collectors.toList());
    }

    // New endpoint to get filtered aggregated stats for all teams (for TeamList.js)
    @GetMapping("/stats")
    public List<Team> getAllTeamsWithFilters(
            @RequestParam(required = false) String venue,
            @RequestParam(required = false) String matchType) {

        List<Match> allMatches = matchRepo.findAll();
        
        // Apply optional filtering
        List<Match> filteredMatches = filterMatches(allMatches, null, venue, matchType);

        Map<String, Team> teamMap = new HashMap<>();
        List<Team> allExistingTeams = teamRepo.findAll();

        // Initialize map with all existing teams (to ensure all teams are returned)
        for (Team existingTeam : allExistingTeams) {
            teamMap.put(existingTeam.getTeamName(), new Team(existingTeam.getTeamName(), 0, 0));
        }

        // Aggregate stats based on filtered matches
        for (Match match : filteredMatches) {
            
            // Handle Team 1
            if (match.getTeam1() != null && teamMap.containsKey(match.getTeam1())) {
                Team team1 = teamMap.get(match.getTeam1());
                team1.setTotalMatches(team1.getTotalMatches() + 1);
                if (match.getMatchWinner() != null && match.getMatchWinner().equals(match.getTeam1())) {
                    team1.setTotalWins(team1.getTotalWins() + 1);
                }
            }

            // Handle Team 2
            if (match.getTeam2() != null && teamMap.containsKey(match.getTeam2())) {
                Team team2 = teamMap.get(match.getTeam2());
                team2.setTotalMatches(team2.getTotalMatches() + 1);
                if (match.getMatchWinner() != null && match.getMatchWinner().equals(match.getTeam2())) {
                    team2.setTotalWins(team2.getTotalWins() + 1);
                }
            }
        }
        
        return new ArrayList<>(teamMap.values());
    }
    
    // Original endpoint (remains for compatibility, but updated to call new endpoint for unfiltered list)
    @GetMapping
    public List<Team> getAllTeams() {
        // Now serves as a simple alias for the unfiltered version of the /stats endpoint
        return getAllTeamsWithFilters(null, null);
    }

    // Updated endpoint to get team details + filtered matches (for TeamPage.js)
    @GetMapping("/{teamName}")
    public Team getTeam(
            @PathVariable String teamName,
            @RequestParam(required = false) String season,
            @RequestParam(required = false) String venue,      // New filter parameter
            @RequestParam(required = false) String matchType) { // New filter parameter
        
        Team team = teamRepo.findById(teamName).orElse(null);

        if (team != null) {
            // Fetch all matches for the team using repository method
            List<Match> matches = matchRepo.findByTeam1OrTeam2OrderByDateDesc(teamName, teamName);
            
            // Apply all optional filtering in the controller
            List<Match> filteredMatches = filterMatches(matches, season, venue, matchType);

            team.setMatches(filteredMatches);
            
            // Update aggregated stats based on the filtered list for display on TeamPage
            team.setTotalMatches(filteredMatches.size());
            team.setTotalWins(filteredMatches.stream()
                    .filter(match -> teamName.equals(match.getMatchWinner()))
                    .count());
            
        }
        return team;
    }

    // Get head-to-head matches and stats between two teams (remains unchanged)
    @GetMapping("/head-to-head")
    public Map<String, Object> getHeadToHead(
            @RequestParam String team1Name,
            @RequestParam String team2Name) {

        List<Match> headToHeadMatches = matchRepo.findByTeam1AndTeam2OrTeam2AndTeam1OrderByDateDesc(
                team1Name, team2Name, team1Name, team2Name);

        long team1Wins = headToHeadMatches.stream()
                .filter(match -> match.getMatchWinner() != null && match.getMatchWinner().equals(team1Name))
                .count();

        long team2Wins = headToHeadMatches.stream()
                .filter(match -> match.getMatchWinner() != null && match.getMatchWinner().equals(team2Name))
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

    // Removed getTeamVenueStats method as requested by the user.
}