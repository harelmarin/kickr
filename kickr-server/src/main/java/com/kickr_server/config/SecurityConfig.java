package com.kickr_server.config;

import com.kickr_server.auth.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.http.HttpStatus;

/**
 * Configuration de la sécurité de l'application.
 *
 * - Définit les règles de sécurité HTTP (routes publiques / privées).
 * - Configure la gestion des sessions en mode stateless (JWT).
 * - Fournit un encodeur de mots de passe sécurisé (BCrypt).
 * - Expose l'AuthenticationManager pour l'authentification des utilisateurs.
 */
@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
        private final JwtAuthenticationFilter jwtAuthenticationFilter;

        /**
         * Définit la chaîne de filtres de sécurité de Spring Security.
         *
         * <ul>
         * <li>Désactive la protection CSRF (inutile pour une API REST stateless).</li>
         * <li>Autorise l'accès libre aux endpoints commençant par
         * <code>/api/auth/**</code>
         * (par ex. login, register).</li>
         * <li>Exige une authentification pour toutes les autres requêtes.</li>
         * <li>Configure la gestion des sessions en mode <b>STATELESS</b>,
         * adapté à une authentification par token (JWT).</li>
         * </ul>
         *
         * @param http la configuration de sécurité HTTP
         * @return la chaîne de filtres de sécurité
         * @throws Exception si une erreur survient lors de la configuration
         */
        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .csrf(AbstractHttpConfigurer::disable)
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/api/auth/**").permitAll()
                                                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**",
                                                                "/swagger-ui.html",
                                                                "/swagger-ui/index.html")
                                                .permitAll()
                                                .requestMatchers("/actuator/**").permitAll()
                                                .requestMatchers("/", "/favicon.ico", "/error").permitAll()
                                                // Public Read access to data
                                                .requestMatchers(org.springframework.http.HttpMethod.GET,
                                                                "/api/matchs/next",
                                                                "/api/matchs/search", "/api/matchs/{id:[0-9]+}",
                                                                "/api/matchs/team/**")
                                                .permitAll()
                                                .requestMatchers(org.springframework.http.HttpMethod.GET,
                                                                "/api/teams/**")
                                                .permitAll()
                                                .requestMatchers(org.springframework.http.HttpMethod.GET,
                                                                "/api/competitions/**")
                                                .permitAll()
                                                .requestMatchers(org.springframework.http.HttpMethod.GET,
                                                                "/api/search/**")
                                                .permitAll()
                                                .requestMatchers(org.springframework.http.HttpMethod.GET,
                                                                "/api/user_match/latest")
                                                .permitAll()
                                                .requestMatchers(org.springframework.http.HttpMethod.GET,
                                                                "/api/user_match/match/**")
                                                .permitAll()
                                                .requestMatchers(org.springframework.http.HttpMethod.GET,
                                                                "/api/user_match/user/**")
                                                .permitAll()
                                                .requestMatchers(org.springframework.http.HttpMethod.GET,
                                                                "/api/feed/global")
                                                .permitAll()
                                                .requestMatchers(org.springframework.http.HttpMethod.GET,
                                                                "/api/users/**")
                                                .permitAll()
                                                .requestMatchers(org.springframework.http.HttpMethod.GET,
                                                                "/api/follows/following/**",
                                                                "/api/follows/followers/**")
                                                .permitAll()
                                                // Admin endpoints - require ADMIN role
                                                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                                                .anyRequest().authenticated())
                                .exceptionHandling(exceptions -> exceptions
                                                .authenticationEntryPoint(
                                                                new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
                                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
                org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();
                configuration.setAllowedOrigins(java.util.List.of("http://localhost:5173", "http://localhost:3000",
                                "http://127.0.0.1:5173", "http://127.0.0.1:3000")); // Vite
                // and
                // React
                // defaults
                configuration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
                configuration.setAllowedHeaders(java.util.List.of("*"));
                configuration.setAllowCredentials(true);
                org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }

        /**
         * Fournit un encodeur de mots de passe basé sur l'algorithme <b>BCrypt</b>.
         *
         * <p>
         * BCrypt est un algorithme de hachage fort et sécurisé, recommandé pour
         * le stockage des mots de passe. Chaque mot de passe enregistré en base
         * sera automatiquement haché avec un salt aléatoire.
         * </p>
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
         * <p>
         * L'AuthenticationManager est responsable de la logique d'authentification
         * (vérification du mot de passe, récupération de l'utilisateur, etc.).
         * Il est utilisé notamment lors de la connexion pour valider les identifiants.
         * </p>
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
