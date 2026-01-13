package com.kickr_server.usermatch;

import com.kickr_server.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserMatchRepository extends JpaRepository<UserMatch, UUID> {
    boolean existsByUserAndMatch(User user, com.kickr_server.match.Match match);

    List<UserMatch> findByUserId(UUID userId);

    Page<UserMatch> findByUserId(UUID userId, Pageable pageable);

    long countByUserId(UUID userId);

    List<UserMatch> findByMatchId(UUID matchId);

    List<UserMatch> findByMatchId(UUID matchId, Pageable pageable);

    List<UserMatch> findByUserIdAndMatchId(UUID userId, UUID matchId);

    List<UserMatch> findByUserIn(List<User> users);

    Page<UserMatch> findByUserIn(List<User> users, Pageable pageable);

    UserMatch findTopByUserOrderByWatchedAtDesc(User user);

    @EntityGraph(attributePaths = { "user", "match" })
    @Query("SELECT um FROM UserMatch um WHERE um.user IN :followedUsers ORDER BY um.watchedAt DESC")
    List<UserMatch> findLatestMatchesOfUsers(@Param("followedUsers") List<User> followedUsers, Pageable pageable);

    @Query("SELECT um.match.id, AVG(um.note), COUNT(um) FROM UserMatch um WHERE um.match.id IN :matchIds GROUP BY um.match.id")
    List<Object[]> findStatsByMatchIds(@Param("matchIds") List<UUID> matchIds);

    @EntityGraph(attributePaths = { "user", "match" })
    @Query("SELECT um FROM UserMatch um ORDER BY um.watchedAt DESC")
    List<UserMatch> findLatestReviews(Pageable pageable);

    @Query(value = "SELECT CAST(watched_at AS DATE) as date, COUNT(*) as count FROM user_matches WHERE watched_at >= :startDate GROUP BY CAST(watched_at AS DATE) ORDER BY date", nativeQuery = true)
    List<Object[]> countReviewsByDay(@Param("startDate") java.time.LocalDateTime startDate);

    long countByWatchedAtBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);
}
