package com.kickr_server.auth;

import com.kickr_server.dto.User.UserDto;
import com.kickr_server.dto.Auth.AuthRequest;
import com.kickr_server.dto.Auth.AuthResponse;
import com.kickr_server.dto.Auth.RefreshTokenRequest;
import com.kickr_server.dto.Auth.RefreshTokenResponse;
import com.kickr_server.dto.Auth.RegisterRequest;
import com.kickr_server.dto.generic.ApiResponseDto;
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
    public ApiResponseDto<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse authResponse = authService.authenticate(request);
        return ApiResponseDto.success("Connexion réussi", authResponse);
    }

    @Operation(summary = "Créer un nouvel utilisateur")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Utilisateur créé"),
            @ApiResponse(responseCode = "400", description = "Données invalides")
    })
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponseDto<UserDto> register(@Valid @RequestBody RegisterRequest request) {
        var user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(request.password());
        UserDto userDto = authService.register(user);
        return ApiResponseDto.success("Inscription réussie", userDto);
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
    public ApiResponseDto<Void> logout(@RequestBody RefreshTokenRequest request) {
        authService.logout(request.refreshToken());
        return ApiResponseDto.success("Déconnexion réussie", null);
    }

}
