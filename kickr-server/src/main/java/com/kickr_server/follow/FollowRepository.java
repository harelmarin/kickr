package com.kickr_server.follow;

import com.kickr_server.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FollowRepository extends JpaRepository<Follow, UUID> {
    boolean existsByFollowerAndFollowed(User follower, User followed);
    List<Follow> findByFollower(User follower); // liste de gens que je suis
    List<Follow> findByFollowed(User followed); // liste de mes followers
    void deleteByFollowerAndFollowed(User follower, User followed);
}
