package com.kickr_server.match;

import com.kickr_server.team.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MatchRepository extends JpaRepository<Match, UUID> {
    Optional<Match> findByHomeTeamAndAwayTeamAndMatchDateAndCompetition(
            Team homeTeam,
            Team awayTeam,
            LocalDateTime matchDate,
            String competition
    );
}
