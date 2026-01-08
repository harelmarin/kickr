package com.kickr_server.user;

/**
 * Énumération des rôles disponibles dans l'application.
 * <p>
 * Utilisé pour contrôler les autorisations et l'accès aux ressources.
 */
public enum Role {
    /**
     * Utilisateur standard avec accès aux fonctionnalités de base.
     */
    USER,

    /**
     * Administrateur avec accès complet à toutes les fonctionnalités.
     */
    ADMIN
}
