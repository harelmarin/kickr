package com.kickr_server.auth.refreshToken;

import com.kickr_server.dto.RefreshTokenResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository Spring Data JPA pour gérer les Refresh Tokens.
 * <p>
 * Fournit les opérations CRUD de base ainsi que
 * la recherche d’un refresh token par sa valeur.
 */
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    /**
     * Recherche un refresh token par sa valeur brute (chaîne).
     *
     * @param token la valeur du refresh token
     * @return un {@link Optional} contenant le refresh token s’il existe,
     *         ou vide sinon
     */
    Optional<RefreshToken> findByToken(String token);
}
