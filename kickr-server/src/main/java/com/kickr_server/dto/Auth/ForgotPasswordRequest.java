package com.kickr_server.dto.Auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ForgotPasswordRequest(
        @NotBlank(message = "L'email ne peut pas être vide") @Email(message = "L'email doit être valide") String email) {
}
