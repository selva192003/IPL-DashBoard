package com.ipl.ipl_dashboard.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Team {

    @Id
    private String teamName;

    private long totalMatches;
    private long totalWins;

    // Theme properties for frontend customization
    private String primaryColor;
    private String secondaryColor;
    private String tagline;

    @Transient
    private List<Match> matches;

    public Team(String teamName, long totalMatches, long totalWins, List<Match> matches,
                String primaryColor, String secondaryColor, String tagline) {
        this.teamName = teamName;
        this.totalMatches = totalMatches;
        this.totalWins = totalWins;
        this.matches = matches;
        this.primaryColor = primaryColor;
        this.secondaryColor = secondaryColor;
        this.tagline = tagline;
    }
}
