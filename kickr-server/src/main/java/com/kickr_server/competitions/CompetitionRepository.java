package com.kickr_server.competitions;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CompetitionRepository extends JpaRepository<Competition, UUID> {
    Optional<Competition> findByName(String name);
    Optional<Competition> findByExternalId(Integer externalId);
}
