package com.kickr_server.auth.refreshToken;

import com.kickr_server.user.User;
import com.kickr_server.exception.auth.RefreshTokenExpiredException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * Service métier pour la gestion des Refresh Tokens.
 * <p>
 * Fournit les opérations principales liées au cycle de vie des refresh tokens :
 * <ul>
 *     <li>Création d’un nouveau refresh token lié à un utilisateur</li>
 *     <li>Vérification de la validité et de la date d’expiration</li>
 *     <li>Recherche d’un refresh token par sa valeur</li>
 * </ul>
 * <p>
 * Les refresh tokens sont utilisés pour prolonger la session d’un utilisateur
 * sans qu’il ait besoin de se reconnecter avec ses identifiants.
 */
@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    /**
     * Crée et enregistre un nouveau refresh token pour un utilisateur donné.
     * <p>
     * Le token est généré sous forme d’UUID aléatoire et possède une durée de vie
     * par défaut de 7 jours.
     *
     * @param user l’utilisateur auquel le refresh token est associé
     * @return le refresh token nouvellement créé et persisté
     */
    public RefreshToken createRefreshToken(User user) {
        var refreshToken = new RefreshToken();
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setUser(user);
        refreshToken.setExpiryDate(LocalDateTime.now().plusDays(7));
        return refreshTokenRepository.save(refreshToken);
    }

    /**
     * Vérifie si le refresh token est encore valide.
     * <p>
     * Si le token est expiré, il est supprimé de la base et une exception est levée.
     *
     * @param token le refresh token à vérifier
     * @return le refresh token s’il est encore valide
     * @throws RuntimeException si le token est expiré
     */
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(token);
            throw new RefreshTokenExpiredException("Veuillez vous reconnecter");
        }
        return token;
    }

    /**
     * Recherche un refresh token dans la base de données en utilisant sa valeur brute.
     *
     * @param token la valeur du refresh token
     * @return un {@link Optional} contenant le refresh token s’il existe,
     *         ou vide si aucun token ne correspond
     */
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }
}
