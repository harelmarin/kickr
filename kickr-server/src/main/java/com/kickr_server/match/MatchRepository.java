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

        List<Match> findByMatchDateBetween(LocalDateTime start, LocalDateTime end);

        Optional<Match> findByExternalFixtureId(Integer externalFixtureId);

        // Tous les matchs d'une équipe (à domicile ou à l'extérieur) triés par date
        List<Match> findByHomeTeamOrAwayTeamOrderByMatchDateDesc(
                        Team homeTeam,
                        Team awayTeam);

        @Query(value = "SELECT m FROM Match m " +
                        "LEFT JOIN UserMatch um ON um.match = m " +
                        "WHERE (:competitionId IS NULL OR m.competition.id = :competitionId) " +
                        "AND (:round IS NULL OR m.round = :round) " +
                        "AND (:isFinished IS NULL OR (:isFinished = true AND m.homeScore IS NOT NULL) OR (:isFinished = false AND m.homeScore IS NULL)) "
                        +
                        "AND (:query IS NULL OR :query = '' OR LOWER(CAST(m.homeTeam.name AS string)) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(CAST(m.awayTeam.name AS string)) LIKE LOWER(CONCAT('%', :query, '%'))) "
                        +
                        "GROUP BY m.id " +
                        "ORDER BY " +
                        "(CASE WHEN :sort = 'popularity' THEN COUNT(um.id) ELSE 0 END) DESC, " +
                        "(CASE WHEN :sort = 'rating' THEN COALESCE(AVG(um.note), 0) ELSE 0 END) DESC, " +
                        "(CASE WHEN :sort = 'date_asc' THEN m.matchDate END) ASC, " +
                        "(CASE WHEN :sort = 'date_desc' THEN m.matchDate END) DESC, " +
                        "m.matchDate ASC", countQuery = "SELECT COUNT(DISTINCT m) FROM Match m " +
                                        "WHERE (:competitionId IS NULL OR m.competition.id = :competitionId) " +
                                        "AND (:round IS NULL OR m.round = :round) " +
                                        "AND (:isFinished IS NULL OR (:isFinished = true AND m.homeScore IS NOT NULL) OR (:isFinished = false AND m.homeScore IS NULL)) "
                                        +
                                        "AND (:query IS NULL OR :query = '' OR LOWER(CAST(m.homeTeam.name AS string)) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(CAST(m.awayTeam.name AS string)) LIKE LOWER(CONCAT('%', :query, '%')))")
        Page<Match> findMatchesWithFilters(
                        @org.springframework.data.repository.query.Param("competitionId") UUID competitionId,
                        @org.springframework.data.repository.query.Param("isFinished") Boolean isFinished,
                        @org.springframework.data.repository.query.Param("query") String query,
                        @org.springframework.data.repository.query.Param("round") String round,
                        @org.springframework.data.repository.query.Param("sort") String sort,
                        Pageable pageable);

        @Query("SELECT m FROM Match m " +
                        "LEFT JOIN m.matchDetail md " +
                        "WHERE (md IS NULL OR md.lineups IS NULL) " +
                        "AND ((m.homeScore IS NOT NULL AND m.awayScore IS NOT NULL) " +
                        "     OR (m.matchDate < :nearStartTime)) " +
                        "ORDER BY m.matchDate DESC")
        List<Match> findMatchesNeedingDetailEnrichment(
                        @org.springframework.data.repository.query.Param("nearStartTime") LocalDateTime nearStartTime,
                        Pageable pageable);

        @Query("SELECT DISTINCT m.round FROM Match m WHERE m.competition.id = :competitionId AND m.round IS NOT NULL ORDER BY m.round ASC")
        List<String> findDistinctRoundsByCompetitionId(
                        @org.springframework.data.repository.query.Param("competitionId") UUID competitionId);
}
