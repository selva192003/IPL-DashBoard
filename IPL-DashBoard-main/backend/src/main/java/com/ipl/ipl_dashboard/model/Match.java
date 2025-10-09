package com.ipl.ipl_dashboard.model;

import jakarta.persistence.*;
import lombok.*; // Ensure all lombok annotations are imported

@Entity
@Data // This annotation generates getters, setters, equals, hashCode, and toString
@NoArgsConstructor // Generates a constructor with no arguments
@AllArgsConstructor // Generates a constructor with all arguments
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String city;
    private java.time.LocalDate date; // Use java.time.LocalDate
    private String playerOfMatch; // Corrected field name (camelCase)
    private String venue;
    private String team1;
    private String team2;
    private String tossWinner;
    private String tossDecision;
    private String matchWinner; // Corrected field name (camelCase)
    private String result;
    private String resultMargin; // Corrected field name (camelCase)
    private String umpire1;
    private String umpire2;
    private String season;
    private String matchType; // Corrected field name (camelCase)
    private String targetRuns; // Corrected field name (camelCase)
    private String targetOvers; // Corrected field name (camelCase)
    private String superOver; // Corrected field name (camelCase)
    private String method;

}
