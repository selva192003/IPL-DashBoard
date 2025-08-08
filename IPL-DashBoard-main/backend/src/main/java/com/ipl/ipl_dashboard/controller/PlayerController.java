    package com.ipl.ipl_dashboard.controller;

    import com.ipl.ipl_dashboard.model.Match;
    import com.ipl.ipl_dashboard.model.Player;
    import com.ipl.ipl_dashboard.repository.MatchRepository;
    import com.ipl.ipl_dashboard.repository.PlayerRepository;
    import lombok.RequiredArgsConstructor;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;

    @RestController
    @RequiredArgsConstructor
    @RequestMapping("/api/v1/players")
    public class PlayerController {

        private final PlayerRepository playerRepo;
        private final MatchRepository matchRepo;

        @GetMapping
        public List<Player> getAllPlayers() {
            return playerRepo.findAll();
        }

        @GetMapping("/{playerName}")
        public Player getPlayer(@PathVariable String playerName) {
            return playerRepo.findById(playerName).orElse(null);
        }

        @GetMapping("/{playerName}/player-of-match-awards")
        public List<Match> getPlayerOfMatchAwards(@PathVariable String playerName) {
            return matchRepo.findByPlayerOfMatchOrderByDateDesc(playerName);
        }

        // NEW: Endpoint to get the Player of the Match leaderboard
        @GetMapping("/leaderboard")
        public List<Player> getLeaderboard() {
            return playerRepo.findAllByOrderByTotalPlayerOfMatchAwardsDesc();
        }
    }
    