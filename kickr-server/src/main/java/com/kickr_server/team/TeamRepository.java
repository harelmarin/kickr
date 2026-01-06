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
    List<Team> findByCompetitionId(UUID competitionId);
    
    // Pagination avec recherche
    Page<Team> findByNameContainingIgnoreCase(String name, Pageable pageable);
    
    // Pagination sans recherche
    Page<Team> findAllByOrderByNameAsc(Pageable pageable);
}
