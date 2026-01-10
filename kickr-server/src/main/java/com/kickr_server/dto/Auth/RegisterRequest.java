package com.kickr_server.dto.Auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Le nom est obligatoire") @Size(min = 3, max = 10, message = "Le nom doit contenir entre 3 et 10 caractères") String name,

        @Email(message = "Email invalide") @NotBlank(message = "Email obligatoire") @Size(max = 100, message = "L'email est trop long") String email,

        @NotBlank(message = "Mot de passe obligatoire") @Size(max = 128, message = "Le mot de passe est trop long") @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$", message = "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre") String password) {
}
