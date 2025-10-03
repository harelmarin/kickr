package com.kickr_server.usermatch;

import com.kickr_server.dto.UserMatch.UserMatchDto;
import com.kickr_server.exception.user.UserNotFoundException;
import com.kickr_server.exception.userMatch.IllegalCommentLengthException;
import com.kickr_server.exception.userMatch.IllegalMatchNoteException;
import com.kickr_server.exception.userMatch.UserMatchNotFoundException;
import com.kickr_server.match.Match;
import com.kickr_server.match.MatchRepository;
import com.kickr_server.user.User;
import com.kickr_server.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * Service métier pour la gestion des évaluations de matchs par les utilisateurs.
 * <p>
 * Fournit les principales méthodes pour :
 * <ul>
 *     <li>Récupérer toutes les évaluations de matchs (notes + commentaires)</li>
 *     <li>Récupérer les évaluations par utilisateur</li>
 *     <li>Récupérer les évaluations par match</li>
 *     <li>Récupérer l’évaluation unique d’un utilisateur pour un match donné</li>
 * </ul>
 *
 * Ce service encapsule l’accès à la base via {@link UserMatchRepository}.
 */
@Service
@RequiredArgsConstructor
public class UserMatchService {

    private final UserMatchRepository userMatchRepository;
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;

    /**
     * Récupère toutes les évaluations de matchs.
     *
     * @return la liste de tous les {@link UserMatch}
     */
    public List<UserMatch> findAll() {
        return userMatchRepository.findAll();
    }

    /**
     * Récupère toutes les évaluations faites par un utilisateur spécifique.
     *
     * @param id l’UUID de l’utilisateur
     * @return la liste des {@link UserMatch} associés à cet utilisateur
     */
    public List<UserMatch> getByUserId(UUID id) {
        return userMatchRepository.findByUserId(id);
    }

    /**
     * Récupère toutes les évaluations d’un match spécifique.
     *
     * @param id l’UUID du match
     * @return la liste des {@link UserMatch} associés à ce match
     */
    public List<UserMatch> getByMatchId(UUID id) {
        return userMatchRepository.findByMatchId(id);
    }

    /**
     * Récupère l’évaluation unique d’un utilisateur pour un match donné.
     *
     * @param userId l’UUID de l’utilisateur
     * @param matchId l’UUID du match
     * @return le {@link UserMatch} correspondant, ou null si aucune évaluation n’existe
     */
    public UserMatch getByUserIdAndMatchId(UUID userId, UUID matchId) {
        return userMatchRepository.findByUserIdAndMatchId(userId, matchId);
    }

    public UserMatch save(UserMatchDto dto) {
        Match match = matchRepository.findById(dto.matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found: " + dto.matchId));

        User user = userRepository.findById(dto.userId)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + dto.userId));

        if (dto.note < 0 || dto.note > 5) {
            throw new IllegalMatchNoteException(dto.note + " illégal");
        }

        if (dto.comment.length() > 1000) {
            throw new IllegalCommentLengthException(dto.comment.length() + " > 1000");
        }
        UserMatch userMatch = UserMatch.builder()
                .user(user)
                .match(match)
                .note(dto.note)
                .comment(dto.comment)
                .build();

        return userMatchRepository.save(userMatch);
    }

    /**
     * Met à jour la note et/ou le commentaire d'une évaluation existante.
     * */
    public UserMatch update(UUID id, int note, String comment) {
        UserMatch existing = userMatchRepository.findById(id)
                .orElseThrow(() -> new UserMatchNotFoundException(" Evaluation non trouvée : " + id));

        if (note < 0 || note > 5) {
            throw new IllegalMatchNoteException(note + " illégal");
        }
        if (comment.length() > 1000) {
            throw new IllegalCommentLengthException(comment.length() + " > 1000");
        }
        existing.setNote(note);
        existing.setComment(comment);
        return userMatchRepository.save(existing);
    }
}
