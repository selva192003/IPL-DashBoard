package com.ipl.ipl_dashboard.data;

import lombok.Data; // Ensure lombok.Data is imported

@Data // This annotation generates getters and setters
public class MatchInput {
    private String id;
    private String season;
    private String city;
    private String date;
    private String match_type; // Keep original name to match CSV header
    private String player_of_match; // Keep original name to match CSV header
    private String venue;
    private String team1;
    private String team2;
    private String toss_winner; // Keep original name to match CSV header
    private String toss_decision; // Keep original name to match CSV header
    private String winner; // Keep original name to match CSV header
    private String result;
    private String result_margin; // Keep original name to match CSV header
    private String target_runs; // Keep original name to match CSV header
    private String target_overs; // Keep original name to match CSV header
    private String super_over; // Keep original name to match CSV header
    private String method;
    private String umpire1;
    private String umpire2;
}
