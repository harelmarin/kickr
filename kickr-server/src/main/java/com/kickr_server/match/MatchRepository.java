package com.kickr_server.match;

import com.kickr_server.competitions.Competition;
import com.kickr_server.team.Team;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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
                        Competition competition);

        Page<Match> findByMatchDateAfterOrderByMatchDateAsc(LocalDateTime dateTime, Pageable pageable);

        Optional<Match> findByExternalFixtureId(Integer externalFixtureId);

        // Tous les matchs d'une équipe (à domicile ou à l'extérieur) triés par date
        List<Match> findByHomeTeamOrAwayTeamOrderByMatchDateDesc(
                        Team homeTeam,
                        Team awayTeam);

        @Query("SELECT m FROM Match m " +
                        "LEFT JOIN UserMatch um ON um.match = m " +
                        "WHERE (:competitionId IS NULL OR m.competition.id = :competitionId) " +
                        "AND (:isFinished IS NULL OR (:isFinished = true AND m.homeScore IS NOT NULL) OR (:isFinished = false AND m.homeScore IS NULL)) "
                        +
                        "AND (:query IS NULL OR :query = '' OR LOWER(CAST(m.homeTeam.name AS string)) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(CAST(m.awayTeam.name AS string)) LIKE LOWER(CONCAT('%', :query, '%'))) "
                        +
                        "GROUP BY m.id " +
                        "ORDER BY " +
                        "CASE WHEN :sort = 'popularity' THEN COUNT(um.id) END DESC, " +
                        "CASE WHEN :sort = 'rating' THEN COALESCE(AVG(um.note), 0) END DESC, " +
                        "CASE WHEN :sort = 'date' AND :isFinished = false THEN m.matchDate END ASC, " +
                        "CASE WHEN (:sort = 'date' AND (:isFinished = true OR :isFinished IS NULL)) OR (:sort <> 'date') THEN m.matchDate END DESC")
        Page<Match> findMatchesWithFilters(
                        @org.springframework.data.repository.query.Param("competitionId") UUID competitionId,
                        @org.springframework.data.repository.query.Param("isFinished") Boolean isFinished,
                        @org.springframework.data.repository.query.Param("query") String query,
                        @org.springframework.data.repository.query.Param("sort") String sort,
                        Pageable pageable);
}
