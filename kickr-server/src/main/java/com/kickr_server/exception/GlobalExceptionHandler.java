package com.kickr_server.exception;

import com.kickr_server.exception.auth.InvalidCredentialsException;
import com.kickr_server.exception.auth.JwtTokenException;
import com.kickr_server.exception.auth.RefreshTokenExpiredException;


import com.kickr_server.exception.user.UserAlreadyExistException;
import com.kickr_server.exception.user.UserNotFoundException;
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
 * Intercepte les exceptions lancées dans les contrôleurs et renvoie
 * des réponses JSON avec un message explicite, un code HTTP et un timestamp.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

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
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                "Une erreur inattendue est survenue : " + ex.getMessage());
    }

    @ExceptionHandler(UserAlreadyExistException.class)
    public ResponseEntity<Map<String, Object>> handleUserAlreadyExist(UserAlreadyExistException ex) {
        return buildResponse(HttpStatus.CONFLICT,
                "Création impossible : cet utilisateur existe déjà. " + ex.getMessage());
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleUserNotFound(UserNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND,
                "Utilisateur introuvable : " + ex.getMessage());
    }

    // ---------------------- AUTH EXCEPTIONS ----------------------

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidCredentials(InvalidCredentialsException ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED,
                "Authentification échouée : identifiants incorrects. " + ex.getMessage());
    }

    @ExceptionHandler(JwtTokenException.class)
    public ResponseEntity<Map<String, Object>> handleJwtToken(JwtTokenException ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED,
                "Token invalide ou expiré. Veuillez vous reconnecter. " + ex.getMessage());
    }

    @ExceptionHandler(RefreshTokenExpiredException.class)
    public ResponseEntity<Map<String, Object>> handleRefreshTokenExpired(RefreshTokenExpiredException ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED,
                "Veuillez vous reconnecter. " + ex.getMessage());
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
