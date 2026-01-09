package com.kickr_server.team;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TeamRepository extends JpaRepository<Team, UUID> {
    Optional<Team> findByName(String name);

    Optional<Team> findByExternalId(Integer externalId);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT t FROM Team t " +
            "WHERE t.competition.id = :competitionId " +
            "OR t.id IN (SELECT m.homeTeam.id FROM Match m WHERE m.competition.id = :competitionId) " +
            "OR t.id IN (SELECT m.awayTeam.id FROM Match m WHERE m.competition.id = :competitionId) " +
            "ORDER BY t.name ASC")
    Page<Team> findTeamsByCompetitionId(UUID competitionId, Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT t FROM Team t " +
            "WHERE t.competition.id = :competitionId " +
            "OR t.id IN (SELECT m.homeTeam.id FROM Match m WHERE m.competition.id = :competitionId) " +
            "OR t.id IN (SELECT m.awayTeam.id FROM Match m WHERE m.competition.id = :competitionId) " +
            "ORDER BY t.name ASC")
    List<Team> findTeamsByCompetitionId(UUID competitionId);

    // Pagination avec recherche
    Page<Team> findByNameContainingIgnoreCase(String name, Pageable pageable);

    // Pagination sans recherche
    Page<Team> findAllByOrderByNameAsc(Pageable pageable);

    // Search without pagination
    List<Team> findByNameContainingIgnoreCase(String query);
}
