package com.kickr_server.usermatch;

import com.kickr_server.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserMatchRepository extends JpaRepository<UserMatch, UUID> {
    List<UserMatch> findByUserId(UUID userId);
    List<UserMatch> findByMatchId(UUID matchId);
    UserMatch findByUserIdAndMatchId(UUID userId, UUID matchId);
    List<UserMatch> findByUserIn(List<User> users);
}
