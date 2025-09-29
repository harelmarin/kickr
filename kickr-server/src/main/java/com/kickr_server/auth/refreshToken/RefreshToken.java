package com.kickr_server.auth.refreshToken;

import com.kickr_server.user.User;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entité représentant un Refresh Token.
 * <p>
 * Les refresh tokens permettent de prolonger une session utilisateur
 * en obtenant un nouveau jeton d’accès (JWT) sans que l’utilisateur
 * ait à ressaisir ses identifiants.
 * </p>
 * Chaque refresh token est associé à un utilisateur et possède
 * une date d’expiration.
 */
@Entity
@Table(name = "refresh_tokens")
@Data
public class RefreshToken {

    /**
     * Identifiant unique du refresh token (clé primaire).
     */
    @Id
    @GeneratedValue
    private UUID id;

    /**
     * Valeur du refresh token, générée aléatoirement (UUID).
     */
    @Column(nullable = false, unique = true)
    private String token;

    /**
     * Date et heure d’expiration du refresh token.
     */
    @Column(nullable = false)
    private LocalDateTime expiryDate;

    /**
     * L’utilisateur auquel ce refresh token est associé.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
