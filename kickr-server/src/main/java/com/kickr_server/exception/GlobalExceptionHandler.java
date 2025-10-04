package com.kickr_server.exception;

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
 *     <li>Le code HTTP correspondant</li>
 *     <li>Le type d'erreur (nom du statut)</li>
 *     <li>Un message explicite destiné à l'utilisateur</li>
 *     <li>Un timestamp de l'événement</li>
 * </ul>
 * </p>
 *
 * <p>
 * Les exceptions gérées incluent :
 * <ul>
 *     <li>Exceptions générales et inattendues</li>
 *     <li>Exceptions liées aux utilisateurs (création, existence, non trouvé)</li>
 *     <li>Exceptions liées à l'authentification et aux tokens</li>
 *     <li>Exceptions liées aux suivis (follow/unfollow)</li>
 *     <li>Exceptions liées aux matchs et évaluations de matchs</li>
 *     <li>Exceptions de validation des DTO avec @Valid</li>
 * </ul>
 * </p>
 *
 * <p>
 * Exemple de format JSON renvoyé pour une exception :
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

    /**
     * Crée une réponse JSON standardisée pour une exception donnée.
     *
     * @param status  le code HTTP de la réponse
     * @param message le message d'erreur à renvoyer
     * @return ResponseEntity contenant le corps JSON
     */
    private ResponseEntity<Map<String, Object>> buildResponse(HttpStatus status, String message) {
        Map<String, Object> body = new HashMap<>();
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        body.put("timestamp", LocalDateTime.now());
        return ResponseEntity.status(status).body(body);
    }

    // ---------------------- USER EXCEPTIONS ----------------------

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(Exception ex) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
    }

    @ExceptionHandler(UserAlreadyExistException.class)
    public ResponseEntity<Map<String, Object>> handleUserAlreadyExist(UserAlreadyExistException ex) {
        return buildResponse(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleUserNotFound(UserNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // ---------------------- AUTH EXCEPTIONS ----------------------

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidCredentials(InvalidCredentialsException ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(JwtTokenException.class)
    public ResponseEntity<Map<String, Object>> handleJwtToken(JwtTokenException ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(RefreshTokenExpiredException.class)
    public ResponseEntity<Map<String, Object>> handleRefreshTokenExpired(RefreshTokenExpiredException ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(LogOutException.class)
    public ResponseEntity<Map<String, Object>> handleLogOut(LogOutException ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED,
                ex.getMessage());
    }

    // ---------------------- FOLLOW EXCEPTIONS ----------------------

    @ExceptionHandler(FollowerNotFoundException.class)
    public ResponseEntity<Map<String, Object>> FollowerNotFoundException(FollowerNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(FollowedNotFoundException.class)
    public ResponseEntity<Map<String, Object>> FollowedNotFoundException(FollowedNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // ---------------------- MATCH EXCEPTIONS ----------------------

    @ExceptionHandler(MatchNotFoundException.class)
    public ResponseEntity<Map<String, Object>> UserMatchNotFoundException(MatchNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // ---------------------- USERMATCH EXCEPTIONS ----------------------

    @ExceptionHandler(UserMatchNotFoundException.class)
    public ResponseEntity<Map<String, Object>> UserMatchNotFoundException(UserMatchNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(IllegalMatchNoteException.class)
    public ResponseEntity<Map<String, Object>> IllegaMatchNoteException(IllegalMatchNoteException ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(IllegalCommentLengthException.class)
    public ResponseEntity<Map<String, Object>> IllegalCommentLengthException(IllegalCommentLengthException ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    // ---------------------- VALIDATION EXCEPTIONS ----------------------

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            errors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        return ResponseEntity.badRequest().body(Map.of(
                "error", "Validation Error",
                "messages", errors
        ));
    }
}
