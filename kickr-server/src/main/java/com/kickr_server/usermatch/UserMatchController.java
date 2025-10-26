package com.kickr_server.usermatch;

import com.kickr_server.dto.UserMatch.UserMatchDto;
import com.kickr_server.dto.UserMatch.UserMatchFullDto;
import com.kickr_server.dto.UserMatch.UserMatchUpdateDto;
import com.kickr_server.dto.generic.ApiResponseDto;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
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
     *  Récupère toutes les évaluations (avec user + match complets)
     */
    @RateLimiter(name = "userMatchRateLimiter")
    @GetMapping
    public List<UserMatchFullDto> getAllUserMatch() {
        return userMatchService.findAll().stream()
                .map(UserMatchFullDto::fromEntity)
                .toList();
    }

    /**
     * Récupère toutes les évaluations faites par un utilisateur donné (avec infos complètes)
     */
    @RateLimiter(name = "userMatchRateLimiter")
    @GetMapping("/user/{id}")
    public List<UserMatchFullDto> getUserMatchByUser(@PathVariable UUID id) {
        return userMatchService.getByUserId(id).stream()
                .map(UserMatchFullDto::fromEntity)
                .toList();
    }

    /**
     * Récupère toutes les évaluations d’un match donné (avec infos complètes)
     */
    @RateLimiter(name = "userMatchRateLimiter")
    @GetMapping("/match/{id}")
    public List<UserMatchFullDto> getUserMatchByMatch(@PathVariable UUID id) {
        return userMatchService.getByMatchId(id).stream()
                .map(UserMatchFullDto::fromEntity)
                .toList();
    }

    /**
     * Crée une nouvelle évaluation (utilise DTO simplifié car on envoie que des IDs)
     */
    @RateLimiter(name = "userMatchRateLimiter")
    @PostMapping
    public ApiResponseDto<UserMatchFullDto> saveUserMatch(@RequestBody UserMatchDto dto) {
        var entity = userMatchService.save(dto);
        return ApiResponseDto.success("Évaluation créée", UserMatchFullDto.fromEntity(entity));
    }

    /**
     *  Met à jour une évaluation existante
     */
    @RateLimiter(name = "userMatchRateLimiter")
    @PutMapping("/{id}")
    public ApiResponseDto<UserMatchFullDto> updateUserMatch(
            @PathVariable UUID id,
            @RequestBody UserMatchUpdateDto dto
    ) {
        var entity = userMatchService.update(id, dto.getNote(), dto.getComment());
        return ApiResponseDto.success("Évaluation mise à jour", UserMatchFullDto.fromEntity(entity));
    }
}
