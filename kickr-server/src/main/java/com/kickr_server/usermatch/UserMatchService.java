package com.kickr_server.usermatch;

import com.kickr_server.dto.UserMatch.UserMatchDto;
import com.kickr_server.exception.user.UserNotFoundException;
import com.kickr_server.exception.userMatch.IllegalCommentLengthException;
import com.kickr_server.exception.userMatch.UserMatchNotFoundException;
import com.kickr_server.follow.FollowService;
import com.kickr_server.match.Match;
import com.kickr_server.match.MatchRepository;
import com.kickr_server.user.User;
import com.kickr_server.user.UserRepository;
import com.kickr_server.notification.NotificationService;
import com.kickr_server.notification.NotificationType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

/**
 * Service métier pour la gestion des évaluations de matchs par les
 * utilisateurs.
 *
 * <p>
 * Ce service fournit des méthodes pour :
 * <ul>
 * <li>Créer et mettre à jour les évaluations de matchs</li>
 * <li>Récupérer les évaluations par utilisateur ou par match</li>
 * <li>Récupérer les évaluations des utilisateurs suivis</li>
 * </ul>
 *
 * <p>
 * La validation des notes (y compris les demi-notes) est effectuée directement
 * via l'entité {@link UserMatch}.
 */
@Service
@RequiredArgsConstructor
public class UserMatchService {

    private final UserMatchRepository userMatchRepository;
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final FollowService followService;
    private final NotificationService notificationService;

    public User getUserEntityByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    /**
     * Récupère les dernières évaluations globales.
     */
    public List<UserMatch> getLatestReviews(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return userMatchRepository.findLatestReviews(pageable);
    }

    /**
     * Récupère toutes les évaluations de matchs.
     *
     * @return la liste de tous les {@link UserMatch} enregistrés
     */
    public List<UserMatch> findAll() {
        return userMatchRepository.findAll();
    }

    public Page<UserMatch> findAll(Pageable pageable) {
        return userMatchRepository.findAll(pageable);
    }

    /**
     * Récupère toutes les évaluations effectuées par un utilisateur spécifique.
     *
     * @param id l'UUID de l'utilisateur
     * @return liste des {@link UserMatch} associés à cet utilisateur
     */
    public List<UserMatch> getByUserId(UUID id) {
        return userMatchRepository.findByUserId(id);
    }

    public Page<UserMatch> getByUserId(UUID id, Pageable pageable) {
        return userMatchRepository.findByUserId(id, pageable);
    }

    public UserMatch findById(UUID id) {
        return userMatchRepository.findById(id)
                .orElseThrow(() -> new UserMatchNotFoundException("Evaluation not found"));
    }

    /**
     * Récupère toutes les évaluations d'un match spécifique avec tri.
     */
    public List<UserMatch> getByMatchId(UUID id, String sortBy, String direction) {
        Pageable pageable = PageRequest.of(0, 100,
                direction.equalsIgnoreCase("desc") ? org.springframework.data.domain.Sort.Direction.DESC
                        : org.springframework.data.domain.Sort.Direction.ASC,
                sortBy);
        return userMatchRepository.findByMatchId(id, pageable);
    }

    /**
     * Récupère toutes les évaluations d'un match spécifique.
     *
     * @param id l'UUID du match
     * @return liste des {@link UserMatch} associés à ce match
     */
    public List<UserMatch> getByMatchId(UUID id) {
        return userMatchRepository.findByMatchId(id);
    }

    /**
     * Récupère l'évaluation unique d'un utilisateur pour un match donné.
     *
     * @param userId  l'UUID de l'utilisateur
     * @param matchId l'UUID du match
     * @return le {@link UserMatch} correspondant, ou null si aucune évaluation
     *         n'existe
     */
    public List<UserMatch> getByUserIdAndMatchId(UUID userId, UUID matchId) {
        return userMatchRepository.findByUserIdAndMatchId(userId, matchId);
    }

    /**
     * Crée une nouvelle évaluation pour un match par un utilisateur.
     *
     * <p>
     * La note peut être un entier ou un demi (0.5, 1.0, 1.5, ...).
     * La validation de la note est effectuée via {@link UserMatch#setNote(double)}.
     * </p>
     * <p>
     * Note: In "Immutable Multi-Log" approach, we ALWAYS create a new entry.
     * This prevents moderated content from being bypassed and allows tactical
     * history.
     * </p>
     *
     * @param dto DTO contenant les informations de l'évaluation
     * @return l'entité {@link UserMatch} enregistrée en base
     * @throws UserNotFoundException         si l'utilisateur n'existe pas
     * @throws IllegalArgumentException      si le match n'existe pas
     * @throws IllegalCommentLengthException si le commentaire dépasse 1000
     *                                       caractères
     */
    public UserMatch save(UserMatchDto dto) {
        Match match = matchRepository.findById(dto.matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found"));

        User user = (dto.userId != null)
                ? userRepository.findById(dto.userId)
                        .orElseThrow(() -> new UserNotFoundException("User not found"))
                : null;

        if (dto.comment != null && dto.comment.length() > 1000) {
            throw new IllegalCommentLengthException(dto.comment.length() + " > 1000 characters");
        }

        UserMatch userMatch = UserMatch.builder()
                .user(user)
                .match(match)
                .comment(dto.comment)
                .isLiked(dto.isLiked)
                .build();
        userMatch.setNote(dto.note);

        UserMatch savedMatch = userMatchRepository.save(userMatch);

        List<User> followers = followService.getFollowers(user.getId());
        for (User follower : followers) {
            notificationService.createNotification(
                    follower,
                    user,
                    NotificationType.NEW_REVIEW,
                    user.getName() + " logged a match: " + match.getHomeTeam().getName() + " vs "
                            + match.getAwayTeam().getName(),
                    savedMatch.getId().toString());
        }

        return savedMatch;
    }

    /**
     * Met à jour une évaluation existante.
     *
     * <p>
     * La note peut être un entier ou un demi. La validation est effectuée via
     * {@link UserMatch#setNote(double)}.
     *
     * @param id      l'UUID de l'évaluation à mettre à jour
     * @param note    nouvelle note
     * @param comment nouveau commentaire
     * @return l'entité {@link UserMatch} mise à jour
     * @throws UserMatchNotFoundException    si l'évaluation n'existe pas
     * @throws IllegalCommentLengthException si le commentaire dépasse 1000
     *                                       caractères
     */
    public UserMatch update(UUID id, double note, String comment) {
        throw new UnsupportedOperationException("Reviews are immutable. Please delete and re-log if needed.");
    }

    /**
     * Récupère toutes les évaluations des utilisateurs suivis par un utilisateur
     * donné,
     * triées par date de visionnage décroissante.
     *
     * @param userId l'UUID de l'utilisateur
     * @return liste des {@link UserMatch} des utilisateurs suivis
     */
    /**
     * Récupère les évaluations des utilisateurs suivis par un utilisateur donné.
     *
     * @param userId l'UUID de l'utilisateur
     * @param limit  le nombre maximum de résultats
     * @return liste des évaluations des utilisateurs suivis
     */
    public List<UserMatch> getFollowingReviews(UUID userId, int limit) {
        List<User> followedUsers = followService.getFollowing(userId);
        if (followedUsers.isEmpty()) {
            return List.of();
        }
        return userMatchRepository.findLatestMatchesOfUsers(followedUsers, PageRequest.of(0, limit));
    }

    public Page<UserMatch> getFollowingReviews(UUID userId, Pageable pageable) {
        List<User> followedUsers = followService.getFollowing(userId);
        if (followedUsers.isEmpty()) {
            return Page.empty();
        }
        return userMatchRepository.findByUserIn(followedUsers, pageable);
    }

    /**
     * Supprime une évaluation.
     * <p>
     * Seul l'auteur de l'évaluation ou un administrateur peut la supprimer.
     *
     * @param id          l'UUID de l'évaluation à supprimer
     * @param currentUser l'utilisateur effectuant la demande de suppression
     * @throws UserMatchNotFoundException                                si
     *                                                                   l'évaluation
     *                                                                   n'existe
     *                                                                   pas
     * @throws org.springframework.security.access.AccessDeniedException si
     *                                                                   l'utilisateur
     *                                                                   n'a pas le
     *                                                                   droit
     */
    public void delete(UUID id, User currentUser) {
        UserMatch existing = userMatchRepository.findById(id)
                .orElseThrow(() -> new UserMatchNotFoundException("Evaluation not found"));

        boolean isOwner = existing.getUser().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == com.kickr_server.user.Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You do not have permission to delete this review");
        }

        userMatchRepository.delete(existing);
    }

    /**
     * Modère une évaluation en remplaçant son commentaire et en activant le flag
     * isModerated.
     *
     * @param id l'UUID de l'évaluation à modérer
     */
    public UserMatch moderate(UUID id) {
        UserMatch existing = userMatchRepository.findById(id)
                .orElseThrow(() -> new UserMatchNotFoundException("Evaluation not found"));

        existing.setModerated(true);
        existing.setComment("[Comment excluded by an administrator]");

        return userMatchRepository.save(existing);
    }
}
