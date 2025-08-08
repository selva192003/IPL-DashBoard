    package com.ipl.ipl_dashboard.repository;

    import com.ipl.ipl_dashboard.model.Player;
    import org.springframework.data.jpa.repository.JpaRepository;

    import java.util.List;

    public interface PlayerRepository extends JpaRepository<Player, String> {
        // Find all players and order them by totalPlayerOfMatchAwards in descending order
        List<Player> findAllByOrderByTotalPlayerOfMatchAwardsDesc();
    }
    