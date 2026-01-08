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
import com.kickr_server.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;
    private final RefreshTokenRepository refreshTokenRepository;

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
        return new AuthResponse(accessToken, refreshToken.getToken(), UserDto.fromEntity(user));
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
        return UserDto.fromEntity(savedUser);
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

}
