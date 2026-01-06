package com.kickr_server.usermatch;

import com.kickr_server.user.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserMatchRepository extends JpaRepository<UserMatch, UUID> {
    List<UserMatch> findByUserId(UUID userId);

    List<UserMatch> findByMatchId(UUID matchId);

    UserMatch findByUserIdAndMatchId(UUID userId, UUID matchId);

    List<UserMatch> findByUserIn(List<User> users);

    UserMatch findTopByUserOrderByWatchedAtDesc(User user);

    @Query("SELECT um FROM UserMatch um WHERE um.user IN :followedUsers ORDER BY um.watchedAt DESC")
    List<UserMatch> findLatestMatchesOfUsers(@Param("followedUsers") List<User> followedUsers, Pageable pageable);

    @Query("SELECT um.match.id, AVG(um.note), COUNT(um) FROM UserMatch um WHERE um.match.id IN :matchIds GROUP BY um.match.id")
    List<Object[]> findStatsByMatchIds(@Param("matchIds") List<UUID> matchIds);
}
