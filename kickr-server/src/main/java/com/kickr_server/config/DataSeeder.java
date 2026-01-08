package com.kickr_server.config;

import com.kickr_server.user.Role;
import com.kickr_server.user.User;
import com.kickr_server.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Configuration pour initialiser les données de base au démarrage de
 * l'application.
 * Équivalent d'un seed.ts en NestJS.
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataSeeder {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner seedDatabase() {
        return args -> {
            log.info("🌱 Starting database seeding...");

            // Créer l'admin par défaut s'il n'existe pas
            if (!userRepository.existsByEmail("admin@kickr.com")) {
                User admin = new User();
                admin.setName("admin");
                admin.setEmail("admin@kickr.com");
                admin.setPassword(passwordEncoder.encode("Marin1812"));
                admin.setRole(Role.ADMIN);

                userRepository.save(admin);
                log.info("✅ Admin user created: admin@kickr.com");
            } else {
                log.info("ℹ️  Admin user already exists");
            }

            // Tu peux ajouter d'autres données ici
            // Exemple : créer des utilisateurs de test, des matchs, etc.

            log.info("🎉 Database seeding completed!");
        };
    }
}
