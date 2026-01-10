package com.kickr_server.dto.Auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Requête envoyée par le frontend pour renouveler un access token.
 * <p>
 * Le client doit fournir un refresh token valide, obtenu lors de
 * l’authentification initiale.
 * </p>
 */
public record RefreshTokenRequest(
                @NotBlank(message = "Le refresh token est obligatoire") @Size(max = 1024, message = "Token invalide") String refreshToken) {
}
