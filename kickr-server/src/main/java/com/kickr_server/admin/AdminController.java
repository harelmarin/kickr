package com.kickr_server.admin;

import lombok.extern.slf4j.Slf4j;
import com.kickr_server.dto.User.UserDto;
import com.kickr_server.dto.UserMatch.UserMatchDto;
import com.kickr_server.dto.generic.ApiResponseDto;
import com.kickr_server.user.Role;
import com.kickr_server.user.User;
import com.kickr_server.user.UserService;
import com.kickr_server.usermatch.ReviewComment;
import com.kickr_server.usermatch.ReviewCommentService;
import com.kickr_server.usermatch.UserMatch;
import com.kickr_server.usermatch.UserMatchService;
import com.kickr_server.dto.UserMatch.ReviewCommentDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Contrôleur pour les opérations d'administration.
 * Tous les endpoints nécessitent le rôle ADMIN.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Transactional
@Slf4j
public class AdminController {

    private final UserService userService;
    private final UserMatchService userMatchService;
    private final ReviewCommentService reviewCommentService;

    @Operation(summary = "Récupérer tous les utilisateurs (ADMIN uniquement)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste des utilisateurs"),
            @ApiResponse(responseCode = "403", description = "Accès refusé - rôle ADMIN requis")
    })
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public List<UserDto> getAllUsers() {
        return userService.findAll().stream()
                .map(UserDto::fromEntity)
                .toList();
    }

    @Operation(summary = "Promouvoir un utilisateur en ADMIN")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Utilisateur promu"),
            @ApiResponse(responseCode = "403", description = "Accès refusé - rôle ADMIN requis"),
            @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé")
    })
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/users/{id}/promote")
    public ApiResponseDto<UserDto> promoteToAdmin(@PathVariable UUID id) {
        log.info("Promoting user {} to ADMIN", id);
        User user = userService.getUserById(id);
        user.setRole(Role.ADMIN);
        return ApiResponseDto.success("User promoted to ADMIN", UserDto.fromEntity(user));
    }

    @Operation(summary = "Rétrograder un ADMIN en USER")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Utilisateur rétrogradé"),
            @ApiResponse(responseCode = "403", description = "Accès refusé - rôle ADMIN requis"),
            @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé")
    })
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/users/{id}/demote")
    public ApiResponseDto<UserDto> demoteToUser(@PathVariable UUID id) {
        log.info("Demoting user {} to USER", id);
        User user = userService.getUserById(id);
        user.setRole(Role.USER);
        return ApiResponseDto.success("User demoted to USER", UserDto.fromEntity(user));
    }

    @Operation(summary = "Supprimer un utilisateur (ADMIN uniquement)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Utilisateur supprimé"),
            @ApiResponse(responseCode = "403", description = "Accès refusé - rôle ADMIN requis"),
            @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé")
    })
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/users/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ApiResponseDto<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteById(id);
        return ApiResponseDto.success("User deleted successfully", null);
    }

    @Operation(summary = "Modérer une review (ADMIN uniquement)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Review modérée"),
            @ApiResponse(responseCode = "403", description = "Accès refusé - rôle ADMIN requis"),
            @ApiResponse(responseCode = "404", description = "Review non trouvée")
    })
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/reviews/{id}/moderate")
    public ApiResponseDto<UserMatchDto> moderateReview(@PathVariable UUID id) {
        UserMatch moderated = userMatchService.moderate(id);
        return ApiResponseDto.success("Review moderated successfully", UserMatchDto.fromEntity(moderated));
    }

    @Operation(summary = "Modérer un commentaire (ADMIN uniquement)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Commentaire modéré"),
            @ApiResponse(responseCode = "403", description = "Accès refusé - rôle ADMIN requis"),
            @ApiResponse(responseCode = "404", description = "Commentaire non trouvé")
    })
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/comments/{id}/moderate")
    public ApiResponseDto<ReviewCommentDto> moderateComment(@PathVariable UUID id) {
        ReviewComment moderated = reviewCommentService.moderate(id);
        return ApiResponseDto.success("Comment moderated successfully", ReviewCommentDto.fromEntity(moderated));
    }
}
