package com.kickr_server.dev;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utilitaire pour générer des hash BCrypt.
 * Utilisé pour créer des mots de passe hashés pour les utilisateurs.
 */
public class PasswordHashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String password = "Marin1812";
        String hash = encoder.encode(password);

        System.out.println("Password: " + password);
        System.out.println("BCrypt Hash: " + hash);
        System.out.println();
        System.out.println("SQL pour mettre à jour l'admin:");
        System.out.println("UPDATE users SET password = '" + hash + "' WHERE email = 'admin@kickr.com';");
    }
}
