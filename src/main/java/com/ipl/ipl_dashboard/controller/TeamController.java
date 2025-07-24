package com.ipl.ipl_dashboard.controller;

import com.ipl.ipl_dashboard.model.Match;
import com.ipl.ipl_dashboard.model.Team;
import com.ipl.ipl_dashboard.repository.MatchRepository;
import com.ipl.ipl_dashboard.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/team")
public class TeamController {

    private final TeamRepository teamRepo;
    private final MatchRepository matchRepo;

    // ✅ Get all teams
    @GetMapping
    public List<Team> getAllTeams() {
        return teamRepo.findAll();
    }

    // ✅ Get team details + latest 4 matches
    @GetMapping("/{teamName}")
    public Team getTeam(@PathVariable String teamName) {
        Team team = teamRepo.findById(teamName).orElse(null);
        if (team != null) {
            team.setMatches(matchRepo.findByTeam1OrTeam2OrderByDateDesc(
                    teamName, teamName, PageRequest.of(0, 4)
            ).getContent());
        }
        return team;
    }
}
