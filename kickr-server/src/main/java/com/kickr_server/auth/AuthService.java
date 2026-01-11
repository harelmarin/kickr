package com.kickr_server.auth;

import com.kickr_server.auth.jwt.JwtService;
import com.kickr_server.auth.refreshToken.RefreshToken;
import com.kickr_server.auth.refreshToken.RefreshTokenRepository;
import com.kickr_server.auth.refreshToken.RefreshTokenService;
import com.kickr_server.dto.Auth.AuthRequest;
import com.kickr_server.dto.Auth.AuthResponse;
import com.kickr_server.dto.Auth.RefreshTokenResponse;
import com.kickr_server.dto.User.UserDto;
import com.kickr_server.exception.auth.LogOutException;
import com.kickr_server.user.User;

import com.kickr_server.exception.auth.InvalidCredentialsException;
import com.kickr_server.user.UserRepository;
import com.kickr_server.user.UserService;
import com.kickr_server.notification.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final UserService userService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final EmailService emailService;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    /**
     * Authentifie un utilisateur avec son email et son mot de passe.
     *
     * @param request les identifiants de l'utilisateur
     * @return un objet AuthResponse contenant le token JWT, le refresh token et le
     *         DTO de l'utilisateur
     * @throws InvalidCredentialsException si l'email ou le mot de passe est
     *                                     incorrect
     */
    public AuthResponse authenticate(AuthRequest request) {
        User user;
        try {
            user = userService.getUserByName(request.username());
        } catch (Exception e) {
            throw new InvalidCredentialsException("Invalid username or password");
        }

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid username or password");
        }
        String accessToken = jwtService.generateToken(user.getEmail());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
        return new AuthResponse(accessToken, refreshToken.getToken(), userService.getUserDtoWithStats(user.getId()));
    }

    /**
     * Enregistre un nouvel utilisateur.
     *
     * @param user l'utilisateur à créer
     * @return le DTO de l'utilisateur créé
     */
    public UserDto register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userService.save(user);
        return userService.getUserDtoWithStats(savedUser.getId());
    }

    /**
     * Génère un nouveau jeton d'accès (access token) à partir d’un refresh token.
     * <p>
     * Cette méthode :
     * <ul>
     * <li>Vérifie que le refresh token existe en base</li>
     * <li>Contrôle sa date d’expiration</li>
     * <li>Génère un nouveau access token si le refresh token est valide</li>
     * <li>Supprime le refresh token de la base</li>
     * <li></li>
     * </ul>
     * Si le refresh token est invalide ou expiré, une exception est levée.
     * </p>
     *
     * @param refreshTokenStr le refresh token envoyé par le client
     * @return un objet {@link RefreshTokenResponse} contenant le nouvel access
     *         token et le refresh token
     */
    public RefreshTokenResponse refreshAccessToken(String refreshTokenStr) {
        RefreshToken oldRefreshToken = refreshTokenService.findByToken(refreshTokenStr)
                .map(refreshTokenService::verifyExpiration)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        // Créer le nouveau refresh token AVANT de supprimer l'ancien (rotation
        // sécurisée)
        User user = oldRefreshToken.getUser();
        String newAccessToken = jwtService.generateToken(user.getEmail());
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user);

        // Supprimer l'ancien refresh token seulement après la création du nouveau
        refreshTokenRepository.delete(oldRefreshToken);

        return new RefreshTokenResponse(newAccessToken, newRefreshToken.getToken());
    }

    public void logout(String refreshTokenStr) {
        boolean deleted = refreshTokenService.findByToken(refreshTokenStr)
                .map(token -> {
                    refreshTokenRepository.delete(token);
                    return true;
                })
                .orElse(false);

        if (!deleted) {
            throw new LogOutException("Logout failed, please try again later");
        }
    }

    /**
     * Initie la procédure de réinitialisation de mot de passe.
     * Génère un token unique, l'enregistre en base et envoie un email à
     * l'utilisateur.
     *
     * @param email l'email de l'utilisateur
     */
    @Transactional
    public void initiatePasswordReset(String email) {
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            // For security, don't reveal if email exists.
            log.info("Password reset requested for non-existent email: {}", email);
            return;
        }

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1)); // Token valide 1 heure
        userRepository.save(user);

        String resetLink = frontendUrl + "/reset-password?token=" + token;

        try {
            emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}: {}", email, e.getMessage());
            // We don't rethrow here to allow the transaction (token save) to commit
            // and keep the API response clean, while logging the real cause.
        }
    }

    /**
     * Réinitialise le mot de passe de l'utilisateur avec un nouveau mot de passe.
     *
     * @param token       le token de réinitialisation
     * @param newPassword le nouveau mot de passe
     */
    @Transactional
    public void resetPassword(String token, String newPassword) {
        User user = userService.findAll().stream()
                .filter(u -> token.equals(u.getResetToken()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset token"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userService.update(user);
    }
}
