package com.ipl.ipl_dashboard.repository;

import com.ipl.ipl_dashboard.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlayerRepository extends JpaRepository<Player, String> {
    // Spring Data JPA will automatically provide basic CRUD operations
}
