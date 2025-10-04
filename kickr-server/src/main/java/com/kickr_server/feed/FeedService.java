package com.kickr_server.feed;

import com.kickr_server.follow.FollowService;
import com.kickr_server.usermatch.UserMatch;
import com.kickr_server.usermatch.UserMatchRepository;
import com.kickr_server.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

/**
 * Service pour récupérer le "feed" d'un utilisateur,
 * c'est-à-dire les derniers matchs notés par les utilisateurs qu'il suit.
 */
@Service
@RequiredArgsConstructor
public class FeedService {

    private final FollowService followService;
    private final UserMatchRepository userMatchRepository;

    /**
     * Récupère tous les matchs notés par les utilisateurs suivis par un utilisateur donné.
     * <p>
     * Les résultats sont triés par date de visionnage (du plus récent au plus ancien).
     *
     * @param userId l'UUID de l'utilisateur pour lequel récupérer le feed
     * @return liste de {@link UserMatch} correspondant aux matchs notés par les utilisateurs suivis
     */
    public List<UserMatch> getMatchesFromFollowedUsers(UUID userId) {
        List<User> followedUsers = followService.getFollowing(userId);
        return userMatchRepository.findByUserIn(followedUsers)
                .stream()
                .sorted(Comparator.comparing(UserMatch::getWatchedAt).reversed())
                .toList();
    }

    /**
     * Récupère le dernier match noté par chaque utilisateur suivi.
     */
    public List<UserMatch> getLatestMatchesFromFollowedUsers(UUID userId) {
        List<User> followedUsers = followService.getFollowing(userId);
        return followedUsers.stream()
                .map(userMatchRepository::findTopByUserOrderByWatchedAtDesc)
                .filter(java.util.Objects::nonNull)
                .sorted(Comparator.comparing(UserMatch::getWatchedAt).reversed())
                .toList();
    }
}
