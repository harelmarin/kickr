package com.kickr_server.feed;

import com.kickr_server.dto.UserMatch.UserMatchFullDto;
import com.kickr_server.follow.FollowService;
import com.kickr_server.usermatch.UserMatch;
import com.kickr_server.usermatch.UserMatchRepository;
import com.kickr_server.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FeedService {

    private final FollowService followService;
    private final UserMatchRepository userMatchRepository;

    /**
     * Récupère tous les matchs notés par les utilisateurs suivis par un utilisateur donné,
     * triés par date de visionnage décroissante.
     */
    public List<UserMatchFullDto> getFeedFull(UUID userId) {
        List<User> followedUsers = followService.getFollowing(userId);

        return userMatchRepository.findByUserIn(followedUsers)
                .stream()
                .sorted(Comparator.comparing(UserMatch::getWatchedAt).reversed())
                .map(UserMatchFullDto::fromEntity)
                .toList();
    }

    /**
     * Récupère le dernier match noté par chaque utilisateur suivi.
     */
    public List<UserMatchFullDto> getLatestFeedFull(UUID userId) {
        List<User> followedUsers = followService.getFollowing(userId);

        return followedUsers.stream()
                .map(userMatchRepository::findTopByUserOrderByWatchedAtDesc)
                .filter(java.util.Objects::nonNull)
                .sorted(Comparator.comparing(UserMatch::getWatchedAt).reversed())
                .map(UserMatchFullDto::fromEntity)
                .toList();
    }
}
