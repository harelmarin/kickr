package com.kickr_server.follow;

import com.kickr_server.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FollowRepository extends JpaRepository<Follow, UUID> {
    boolean existsByFollowerAndFollowed(User follower, User followed);

    List<Follow> findByFollower(User follower); // liste de gens que je suis

    Page<Follow> findByFollower(User follower, Pageable pageable);

    List<Follow> findByFollowed(User followed); // liste de mes followers

    Page<Follow> findByFollowed(User followed, Pageable pageable);

    long countByFollowerId(UUID followerId);

    long countByFollowedId(UUID followedId);

    void deleteByFollowerAndFollowed(User follower, User followed);
}
