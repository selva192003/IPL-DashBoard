package com.ipl.ipl_dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IconicMatchDto {
    private String season;
    private String team1;
    private String team2;
    private String venue;
    private String date; // formatted for UI
    private String matchWinner;
    private String resultMargin;
    private String result; // runs/wickets
    private String significance; // why it is iconic

    // Stage/result signals for richer UI
    private String matchType;   // e.g., Final, Qualifier, Eliminator, League
    private String method;      // e.g., DLS, Super Over
    private String superOver;   // yes/no

    // Optional scoreboard-esque fields (may be null if data not available)
    private String team1_score;
    private String team1_wickets;
    private String team1_overs;
    private String team1_extra;
    private String team1_top_batsman;
    private String team1_top_batsman_runs;

    private String team2_score;
    private String team2_wickets;
    private String team2_overs;
    private String team2_extra;
    private String team2_top_batsman;
    private String team2_top_batsman_runs;

    private String highest_partnership;
    private String wicket_taker;
}
