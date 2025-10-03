package com.kickr_server.usermatch;

import com.kickr_server.dto.UserMatch.UserMatchDto;
import com.kickr_server.dto.UserMatch.UserMatchUpdateDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/user_match")
@RequiredArgsConstructor
public class UserMatchController {

    private final UserMatchService userMatchService;

    /**
     * Récupère toutes les évaluations de matchs.
     */
    @GetMapping
    public List<UserMatchDto> getAllUserMatch() {
        return userMatchService.findAll().stream()
                .map(UserMatchDto::fromEntity)
                .toList();
    }

    /**
     * Récupère toutes les évaluations faites par un utilisateur donné.
     */
    @GetMapping("/user/{id}")
    public List<UserMatchDto> getUserMatchByUser(@PathVariable UUID id) {
        return userMatchService.getByUserId(id).stream()
                .map(UserMatchDto::fromEntity)
                .toList();
    }

    /**
     * Récupère toutes les évaluations d’un match donné.
     */
    @GetMapping("/match/{id}")
    public List<UserMatchDto> getUserMatchByMatch(@PathVariable UUID id) {
        return userMatchService.getByMatchId(id).stream()
                .map(UserMatchDto::fromEntity)
                .toList();
    }

    /**
     * Crée une nouvelle évaluation pour un match par un utilisateur.
     */
    @PostMapping
    public UserMatchDto saveUserMatch(@RequestBody UserMatchDto dto) {
        return UserMatchDto.fromEntity(userMatchService.save(dto));
    }

    /**
     * Met à jour une évaluation existante.
     */
    @PutMapping("/{id}")
    public UserMatchDto updateUserMatch(@PathVariable UUID id, @RequestBody UserMatchUpdateDto dto) {
        return UserMatchDto.fromEntity(userMatchService.update(id, dto.getNote(), dto.getComment()));
    }
}
