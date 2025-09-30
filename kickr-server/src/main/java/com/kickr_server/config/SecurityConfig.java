package com.kickr_server.config;

import com.kickr_server.auth.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


/**
 * Configuration de la sécurité de l'application.
 *
 * - Définit les règles de sécurité HTTP (routes publiques / privées).
 * - Configure la gestion des sessions en mode stateless (JWT).
 * - Fournit un encodeur de mots de passe sécurisé (BCrypt).
 * - Expose l'AuthenticationManager pour l'authentification des utilisateurs.
 */
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    /**
     * Définit la chaîne de filtres de sécurité de Spring Security.
     *
     * <ul>
     *   <li>Désactive la protection CSRF (inutile pour une API REST stateless).</li>
     *   <li>Autorise l'accès libre aux endpoints commençant par <code>/api/auth/**</code>
     *       (par ex. login, register).</li>
     *   <li>Exige une authentification pour toutes les autres requêtes.</li>
     *   <li>Configure la gestion des sessions en mode <b>STATELESS</b>,
     *       adapté à une authentification par token (JWT).</li>
     * </ul>
     *
     * @param http la configuration de sécurité HTTP
     * @return la chaîne de filtres de sécurité
     * @throws Exception si une erreur survient lors de la configuration
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/**",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/swagger-ui/index.html",
                                "/swagger-resources/**",
                                "/webjars/**"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Fournit un encodeur de mots de passe basé sur l'algorithme <b>BCrypt</b>.
     *
     * <p>BCrypt est un algorithme de hachage fort et sécurisé, recommandé pour
     * le stockage des mots de passe. Chaque mot de passe enregistré en base
     * sera automatiquement haché avec un salt aléatoire.</p>
     *
     * @return un PasswordEncoder utilisant BCrypt
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Expose l'AuthenticationManager de Spring Security.
     *
     * <p>L'AuthenticationManager est responsable de la logique d'authentification
     * (vérification du mot de passe, récupération de l'utilisateur, etc.).
     * Il est utilisé notamment lors de la connexion pour valider les identifiants.</p>
     *
     * @param config la configuration d'authentification de Spring Security
     * @return l'AuthenticationManager de l'application
     * @throws Exception si une erreur survient lors de la récupération
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
