package com.kickr_server.auth;

import com.kickr_server.dto.User.UserDto;
import com.kickr_server.dto.Auth.AuthRequest;
import com.kickr_server.dto.Auth.AuthResponse;
import com.kickr_server.dto.Auth.RefreshTokenRequest;
import com.kickr_server.dto.Auth.RefreshTokenResponse;
import com.kickr_server.dto.Auth.RegisterRequest;
import com.kickr_server.dto.Auth.ForgotPasswordRequest;
import com.kickr_server.dto.Auth.ResetPasswordRequest;
import com.kickr_server.dto.generic.ApiResponseDto;
import com.kickr_server.user.User;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
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

    @Operation(summary = "Authenticate a user and retrieve JWT + DTO")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Authentication successful"),
            @ApiResponse(responseCode = "401", description = "Invalid email or password")
    })
    @RateLimiter(name = "authRateLimiter")
    @PostMapping("/login")
    public ApiResponseDto<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse authResponse = authService.authenticate(request);
        return ApiResponseDto.success("Authentication successful", authResponse);
    }

    @Operation(summary = "Create a new user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User created"),
            @ApiResponse(responseCode = "400", description = "Invalid data")
    })
    @RateLimiter(name = "authRateLimiter")
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponseDto<UserDto> register(@Valid @RequestBody RegisterRequest request) {
        var user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(request.password());
        UserDto userDto = authService.register(user);
        return ApiResponseDto.success("Registration successful", userDto);
    }

    @Operation(summary = "Regenerate an access token from a refresh token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "New access token generated"),
            @ApiResponse(responseCode = "401", description = "Invalid or expired refresh token")
    })
    @RateLimiter(name = "authRateLimiter")
    @PostMapping("/refresh")
    public RefreshTokenResponse refresh(@RequestBody RefreshTokenRequest request) {
        return authService.refreshAccessToken(request.refreshToken());
    }

    @Operation(summary = "Logout user, revoke refresh token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Refresh token revoked"),
            @ApiResponse(responseCode = "404", description = "Refresh token not found")
    })
    @RateLimiter(name = "authRateLimiter")
    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ApiResponseDto<Void> logout(@RequestBody RefreshTokenRequest request) {
        authService.logout(request.refreshToken());
        return ApiResponseDto.success("Logout successful", null);
    }

    @Operation(summary = "Initiate password reset process")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "If email exists, reset link has been sent")
    })
    @RateLimiter(name = "authRateLimiter")
    @PostMapping("/forgot-password")
    public ApiResponseDto<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.initiatePasswordReset(request.email());
        return ApiResponseDto.success("If an account exists for this email, you will receive a reset link shortly",
                null);
    }

    @Operation(summary = "Reset password using token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Password reset successful"),
            @ApiResponse(responseCode = "400", description = "Invalid or expired token")
    })
    @RateLimiter(name = "authRateLimiter")
    @PostMapping("/reset-password")
    public ApiResponseDto<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            authService.resetPassword(request.token(), request.newPassword());
            return ApiResponseDto.success("Your password has been reset successfully", null);
        } catch (RuntimeException e) {
            return ApiResponseDto.error(e.getMessage());
        }
    }
}
