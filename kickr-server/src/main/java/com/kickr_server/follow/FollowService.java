package com.kickr_server.follow;

import com.kickr_server.dto.User.UserDto;
import com.kickr_server.exception.follow.FollowedNotFoundException;
import com.kickr_server.exception.follow.FollowerNotFoundException;
import com.kickr_server.exception.user.UserNotFoundException;
import com.kickr_server.user.User;
import com.kickr_server.user.UserRepository;
import com.kickr_server.notification.NotificationService;
import com.kickr_server.notification.NotificationType;
import com.kickr_server.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Service métier pour gérer les relations de suivi ("follow") entre
 * utilisateurs.
 * <p>
 * Fournit les fonctionnalités principales pour :
 * <ul>
 * <li>Suivre un utilisateur</li>
 * <li>Se désabonner d’un utilisateur</li>
 * <li>Récupérer la liste des utilisateurs suivis par un utilisateur</li>
 * <li>Récupérer la liste des utilisateurs qui suivent un utilisateur</li>
 * </ul>
 */
@Service
@RequiredArgsConstructor
public class FollowService {

        private final FollowRepository followRepository;
        private final UserRepository userRepository;
        private final UserService userService;
        private final NotificationService notificationService;

        /**
         * Permet à un utilisateur de suivre un autre utilisateur.
         *
         * @param followerId l'UUID de l'utilisateur qui suit
         * @param followedId l'UUID de l'utilisateur à suivre
         * @throws FollowerNotFoundException si le follower ou le followed n'existe pas
         * @throws IllegalStateException     si le follower suit déjà l'utilisateur
         */
        @Transactional
        public void follow(UUID followerId, UUID followedId) {
                User follower = userRepository.findById(followerId)
                                .orElseThrow(() -> new FollowerNotFoundException("User not found"));
                User followed = userRepository.findById(followedId)
                                .orElseThrow(() -> new FollowerNotFoundException("User not found"));

                if (followRepository.existsByFollowerAndFollowed(follower, followed)) {
                        throw new IllegalStateException("You are already following this user");
                }

                followRepository.save(Follow.builder()
                                .follower(follower)
                                .followed(followed)
                                .build());

                notificationService.createNotification(
                                followed,
                                follower,
                                NotificationType.FOLLOW,
                                follower.getName() + " started following you",
                                follower.getId().toString());
        }

        /**
         * Permet à un utilisateur de se désabonner d’un autre utilisateur.
         *
         * @param followerId l'UUID de l'utilisateur qui se désabonne
         * @param followedId l'UUID de l'utilisateur à ne plus suivre
         * @throws IllegalArgumentException si le follower ou le followed n'existe pas
         */
        @Transactional
        public void unfollow(UUID followerId, UUID followedId) {
                User follower = userRepository.findById(followerId)
                                .orElseThrow(() -> new FollowerNotFoundException("User not found"));
                User followed = userRepository.findById(followedId)
                                .orElseThrow(() -> new FollowedNotFoundException("User not found"));
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
                                .orElseThrow(() -> new UserNotFoundException("User not found"));
                return followRepository.findByFollower(user)
                                .stream()
                                .map(Follow::getFollowed)
                                .toList();
        }

        public List<UserDto> getFollowingDtos(UUID userId) {
                return getFollowing(userId).stream()
                                .map(user -> userService.getUserDtoWithStats(user.getId()))
                                .toList();
        }

        public Page<UserDto> getFollowingDtos(UUID userId, Pageable pageable) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new UserNotFoundException("User not found"));
                return followRepository.findByFollower(user, pageable)
                                .map(follow -> userService.getUserDtoWithStats(follow.getFollowed().getId()));
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
                                .orElseThrow(() -> new UserNotFoundException("User not found"));
                return followRepository.findByFollowed(user)
                                .stream()
                                .map(Follow::getFollower)
                                .toList();
        }

        public List<UserDto> getFollowersDtos(UUID userId) {
                return getFollowers(userId).stream()
                                .map(user -> userService.getUserDtoWithStats(user.getId()))
                                .toList();
        }

        public Page<UserDto> getFollowersDtos(UUID userId, Pageable pageable) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new UserNotFoundException("User not found"));
                return followRepository.findByFollowed(user, pageable)
                                .map(follow -> userService.getUserDtoWithStats(follow.getFollower().getId()));
        }

        /**
         * Vérifie si un utilisateur suit un autre utilisateur.
         *
         * @param followerId l'UUID de l'utilisateur qui suit
         * @param followedId l'UUID de l'utilisateur potentiellement suivi
         * @return true si le follower suit le followed, false sinon
         */
        public boolean isFollowing(UUID followerId, UUID followedId) {
                User follower = userRepository.findById(followerId).orElse(null);
                User followed = userRepository.findById(followedId).orElse(null);

                if (follower == null || followed == null) {
                        return false;
                }

                return followRepository.existsByFollowerAndFollowed(follower, followed);
        }
}
