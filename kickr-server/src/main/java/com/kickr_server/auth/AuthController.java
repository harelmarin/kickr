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
import com.kickr_server.utils.CookieUtils;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final CookieUtils cookieUtils;

    @Operation(summary = "Authenticate a user and retrieve JWT + DTO")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Authentication successful"),
            @ApiResponse(responseCode = "401", description = "Invalid email or password")
    })
    @RateLimiter(name = "authRateLimiter")
    @PostMapping("/login")
    public ApiResponseDto<UserDto> login(@Valid @RequestBody AuthRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.authenticate(request);

        // Set HttpOnly Cookies
        cookieUtils.createHttpOnlyCookie(response, CookieUtils.ACCESS_TOKEN_COOKIE_NAME, authResponse.token(),
                15 * 60); // 15 mins
        cookieUtils.createHttpOnlyCookie(response, CookieUtils.REFRESH_TOKEN_COOKIE_NAME, authResponse.refreshToken(),
                7 * 24 * 60 * 60); // 7 days

        return ApiResponseDto.success("Authentication successful", authResponse.user());
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
    public ApiResponseDto<Void> refresh(
            @CookieValue(name = CookieUtils.REFRESH_TOKEN_COOKIE_NAME, required = false) String refreshToken,
            HttpServletResponse response) {
        if (refreshToken == null) {
            throw new RuntimeException("Refresh token is missing");
        }
        RefreshTokenResponse tokenResponse = authService.refreshAccessToken(refreshToken);

        // Update Cookies
        cookieUtils.createHttpOnlyCookie(response, CookieUtils.ACCESS_TOKEN_COOKIE_NAME, tokenResponse.accessToken(),
                15 * 60);
        cookieUtils.createHttpOnlyCookie(response, CookieUtils.REFRESH_TOKEN_COOKIE_NAME, tokenResponse.refreshToken(),
                7 * 24 * 60 * 60);

        return ApiResponseDto.success("Token refreshed", null);
    }

    @Operation(summary = "Logout user, revoke refresh token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Refresh token revoked"),
            @ApiResponse(responseCode = "404", description = "Refresh token not found")
    })
    @RateLimiter(name = "authRateLimiter")
    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ApiResponseDto<Void> logout(
            @CookieValue(name = CookieUtils.REFRESH_TOKEN_COOKIE_NAME, required = false) String refreshToken,
            HttpServletResponse response) {
        if (refreshToken != null) {
            authService.logout(refreshToken);
        }
        cookieUtils.clearCookie(response, CookieUtils.ACCESS_TOKEN_COOKIE_NAME);
        cookieUtils.clearCookie(response, CookieUtils.REFRESH_TOKEN_COOKIE_NAME);

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
