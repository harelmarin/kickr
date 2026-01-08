package com.kickr_server.security;

import com.kickr_server.auth.jwt.JwtService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests de sécurité pour le service JWT.
 */
@SpringBootTest
@ActiveProfiles("test")
public class JwtSecurityTest {

    @Autowired
    private JwtService jwtService;

    @Test
    @DisplayName("Token JWT valide peut être généré et validé")
    void testValidTokenGeneration() {
        String email = "test@example.com";
        String token = jwtService.generateToken(email);

        assertNotNull(token);
        assertDoesNotThrow(() -> jwtService.validateToken(token));
        assertEquals(email, jwtService.extractUsername(token));
    }

    @Test
    @DisplayName("Token JWT invalide est rejeté")
    void testInvalidTokenIsRejected() {
        String invalidToken = "invalid.token.here";

        assertThrows(Exception.class, () -> jwtService.validateToken(invalidToken));
    }

    @Test
    @DisplayName("Token JWT vide est rejeté")
    void testEmptyTokenIsRejected() {
        assertThrows(Exception.class, () -> jwtService.validateToken(""));
    }

    @Test
    @DisplayName("Token JWT null est rejeté")
    void testNullTokenIsRejected() {
        assertThrows(Exception.class, () -> jwtService.validateToken(null));
    }

    @Test
    @DisplayName("Email peut être extrait du token")
    void testEmailExtractionFromToken() {
        String email = "user@test.com";
        String token = jwtService.generateToken(email);

        String extractedEmail = jwtService.extractUsername(token);
        assertEquals(email, extractedEmail);
    }
}
