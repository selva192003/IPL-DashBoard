package com.ipl.ipl_dashboard.repository;

import com.ipl.ipl_dashboard.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamRepository extends JpaRepository<Team, String> {
}
