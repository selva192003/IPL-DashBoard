package com.ipl.ipl_dashboard.repository;

import com.ipl.ipl_dashboard.model.Match;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatchRepository extends JpaRepository<Match, Long> {

    // Get all matches where a given team played (either as team1 or team2), sorted by date
    Page<Match> findByTeam1OrTeam2OrderByDateDesc(String team1, String team2, Pageable pageable);

    // Get all matches for a team
    List<Match> findByTeam1OrTeam2OrderByDateDesc(String team1, String team2);

    // Get matches for a team filtered by season
    List<Match> findBySeasonAndTeam1OrSeasonAndTeam2OrderByDateDesc(String season1, String team1, String season2, String team2);

    // Get all matches where a specific player was Player of the Match
    List<Match> findByPlayerOfMatchOrderByDateDesc(String playerOfMatch);

    // Find matches between two specific teams (for Head-to-Head)
    List<Match> findByTeam1AndTeam2OrTeam2AndTeam1OrderByDateDesc(String team1, String team2, String team2Alt, String team1Alt);

    // Find all matches for a given team and venue
    List<Match> findByVenueAndTeam1OrVenueAndTeam2(String venue, String team1, String venue2, String team2);
}