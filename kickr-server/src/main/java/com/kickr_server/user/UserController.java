package com.kickr_server.user;

import com.kickr_server.dto.User.UserDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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
    @GetMapping
    public List<UserDto> getAllUsers() {
        return userService.findAll().stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
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
    @GetMapping("/{id}")
    public UserDto getUserById(@PathVariable UUID id) {
        var user = userService.getUserById(id);
        return UserDto.fromEntity(user);
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
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable UUID id) {
        userService.deleteById(id);
    }
}
