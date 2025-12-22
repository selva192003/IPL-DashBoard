package com.ipl.ipl_dashboard.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Player {

    @Id
    private String name; // Player's name as the ID

    private long totalPlayerOfMatchAwards; // Count of Player of the Match awards
}
