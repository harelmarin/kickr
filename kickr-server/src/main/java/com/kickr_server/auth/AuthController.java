package com.kickr_server.auth;

import com.kickr_server.dto.UserDto;
import com.kickr_server.dto.AuthRequest;
import com.kickr_server.dto.AuthResponse;
import com.kickr_server.dto.RefreshTokenRequest;
import com.kickr_server.dto.RefreshTokenResponse;
import com.kickr_server.dto.RegisterRequest;
import com.kickr_server.user.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Authentifier un utilisateur et récupérer JWT + DTO")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Authentification réussie"),
            @ApiResponse(responseCode = "401", description = "Email ou mot de passe invalide")
    })
    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        return authService.authenticate(request);
    }

    @Operation(summary = "Créer un nouvel utilisateur")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Utilisateur créé"),
            @ApiResponse(responseCode = "400", description = "Données invalides")
    })
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserDto register(@Valid @RequestBody RegisterRequest request) {
        var user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(request.password());
        return authService.register(user);
    }


    @Operation(summary = "Régénérer un access token à partir d’un refresh token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Nouveau access token généré"),
            @ApiResponse(responseCode = "401", description = "Refresh token invalide ou expiré")
    })
    @PostMapping("/refresh")
    public RefreshTokenResponse refresh(@RequestBody RefreshTokenRequest request) {
        return authService.refreshAccessToken(request.refreshToken());
    }

    @Operation(summary = "Déconnexion d'un utilisateur, révoque le refresh token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Refresh token révoqué"),
            @ApiResponse(responseCode = "404", description = "Refresh token non trouvé")
    })
    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@RequestBody RefreshTokenRequest request) {
        authService.logout(request.refreshToken());
    }

}
