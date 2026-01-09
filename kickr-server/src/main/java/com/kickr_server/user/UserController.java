package com.kickr_server.user;

import com.kickr_server.dto.User.UserDto;
import com.kickr_server.dto.User.UserProfileUpdateDto;
import com.kickr_server.dto.generic.ApiResponseDto;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

        private final UserService userService;

        /**
         * Récupère la liste de tous les utilisateurs.
         *
         * @return liste des utilisateurs sous forme de DTO (sans mot de passe)
         */
        @Operation(summary = "Récupérer tous les utilisateurs")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
        })
        @RateLimiter(name = "userRateLimiter")
        @GetMapping
        public List<UserDto> getAllUsers() {
                return userService.findAllWithStats();
        }

        /**
         * Récupère un utilisateur par son identifiant.
         *
         * @param id UUID de l'utilisateur
         * @return l'utilisateur sous forme de DTO
         */
        @Operation(summary = "Récupérer un utilisateur par son ID")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Utilisateur trouvé"),
                        @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé")
        })
        @RateLimiter(name = "userRateLimiter")
        @GetMapping("/{id}")
        public UserDto getUserById(@PathVariable UUID id) {
                return userService.getUserDtoWithStats(id);
        }

        /**
         * Supprime un utilisateur par son identifiant.
         *
         * @param id UUID de l'utilisateur
         */
        @Operation(summary = "Supprimer un utilisateur par son ID")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "204", description = "Utilisateur supprimé"),
                        @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé")
        })
        @RateLimiter(name = "userRateLimiter")
        @DeleteMapping("/{id}")
        @ResponseStatus(HttpStatus.NO_CONTENT)
        public ApiResponseDto<Void> deleteUser(@PathVariable UUID id) {
                userService.deleteById(id);
                return new ApiResponseDto<>("SUCCESS", "User deleted successfully", null, null);
        }

        @Operation(summary = "Mettre à jour mes informations de profil")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Profil mis à jour"),
                        @ApiResponse(responseCode = "400", description = "Données invalides / Nom déjà pris"),
                        @ApiResponse(responseCode = "401", description = "Non authentifié")
        })
        @RateLimiter(name = "userRateLimiter")
        @PutMapping("/me")
        public ApiResponseDto<UserDto> updateProfile(
                        @Valid @RequestBody UserProfileUpdateDto updateDto,
                        Authentication authentication) {
                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                com.kickr_server.user.User user = userService.getUserByEmail(userDetails.getUsername());
                var updatedUser = userService.updateProfile(user.getId(), updateDto.name(), updateDto.email());
                return ApiResponseDto.success("Tactical records synchronized",
                                userService.getUserDtoWithStats(updatedUser.getId()));
        }

        @Operation(summary = "Mettre à jour ma photo de profil")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Photo mise à jour"),
                        @ApiResponse(responseCode = "401", description = "Non authentifié")
        })
        @RateLimiter(name = "userRateLimiter")
        @PostMapping("/me/avatar")
        public ApiResponseDto<UserDto> uploadAvatar(
                        @RequestParam("file") MultipartFile file,
                        Authentication authentication) throws IOException {
                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                com.kickr_server.user.User user = userService.getUserByEmail(userDetails.getUsername());
                var updatedUser = userService.updateAvatar(user.getId(), file);
                return ApiResponseDto.success("Avatar updated successfully",
                                userService.getUserDtoWithStats(updatedUser.getId()));
        }

        @Operation(summary = "Supprimer ma photo de profil")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Photo supprimée"),
                        @ApiResponse(responseCode = "401", description = "Non authentifié")
        })
        @RateLimiter(name = "userRateLimiter")
        @DeleteMapping("/me/avatar")
        public ApiResponseDto<UserDto> deleteAvatar(Authentication authentication) throws IOException {
                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                com.kickr_server.user.User user = userService.getUserByEmail(userDetails.getUsername());
                var updatedUser = userService.deleteAvatar(user.getId());
                return ApiResponseDto.success("Avatar deleted successfully",
                                userService.getUserDtoWithStats(updatedUser.getId()));
        }
}
