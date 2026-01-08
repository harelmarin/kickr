package com.kickr_server.exception;

import com.kickr_server.dto.generic.ApiResponseDto;
import com.kickr_server.exception.auth.InvalidCredentialsException;
import com.kickr_server.exception.auth.JwtTokenException;
import com.kickr_server.exception.auth.LogOutException;
import com.kickr_server.exception.auth.RefreshTokenExpiredException;
import com.kickr_server.exception.follow.FollowerNotFoundException;
import com.kickr_server.exception.follow.FollowedNotFoundException;
import com.kickr_server.exception.match.MatchNotFoundException;
import com.kickr_server.exception.user.UserAlreadyExistException;
import com.kickr_server.exception.user.UserNotFoundException;
import com.kickr_server.exception.userMatch.IllegalCommentLengthException;
import com.kickr_server.exception.userMatch.IllegalMatchNoteException;
import com.kickr_server.exception.userMatch.UserMatchNotFoundException;
import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Gestionnaire global des exceptions pour l'application.
 *
 * <p>
 * Ce composant intercepte toutes les exceptions lancées depuis les contrôleurs
 * et renvoie une réponse HTTP standardisée sous forme de JSON. Chaque réponse
 * contient :
 * <ul>
 * <li>Le code HTTP correspondant</li>
 * <li>Le type d'erreur (nom du statut)</li>
 * <li>Un message explicite destiné à l'utilisateur</li>
 * <li>Un timestamp de l'événement</li>
 * </ul>
 * </p>
 *
 * <p>
 * Les exceptions gérées incluent :
 * <ul>
 * <li>Exceptions générales et inattendues</li>
 * <li>Exceptions liées aux utilisateurs (création, existence, non trouvé)</li>
 * <li>Exceptions liées à l'authentification et aux tokens</li>
 * <li>Exceptions liées aux suivis (follow/unfollow)</li>
 * <li>Exceptions liées aux matchs et évaluations de matchs</li>
 * <li>Exceptions de validation des DTO avec @Valid</li>
 * </ul>
 * </p>
 *
 * <p>
 * Exemple de format JSON renvoyé pour une exception :
 * 
 * <pre>
 * {
 *   "status": 404,
 *   "error": "Not Found",
 *   "message": "Utilisateur introuvable : id inconnu",
 *   "timestamp": "2025-10-03T10:00:00"
 * }
 * </pre>
 * </p>
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private <T> ResponseEntity<ApiResponseDto<T>> buildError(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(ApiResponseDto.error(message, null));
    }

    // ---------------------- USER EXCEPTIONS ----------------------

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponseDto<Void>> handleGeneralException(Exception ex) {
        // Logger l'exception complète pour le debugging (avec stack trace)
        org.slf4j.LoggerFactory.getLogger(GlobalExceptionHandler.class)
                .error("Unexpected error occurred", ex);

        // Retourner un message générique à l'utilisateur (ne pas exposer les détails
        // techniques)
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred. Please try again later.");
    }

    @ExceptionHandler(UserAlreadyExistException.class)
    public ResponseEntity<ApiResponseDto<Void>> handleUserAlreadyExist(UserAlreadyExistException ex) {
        return buildError(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiResponseDto<Void>> handleUserNotFound(UserNotFoundException ex) {
        return buildError(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // ---------------------- AUTH EXCEPTIONS ----------------------

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ApiResponseDto<Void>> handleInvalidCredentials(InvalidCredentialsException ex) {
        return buildError(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(JwtTokenException.class)
    public ResponseEntity<ApiResponseDto<Void>> handleJwtToken(JwtTokenException ex) {
        return buildError(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(RefreshTokenExpiredException.class)
    public ResponseEntity<ApiResponseDto<Void>> handleRefreshTokenExpired(RefreshTokenExpiredException ex) {
        return buildError(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(LogOutException.class)
    public ResponseEntity<ApiResponseDto<Void>> handleLogOut(LogOutException ex) {
        return buildError(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    // ---------------------- FOLLOW EXCEPTIONS ----------------------

    @ExceptionHandler(FollowerNotFoundException.class)
    public ResponseEntity<ApiResponseDto<Void>> handleFollowerNotFound(FollowerNotFoundException ex) {
        return buildError(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(FollowedNotFoundException.class)
    public ResponseEntity<ApiResponseDto<Void>> handleFollowedNotFound(FollowedNotFoundException ex) {
        return buildError(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // ---------------------- MATCH EXCEPTIONS ----------------------

    @ExceptionHandler(MatchNotFoundException.class)
    public ResponseEntity<ApiResponseDto<Void>> handleMatchNotFound(MatchNotFoundException ex) {
        return buildError(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // ---------------------- USERMATCH EXCEPTIONS ----------------------

    @ExceptionHandler(UserMatchNotFoundException.class)
    public ResponseEntity<ApiResponseDto<Void>> handleUserMatchNotFound(UserMatchNotFoundException ex) {
        return buildError(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(IllegalMatchNoteException.class)
    public ResponseEntity<ApiResponseDto<Void>> handleIllegalMatchNote(IllegalMatchNoteException ex) {
        return buildError(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(IllegalCommentLengthException.class)
    public ResponseEntity<ApiResponseDto<Void>> handleIllegalCommentLength(IllegalCommentLengthException ex) {
        return buildError(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    // ---------------------- ERROR 429 RATE LIMIT----------------------

    @ExceptionHandler(RequestNotPermitted.class)
    public ResponseEntity<String> handleRateLimit(RequestNotPermitted ex) {
        return ResponseEntity
                .status(HttpStatus.TOO_MANY_REQUESTS)
                .body("Too many requests, please try again later");
    }

    // ---------------------- VALIDATION EXCEPTIONS ----------------------

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponseDto<Void>> handleValidationException(MethodArgumentNotValidException ex) {
        StringBuilder sb = new StringBuilder();
        ex.getBindingResult().getFieldErrors()
                .forEach(fe -> sb.append(fe.getField()).append(": ").append(fe.getDefaultMessage()).append("; "));
        return buildError(HttpStatus.BAD_REQUEST, sb.toString());
    }
}
