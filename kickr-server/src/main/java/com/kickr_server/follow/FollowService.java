package com.kickr_server.follow;

import com.kickr_server.exception.follow.FollowedNotFoundException;
import com.kickr_server.exception.follow.FollowerNotFoundException;
import com.kickr_server.exception.user.UserNotFoundException;
import com.kickr_server.user.User;
import com.kickr_server.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * Service métier pour gérer les relations de suivi ("follow") entre utilisateurs.
 * <p>
 * Fournit les fonctionnalités principales pour :
 * <ul>
 *     <li>Suivre un utilisateur</li>
 *     <li>Se désabonner d’un utilisateur</li>
 *     <li>Récupérer la liste des utilisateurs suivis par un utilisateur</li>
 *     <li>Récupérer la liste des utilisateurs qui suivent un utilisateur</li>
 * </ul>
 */
@Service
@RequiredArgsConstructor
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    /**
     * Permet à un utilisateur de suivre un autre utilisateur.
     *
     * @param followerId l'UUID de l'utilisateur qui suit
     * @param followedId l'UUID de l'utilisateur à suivre
     * @throws FollowerNotFoundException si le follower ou le followed n'existe pas
     * @throws IllegalStateException si le follower suit déjà l'utilisateur
     */
    public void follow(UUID followerId, UUID followedId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new FollowerNotFoundException("Utilisateur introuvable"));
        User followed = userRepository.findById(followedId)
                .orElseThrow(() -> new FollowerNotFoundException("Utilisateur introuvable"));

        if (followRepository.existsByFollowerAndFollowed(follower, followed)) {
            throw new IllegalStateException("Vous suivez déjà cet utilisateur");
        }

        followRepository.save(Follow.builder()
                .follower(follower)
                .followed(followed)
                .build());
    }

    /**
     * Permet à un utilisateur de se désabonner d’un autre utilisateur.
     *
     * @param followerId l'UUID de l'utilisateur qui se désabonne
     * @param followedId l'UUID de l'utilisateur à ne plus suivre
     * @throws IllegalArgumentException si le follower ou le followed n'existe pas
     */
    public void unfollow(UUID followerId, UUID followedId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new FollowerNotFoundException("Utilisateur introuvable"));
        User followed = userRepository.findById(followedId)
                .orElseThrow(() -> new FollowedNotFoundException("Utilisateur introuvable"));
        followRepository.deleteByFollowerAndFollowed(follower, followed);
    }

    /**
     * Récupère la liste des utilisateurs suivis par un utilisateur donné.
     *
     * @param userId l'UUID de l'utilisateur
     * @return liste des utilisateurs suivis
     * @throws UserNotFoundException si l'utilisateur n'existe pas
     */
    public List<User> getFollowing(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur introuvable"));
        return followRepository.findByFollower(user)
                .stream()
                .map(Follow::getFollowed)
                .toList();
    }

    /**
     * Récupère la liste des utilisateurs qui suivent un utilisateur donné.
     *
     * @param userId l'UUID de l'utilisateur
     * @return liste des followers
     * @throws UserNotFoundException si l'utilisateur n'existe pas
     */
    public List<User> getFollowers(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur introuvable"));
        return followRepository.findByFollowed(user)
                .stream()
                .map(Follow::getFollower)
                .toList();
    }
}
