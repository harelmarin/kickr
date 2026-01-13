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
import org.springframework.beans.factory.annotation.Value;
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

        @Value("${server.cors.allowed-origins:http://localhost:5173}")
        private String allowedOrigins;

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
                                                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**")
                                                .permitAll()
                                                .requestMatchers("/api/auth/**").permitAll()
                                                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**",
                                                                "/swagger-ui.html",
                                                                "/swagger-ui/index.html")
                                                .permitAll()
                                                .requestMatchers("/", "/favicon.ico", "/error")
                                                .permitAll()
                                                .requestMatchers("/api/proxy/**")
                                                .permitAll()
                                                // Public Read access to data
                                                .requestMatchers(org.springframework.http.HttpMethod.GET,
                                                                "/api/matchs/**",
                                                                "/api/teams/**",
                                                                "/api/competitions/**",
                                                                "/api/search/**",
                                                                "/api/user_match/**",
                                                                "/api/feed/global",
                                                                "/api/users/**",
                                                                "/api/follows/following/**",
                                                                "/api/follows/followers/**")
                                                .permitAll()
                                                // Admin endpoints - require ADMIN role
                                                .requestMatchers("/api/admin/**", "/api/matchs/save",
                                                                "/api/matchs/backfill",
                                                                "/actuator/**")
                                                .hasRole("ADMIN")
                                                .anyRequest().authenticated())
                                .headers(headers -> headers
                                                .xssProtection(xss -> xss.headerValue(
                                                                org.springframework.security.web.header.writers.XXssProtectionHeaderWriter.HeaderValue.DISABLED))
                                                .contentSecurityPolicy(csp -> csp
                                                                .policyDirectives(
                                                                                "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://res.cloudinary.com https://media.api-sports.io *;"))
                                                .frameOptions(frame -> frame.deny())
                                                .httpStrictTransportSecurity(hsts -> hsts
                                                                .includeSubDomains(true)
                                                                .maxAgeInSeconds(31536000))) // 1 year
                                .exceptionHandling(exceptions -> exceptions
                                                .authenticationEntryPoint(
                                                                new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
                                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
                org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();

                java.util.List<String> origins = new java.util.ArrayList<>();
                if (allowedOrigins != null && !allowedOrigins.isEmpty()) {
                        origins.addAll(java.util.Arrays.asList(allowedOrigins.split(",")));
                }

                // Domains must be exact and without trailing slash
                if (!origins.contains("https://kickrhq.com"))
                        origins.add("https://kickrhq.com");
                if (!origins.contains("https://www.kickrhq.com"))
                        origins.add("https://www.kickrhq.com");
                if (!origins.contains("http://localhost:5173"))
                        origins.add("http://localhost:5173");

                configuration.setAllowedOrigins(origins);
                configuration.setAllowedMethods(
                                java.util.Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
                configuration.setAllowedHeaders(java.util.Arrays.asList("Authorization", "Content-Type",
                                "X-Requested-With", "Accept", "Origin", "Access-Control-Request-Method",
                                "Access-Control-Request-Headers"));
                configuration.setExposedHeaders(java.util.Arrays.asList("Authorization", "Link", "X-Total-Count"));
                configuration.setAllowCredentials(true);
                configuration.setMaxAge(3600L);

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
