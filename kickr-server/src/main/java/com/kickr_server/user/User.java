package com.kickr_server.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Représente un utilisateur de l'application.
 * <p>
 * Cette entité est mappée sur la table {@code users} de la base de données.
 * Elle contient les informations principales d'identification et de suivi
 * (timestamps de création/mise à jour).
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@ToString(exclude = "password")
@EqualsAndHashCode(of = "id")
@NoArgsConstructor
@AllArgsConstructor
public class User {

    /**
     * Identifiant unique de l'utilisateur.
     * Généré automatiquement sous forme de {@link UUID}.
     */
    @Id
    @GeneratedValue
    private UUID id;

    /**
     * Nom de l'utilisateur.
     * <ul>
     * <li>Ne peut pas être vide.</li>
     * <li>Doit être unique dans la base.</li>
     * </ul>
     */
    @NotBlank(message = "Le nom ne peut pas être vide")
    @Column(nullable = false, unique = true)
    private String name;

    /**
     * Adresse email de l'utilisateur.
     * <ul>
     * <li>Ne peut pas être vide.</li>
     * <li>Doit respecter le format email.</li>
     * <li>Doit être unique dans la base.</li>
     * </ul>
     */
    @Email(message = "L'email doit être valide")
    @NotBlank(message = "L'email ne peut pas être vide")
    @Column(nullable = false, unique = true)
    private String email;

    /**
     * Mot de passe de l'utilisateur.
     * <p>
     * ⚠️ Stocké sous forme chiffrée (ex: BCrypt), jamais en clair.
     */
    @Column(nullable = false)
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$", message = "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial")
    private String password;

    /**
     * Date et heure de création de l'utilisateur.
     * Renseignée automatiquement lors de l'insertion.
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /**
     * Date et heure de la dernière mise à jour de l'utilisateur.
     * Mise à jour automatiquement à chaque modification.
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Rôle de l'utilisateur dans l'application.
     * Par défaut, un nouvel utilisateur a le rôle USER.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    /**
     * URL de la photo de profil (Avatar).
     */
    @Column(name = "avatar_url")
    private String avatarUrl;

    /**
     * ID public de l'image sur Cloudinary (utile pour la suppression/mise à jour).
     */
    @Column(name = "avatar_public_id")
    private String avatarPublicId;

    /**
     * Token pour la réinitialisation du mot de passe.
     */
    @Column(name = "reset_token")
    private String resetToken;

    /**
     * Date d'expiration du token de réinitialisation.
     */
    @Column(name = "reset_token_expiry")
    private LocalDateTime resetTokenExpiry;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<com.kickr_server.usermatch.UserMatch> userMatches;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<com.kickr_server.usermatch.ReviewComment> reviewComments;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<com.kickr_server.usermatch.ReviewLike> reviewLikes;

    @OneToMany(mappedBy = "actor", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<com.kickr_server.notification.Notification> notificationsSent;

    @OneToMany(mappedBy = "recipient", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<com.kickr_server.notification.Notification> notificationsReceived;

    @OneToMany(mappedBy = "follower", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<com.kickr_server.follow.Follow> following;

    @OneToMany(mappedBy = "followed", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<com.kickr_server.follow.Follow> followers;

    /**
     * Callback JPA appelé avant l'insertion.
     * Initialise {@link #createdAt} et {@link #updatedAt} à l'instant actuel.
     */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    /**
     * Callback JPA appelé avant la mise à jour.
     * Met à jour {@link #updatedAt} à l'instant actuel.
     */
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
