package com.kickr_server.usermatch;

import com.kickr_server.dto.UserMatch.UserMatchDto;
import com.kickr_server.dto.UserMatch.UserMatchFullDto;
import com.kickr_server.dto.UserMatch.UserMatchUpdateDto;
import com.kickr_server.dto.generic.ApiResponseDto;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/user_match")
@RequiredArgsConstructor
public class UserMatchController {

        private final UserMatchService userMatchService;

        @Operation(summary = "Récupère toutes les évaluations avec informations complètes")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Liste de toutes les évaluations")
        })
        @RateLimiter(name = "userMatchRateLimiter")
        @GetMapping
        public List<UserMatchFullDto> getAllUserMatch() {
                return userMatchService.findAll().stream()
                                .map(UserMatchFullDto::fromEntity)
                                .toList();
        }

        @Operation(summary = "Récupère les dernières évaluations globales")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Liste des dernières évaluations")
        })
        @GetMapping("/latest")
        public List<UserMatchFullDto> getLatestReviews(
                        @Parameter(description = "Nombre maximum d'évaluations", example = "10") @RequestParam(defaultValue = "10") int limit) {
                return userMatchService.getLatestReviews(limit).stream()
                                .map(UserMatchFullDto::fromEntity)
                                .toList();
        }

        @Operation(summary = "Récupère toutes les évaluations faites par un utilisateur donné")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Liste des évaluations de l'utilisateur"),
                        @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé")
        })
        @RateLimiter(name = "userMatchRateLimiter")
        @GetMapping("/user/{id}")
        public List<UserMatchFullDto> getUserMatchByUser(
                        @Parameter(description = "UUID de l'utilisateur", required = true) @PathVariable UUID id) {
                return userMatchService.getByUserId(id).stream()
                                .map(UserMatchFullDto::fromEntity)
                                .toList();
        }

        @Operation(summary = "Récupère toutes les évaluations d’un match donné")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Liste des évaluations du match"),
                        @ApiResponse(responseCode = "404", description = "Match non trouvé")
        })
        @RateLimiter(name = "userMatchRateLimiter")
        @GetMapping("/match/{id}")
        public List<UserMatchFullDto> getUserMatchByMatch(
                        @Parameter(description = "UUID du match", required = true) @PathVariable UUID id) {
                return userMatchService.getByMatchId(id).stream()
                                .map(UserMatchFullDto::fromEntity)
                                .toList();
        }

        @Operation(summary = "Crée une nouvelle évaluation")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Évaluation créée avec succès"),
                        @ApiResponse(responseCode = "400", description = "Données invalides")
        })
        @RateLimiter(name = "userMatchRateLimiter")
        @PostMapping
        public ApiResponseDto<UserMatchFullDto> saveUserMatch(
                        @Parameter(description = "DTO de l'évaluation à créer", required = true) @RequestBody UserMatchDto dto) {
                var entity = userMatchService.save(dto);
                return ApiResponseDto.success("Évaluation créée", UserMatchFullDto.fromEntity(entity));
        }

        @Operation(summary = "Met à jour une évaluation existante")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Évaluation mise à jour"),
                        @ApiResponse(responseCode = "404", description = "Évaluation non trouvée"),
                        @ApiResponse(responseCode = "400", description = "Données invalides")
        })
        @RateLimiter(name = "userMatchRateLimiter")
        @PutMapping("/{id}")
        public ApiResponseDto<UserMatchFullDto> updateUserMatch(
                        @Parameter(description = "UUID de l'évaluation à mettre à jour", required = true) @PathVariable UUID id,
                        @Parameter(description = "DTO contenant la note et le commentaire mis à jour", required = true) @RequestBody UserMatchUpdateDto dto) {
                var entity = userMatchService.update(id, dto.getNote(), dto.getComment());
                return ApiResponseDto.success("Évaluation mise à jour", UserMatchFullDto.fromEntity(entity));
        }

        @Operation(summary = "Supprime une évaluation")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Évaluation supprimée"),
                        @ApiResponse(responseCode = "404", description = "Évaluation non trouvée")
        })
        @RateLimiter(name = "userMatchRateLimiter")
        @DeleteMapping("/{id}")
        public ApiResponseDto<Void> deleteUserMatch(
                        @Parameter(description = "UUID de l'évaluation à supprimer", required = true) @PathVariable UUID id) {
                userMatchService.delete(id);
                return ApiResponseDto.success("Évaluation supprimée", null);
        }
}
