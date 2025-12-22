package com.ipl.ipl_dashboard.controller;

import com.ipl.ipl_dashboard.model.Match;
import com.ipl.ipl_dashboard.model.Player;
import com.ipl.ipl_dashboard.repository.MatchRepository;
import com.ipl.ipl_dashboard.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/players") // Base path for player endpoints
@CrossOrigin(origins = "*")
public class PlayerController {

    private final PlayerRepository playerRepo;
    private final MatchRepository matchRepo; // To fetch matches where player was Player of Match

    // Get all players with their Player of Match awards
    @GetMapping
    public List<Player> getAllPlayers() {
        return playerRepo.findAll();
    }

    // Get a specific player's details (e.g., total Player of Match awards)
    @GetMapping("/{playerName}")
    public Player getPlayer(@PathVariable String playerName) {
        return playerRepo.findById(playerName).orElse(null);
    }

    // Get all matches where a specific player was Player of the Match
    @GetMapping("/{playerName}/player-of-match-awards")
    public List<Match> getPlayerOfMatchAwards(@PathVariable String playerName) {
        // Assuming 'playerOfMatch' field in Match model directly stores the player's name
        return matchRepo.findByPlayerOfMatchOrderByDateDesc(playerName);
    }
}
