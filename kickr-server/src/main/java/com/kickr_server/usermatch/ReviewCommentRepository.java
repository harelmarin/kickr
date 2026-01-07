package com.kickr_server.usermatch;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReviewCommentRepository extends JpaRepository<ReviewComment, UUID> {
    List<ReviewComment> findByUserMatchIdOrderByCreatedAtAsc(UUID userMatchId);

    long countByUserMatchId(UUID userMatchId);
}
