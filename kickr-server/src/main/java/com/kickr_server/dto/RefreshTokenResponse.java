package com.kickr_server.dto;

/**
 * Réponse envoyée par l’API lors d’un renouvellement de token.
 * <p>
 * Contient le nouveau jeton d’accès (access token) ainsi que
 * le refresh token (inchangé ou régénéré selon la stratégie choisie).
 * </p>
 */
public record RefreshTokenResponse(
        String accessToken,
        String refreshToken
) { }
