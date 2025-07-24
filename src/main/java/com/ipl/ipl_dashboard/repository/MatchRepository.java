package com.ipl.ipl_dashboard.repository;

import com.ipl.ipl_dashboard.model.Match;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchRepository extends JpaRepository<Match, Long> {

    // Get all matches where a given team played (either as team1 or team2), sorted by date
    Page<Match> findByTeam1OrTeam2OrderByDateDesc(String team1, String team2, Pageable pageable);
}
