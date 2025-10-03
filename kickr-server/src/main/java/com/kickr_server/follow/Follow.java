package com.kickr_server.follow;

import com.kickr_server.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entité représentant une relation de suivi unilatérale entre deux utilisateurs.
 * <p>
 * Chaque enregistrement {@code Follow} indique qu'un utilisateur (follower) suit un autre utilisateur (followed).
 * L'entité stocke également la date de création de la relation.
 * <p>
 * Exemple d'utilisation :
 * <ul>
 *     <li>Afficher la liste des utilisateurs suivis par un utilisateur</li>
 *     <li>Afficher la liste des followers d'un utilisateur</li>
 *     <li>Gérer les notifications ou flux d'activité basés sur les suivis</li>
 * </ul>
 */
@Entity
@Table(name = "follows")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Follow {

    /**
     * Identifiant unique de la relation de suivi (UUID généré automatiquement).
     */
    @Id
    @GeneratedValue
    private UUID id;

    /**
     * L'utilisateur qui suit (follower).
     * <p>
     * Cette relation est obligatoire.
     */
    @ManyToOne
    @JoinColumn(name = "follower_id", nullable = false)
    private User follower;

    /**
     * L'utilisateur suivi (followed).
     * <p>
     * Cette relation est obligatoire.
     */
    @ManyToOne
    @JoinColumn(name = "followed_id", nullable = false)
    private User followed;

    /**
     * Date et heure de création de la relation de suivi.
     * <p>
     * Définie automatiquement lors de l'insertion si elle est absente.
     * Ne peut pas être modifiée par la suite.
     */
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Callback exécuté automatiquement avant l'insertion en base.
     * Définit {@code createdAt} à la date et l'heure actuelles si elle est absente.
     */
    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
