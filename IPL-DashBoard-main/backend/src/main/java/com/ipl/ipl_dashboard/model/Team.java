package com.ipl.ipl_dashboard.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Entity
@Data
@NoArgsConstructor
public class Team {

    @Id
    private String teamName;
    private long totalMatches;
    private long totalWins;

    @Transient
    private List<Match> matches;

    @Transient
    private Map<String, VenueStats> venueStats;

    // Custom constructor for DataLoader
    public Team(String teamName, long totalMatches, long totalWins) {
        this.teamName = teamName;
        this.totalMatches = totalMatches;
        this.totalWins = totalWins;
    }
}