package com.kickr_server.dto.Auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AuthRequest(
        @NotBlank(message = "L'email est obligatoire") @Size(max = 100, message = "Email trop long") String username,

        @NotBlank(message = "Le mot de passe est obligatoire") @Size(max = 128, message = "Mot de passe trop long") String password) {
}
