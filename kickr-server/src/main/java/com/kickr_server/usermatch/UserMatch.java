package com.kickr_server.usermatch;

import com.kickr_server.match.Match;
import com.kickr_server.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entité représentant l’évaluation d’un match par un utilisateur.
 * <p>
 * Cette entité fait le lien entre {@link User} et {@link Match}, en ajoutant
 * des informations
 * comme une note, un commentaire et la date de visionnage.
 * <p>
 * Un enregistrement {@code UserMatch} correspond donc à un utilisateur ayant
 * noté un match.
 */
@Entity
@Table(name = "user_matches")
@Getter
@Setter
@ToString
@EqualsAndHashCode(of = "id")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserMatch {

    /**
     * Identifiant unique de l’évaluation (UUID généré automatiquement).
     */
    @Id
    @GeneratedValue
    private UUID id;

    /**
     * Le match concerné par l’évaluation.
     * <p>
     * Si le match est supprimé, toutes les évaluations liées seront aussi
     * supprimées
     * (grâce à {@link OnDelete}).
     */
    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    /**
     * L’utilisateur qui a fait l’évaluation.
     * <p>
     * Si l’utilisateur est supprimé, toutes ses évaluations liées seront
     * supprimées.
     */
    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Note donnée au match (entre 0 et 5).
     */
    @Column(nullable = false, columnDefinition = "double precision")
    @Min(0)
    @Max(5)
    private double note;

    /**
     * Commentaire facultatif laissé par l’utilisateur (limité à 1000 caractères).
     */
    @Column(length = 1000)
    private String comment;

    /**
     * Indique si l'utilisateur a marqué ce match comme favori (liked).
     * Par défaut à false.
     */
    @Builder.Default
    @Column(nullable = false)
    private boolean isLiked = false;

    /**
     * Nombre de likes sociaux reçus sur cette review.
     */
    @Builder.Default
    @Column(nullable = false)
    private int likesCount = 0;

    /**
     * Date et heure auxquelles l’utilisateur a marqué le match comme "vu".
     * Par défaut, définie à l’instant de la création si non spécifiée.
     */
    private LocalDateTime watchedAt;

    /**
     * Indique si cette review a été modérée par un administrateur.
     */
    @Builder.Default
    @Column(nullable = false)
    private boolean isModerated = false;

    /**
     * Callback exécuté automatiquement avant l’insertion en base.
     * Définit {@code watchedAt} à la date et l’heure actuelles si elle est absente.
     */
    @PrePersist
    public void prePersist() {
        if (watchedAt == null) {
            watchedAt = LocalDateTime.now();
        }
    }

    public void setNote(double note) {
        if (note < 0 || note > 5 || (note * 2) % 1 != 0) {
            throw new IllegalArgumentException("Note must be between 0 and 5");
        }
        this.note = note;
    }

}
