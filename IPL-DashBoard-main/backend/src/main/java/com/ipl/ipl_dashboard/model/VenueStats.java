package com.ipl.ipl_dashboard.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VenueStats {

    private long totalMatches;
    private long totalWins;
    private double winPercentage;
}