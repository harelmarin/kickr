package com.kickr_server.dto.generic;

import java.time.LocalDateTime;

/**
 * Enveloppe générique pour toutes les réponses de l'API.
 *
 * @param <T> type du payload (données)
 */
public record ApiResponseDto<T>(
        String status,         // SUCCESS, ERROR, etc.
        String message,        // message descriptif
        T data,                // payload (par ex. AuthResponse)
        LocalDateTime timestamp
) {
    public static <T> ApiResponseDto<T> success(String message, T data) {
        return new ApiResponseDto<>("SUCCESS", message, data, LocalDateTime.now());
    }

    public static <T> ApiResponseDto<T> error(String message, T data) {
        return new ApiResponseDto<>("ERROR", message, data, LocalDateTime.now());
    }
}
