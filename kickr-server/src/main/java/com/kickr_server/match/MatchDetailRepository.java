package com.kickr_server.match;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MatchDetailRepository extends JpaRepository<MatchDetail, UUID> {
    Optional<MatchDetail> findByMatchId(UUID matchId);
}
