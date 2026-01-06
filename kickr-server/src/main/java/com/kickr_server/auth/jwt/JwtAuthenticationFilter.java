package com.kickr_server.auth.jwt;

import com.kickr_server.exception.auth.JwtTokenException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Filtre JWT exécuté une fois par requête HTTP.
 *
 * <p>
 * Ce filtre intercepte les requêtes entrantes et :
 * </p>
 * <ul>
 * <li>Extrait le token JWT de l'en-tête "Authorization".</li>
 * <li>Valide le token via {@link JwtService}.</li>
 * <li>Si valide, authentifie l'utilisateur dans le
 * {@link SecurityContextHolder}.</li>
 * <li>Si invalide, renvoie une réponse HTTP 401 (Unauthorized).</li>
 * </ul>
 *
 * <p>
 * Permet de sécuriser les endpoints en s'assurant que seul un utilisateur
 * authentifié peut y accéder.
 * </p>
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    /**
     * Intercepte chaque requête HTTP pour vérifier le JWT.
     *
     * @param request     La requête HTTP entrante.
     * @param response    La réponse HTTP sortante.
     * @param filterChain La chaîne de filtres à exécuter après ce filtre.
     * @throws ServletException En cas d'erreur de servlet.
     * @throws IOException      En cas d'erreur d'entrée/sortie.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, @NotNull HttpServletResponse response,
            @NotNull FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                jwtService.validateToken(token);
                String email = jwtService.extractUsername(token);

                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        email, null, List.of() // rôles si nécessaire
                );
                SecurityContextHolder.getContext().setAuthentication(auth);

            } catch (JwtTokenException e) {
                // Si le token est invalide, on ne définit pas l'authentification
                // mais on laisse la requête continuer pour que SecurityFilterChain
                // décide si l'accès est autorisé ou non (cas des routes publiques).
            }
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return path.startsWith("/api/auth") ||
                path.startsWith("/v3/api-docs") ||
                path.startsWith("/swagger-ui") ||
                path.startsWith("/swagger-resources") ||
                path.startsWith("/webjars");
    }

}
