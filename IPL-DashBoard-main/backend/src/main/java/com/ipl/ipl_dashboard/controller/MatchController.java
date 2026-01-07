package com.ipl.ipl_dashboard.controller;

import com.ipl.ipl_dashboard.model.Match;
import com.ipl.ipl_dashboard.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping({"/match", "/api/v1/match"})
@RequiredArgsConstructor
@CrossOrigin
public class MatchController {

    private final MatchRepository matchRepo;

    @GetMapping("/{id}")
    public Match getMatchById(@PathVariable Long id) {
        return matchRepo.findById(id).orElse(null);
    }
}
 
