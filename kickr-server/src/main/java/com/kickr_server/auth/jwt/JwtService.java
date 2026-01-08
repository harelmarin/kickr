package com.kickr_server.auth.jwt;

import com.kickr_server.exception.auth.JwtTokenException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

/**
 * Service pour la génération, validation et extraction des informations JWT.
 * <p>
 * La clé secrète est récupérée depuis une variable d'environnement nommée
 * JWT_SECRET.
 * Algorithme utilisé : HS512.
 */
@Service
public class JwtService {

    private final Key secretKey;

    public JwtService(@Value("${jwt.secret}") String secret) {
        if (secret == null || secret.isEmpty()) {
            throw new IllegalStateException("La variable d'environnement JWT_SECRET n'est pas définie !");
        }
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
    }

    /**
     * Génère un token JWT pour un utilisateur identifié par son email.
     *
     * @param email l'email de l'utilisateur
     * @return le token JWT signé
     */
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 15)) // 15 minutes
                .signWith(secretKey, SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * Valide un token JWT.
     *
     * @param token le token à valider
     * @return true si le token est valide, false sinon
     */
    public void validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            throw new JwtTokenException("Session expired, please log in again");
        } catch (Exception e) {
            throw new JwtTokenException("Invalid token, please log in again");
        }
    }

    /**
     * Extrait l'email (username) depuis le token JWT.
     *
     * @param token le token JWT
     * @return l'email contenu dans le claim "subject"
     */
    public String extractUsername(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }
}
