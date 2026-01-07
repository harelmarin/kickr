package com.kickr_server.usermatch;

import com.kickr_server.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface ReviewLikeRepository extends JpaRepository<ReviewLike, UUID> {
    boolean existsByUserAndUserMatch(User user, UserMatch userMatch);

    Optional<ReviewLike> findByUserAndUserMatch(User user, UserMatch userMatch);

    long countByUserMatchId(UUID userMatchId);
}
