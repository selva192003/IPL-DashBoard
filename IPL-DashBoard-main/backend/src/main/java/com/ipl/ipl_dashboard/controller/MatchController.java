package com.ipl.ipl_dashboard.controller;

import com.ipl.ipl_dashboard.model.Match;
import com.ipl.ipl_dashboard.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/match")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "https://ipl-dashboard-frontend.vercel.app", "https://ipl-dash-board-tau.vercel.app", "https://*.vercel.app"}, allowedHeaders = "*")
public class MatchController {

    private final MatchRepository matchRepo;

    @GetMapping("/{id}")
    public Match getMatchById(@PathVariable Long id) {
        return matchRepo.findById(id).orElse(null);
    }
}
