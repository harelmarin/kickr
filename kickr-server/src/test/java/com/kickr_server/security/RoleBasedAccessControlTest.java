package com.kickr_server.security;

import com.kickr_server.auth.AuthService;
import com.kickr_server.dto.Auth.AuthRequest;
import com.kickr_server.dto.Auth.AuthResponse;
import com.kickr_server.user.Role;
import com.kickr_server.user.User;
import com.kickr_server.user.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests de sécurité pour vérifier les contrôles d'accès basés sur les rôles.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class RoleBasedAccessControlTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    private String userToken;
    private String adminToken;

    @BeforeEach
    void setUp() {
        // Créer un utilisateur standard
        User user = new User();
        user.setName("testuser");
        user.setEmail("user@test.com");
        user.setPassword(passwordEncoder.encode("Password123"));
        user.setRole(Role.USER);
        userService.save(user);

        // Créer un administrateur
        User admin = new User();
        admin.setName("testadmin");
        admin.setEmail("admin@test.com");
        admin.setPassword(passwordEncoder.encode("AdminPass123"));
        admin.setRole(Role.ADMIN);
        userService.save(admin);

        // Obtenir les tokens JWT
        AuthResponse userAuth = authService.authenticate(new AuthRequest("testuser", "Password123"));
        AuthResponse adminAuth = authService.authenticate(new AuthRequest("testadmin", "AdminPass123"));

        userToken = userAuth.token();
        adminToken = adminAuth.token();
    }

    @Test
    @DisplayName("USER ne peut pas accéder aux endpoints admin")
    void testUserCannotAccessAdminEndpoints() throws Exception {
        mockMvc.perform(get("/api/admin/users")
                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("ADMIN peut accéder aux endpoints admin")
    void testAdminCanAccessAdminEndpoints() throws Exception {
        mockMvc.perform(get("/api/admin/users")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Requête sans token est rejetée pour les endpoints protégés")
    void testUnauthenticatedRequestIsRejected() throws Exception {
        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Token invalide est rejeté")
    void testInvalidTokenIsRejected() throws Exception {
        mockMvc.perform(get("/api/admin/users")
                .header("Authorization", "Bearer invalid_token"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("USER peut accéder aux endpoints publics")
    void testUserCanAccessPublicEndpoints() throws Exception {
        mockMvc.perform(get("/api/users")
                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Endpoints publics sont accessibles sans authentification")
    void testPublicEndpointsAreAccessibleWithoutAuth() throws Exception {
        mockMvc.perform(get("/api/teams"))
                .andExpect(status().isOk());
    }
}
