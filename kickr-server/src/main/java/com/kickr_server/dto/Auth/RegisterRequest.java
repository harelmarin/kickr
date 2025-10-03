package com.kickr_server.dto.Auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record RegisterRequest(
        @NotBlank(message = "Le nom est obligatoire")
        String name,

        @Email(message = "Email invalide")
        @NotBlank(message = "Email obligatoire")
        String email,

        @NotBlank(message = "Mot de passe obligatoire")
        @Pattern(
                regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$",
                message = "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre"
        )
        String password
) {}
