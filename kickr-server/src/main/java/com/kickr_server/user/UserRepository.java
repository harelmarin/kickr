package com.kickr_server.user;

import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

/**
 * Repository JPA pour l'entité {@link User}.
 * <p>
 * Fournit des méthodes pour interagir avec la base de données
 * (CRUD, vérifications d'existence et recherches spécifiques).
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

        /**
         * Vérifie si un utilisateur existe avec l'email donné.
         *
         * @param email l'email à vérifier
         * @return {@code true} si un utilisateur avec cet email existe, {@code false}
         *         sinon
         */
        boolean existsByEmail(String email);

        /**
         * Vérifie si un utilisateur existe avec le nom donné.
         *
         * @param name le nom à vérifier
         * @return {@code true} si un utilisateur avec ce nom existe, {@code false}
         *         sinon
         */
        boolean existsByName(String name);

        /**
         * Vérifie si un utilisateur existe avec l'UUID donné.
         *
         * @param id l'identifiant UUID à vérifier (non null)
         * @return {@code true} si un utilisateur avec cet id existe, {@code false}
         *         sinon
         */
        boolean existsById(@NonNull UUID id);

        /**
         * Recherche un utilisateur par son email.
         *
         * @param email l'email de l'utilisateur
         * @return un {@link Optional} contenant l'utilisateur si trouvé, vide sinon
         */
        Optional<User> findByEmail(String email);

        /**
         * Recherche un utilisateur par son nom.
         *
         * @param name le nom de l'utilisateur
         * @return un {@link Optional} contenant l'utilisateur si trouvé, vide sinon
         */
        Optional<User> findByName(String name);

        /**
         * Searches for users whose name or email contains the given query string
         * (case-insensitive).
         *
         * @param query the search query
         * @return a list of users matching the query
         */
        List<User> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String query, String emailQuery);

        /**
         * Supprime un utilisateur par son identifiant UUID.
         *
         * @param id l'UUID de l'utilisateur à supprimer (non null)
         */
        void deleteById(@NonNull UUID id);

        Page<User> findAll(Pageable pageable);
}
