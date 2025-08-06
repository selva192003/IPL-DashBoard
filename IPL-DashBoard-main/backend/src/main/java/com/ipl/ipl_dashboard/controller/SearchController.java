package com.ipl.ipl_dashboard.controller;

import com.ipl.ipl_dashboard.model.Player;
import com.ipl.ipl_dashboard.model.Team;
import com.ipl.ipl_dashboard.repository.PlayerRepository;
import com.ipl.ipl_dashboard.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/search")
public class SearchController {

    private final TeamRepository teamRepo;
    private final PlayerRepository playerRepo;

    // Helper method to map common aliases to full team names
    private String getFullTeamNameFromAlias(String alias) {
        return switch (alias.toLowerCase()) {
            case "mi" -> "Mumbai Indians";
            case "csk" -> "Chennai Super Kings";
            case "rcb" -> "Royal Challengers Bangalore";
            case "kkr" -> "Kolkata Knight Riders";
            case "srh" -> "Sunrisers Hyderabad";
            case "rr" -> "Rajasthan Royals";
            case "pbks", "kxip" -> "Punjab Kings";
            case "dc", "dd" -> "Delhi Capitals";
            case "lsg" -> "Lucknow Super Giants";
            case "gt" -> "Gujarat Titans";
            case "dcg" -> "Deccan Chargers"; // Old team
            case "ktk" -> "Kochi Tuskers Kerala"; // Old team
            case "rps", "rpsg" -> "Rising Pune Supergiants"; // Old team
            case "gl" -> "Gujarat Lions"; // Old team
            default -> alias; // If no alias found, return original query
        };
    }

    @GetMapping
    public Map<String, List<?>> search(@RequestParam String query) {
        String lowerCaseQuery = query.toLowerCase();
        Map<String, List<?>> results = new HashMap<>();

        // 1. Check for exact team name match (case-insensitive)
        // Also check for aliases/abbreviations
        String fullTeamName = getFullTeamNameFromAlias(query);
        Optional<Team> exactTeamMatch = teamRepo.findAll().stream()
                .filter(team -> team.getTeamName().equalsIgnoreCase(fullTeamName))
                .findFirst();

        if (exactTeamMatch.isPresent()) {
            results.put("teams", Collections.singletonList(exactTeamMatch.get()));
            results.put("players", Collections.emptyList()); // No players if exact team match found
            return results;
        }

        // 2. If no exact team match (or alias), perform contains search for teams
        List<Team> matchingTeams = teamRepo.findAll().stream()
                .filter(team -> team.getTeamName().toLowerCase().contains(lowerCaseQuery))
                .collect(Collectors.toList());

        // 3. Perform contains search for players
        List<Player> matchingPlayers = playerRepo.findAll().stream()
                .filter(player -> player.getName().toLowerCase().contains(lowerCaseQuery))
                .collect(Collectors.toList());

        results.put("teams", matchingTeams);
        results.put("players", matchingPlayers);

        return results;
    }
}
