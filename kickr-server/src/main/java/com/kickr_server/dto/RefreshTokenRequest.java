package com.kickr_server.dto;

/**
 * Requête envoyée par le frontend pour renouveler un access token.
 * <p>
 * Le client doit fournir un refresh token valide, obtenu lors de l’authentification initiale.
 * </p>
 */
public record RefreshTokenRequest(
        String refreshToken
) { }
