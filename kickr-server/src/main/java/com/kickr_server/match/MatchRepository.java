package com.kickr_server.match;

import com.kickr_server.team.Team;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;
import java.util.List;
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
    Page<Match> findByMatchDateAfterOrderByMatchDateAsc(LocalDateTime dateTime, Pageable pageable);
    Optional<Match> findByExternalFixtureId(Integer externalFixtureId);

}
