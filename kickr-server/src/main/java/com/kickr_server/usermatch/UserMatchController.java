package com.kickr_server.usermatch;

import com.kickr_server.dto.UserMatch.UserMatchDto;
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
     * Récupère toutes les évaluations de matchs.
     */
    @RateLimiter(name = "userMatchRateLimiter")
    @GetMapping
    public List<UserMatchDto> getAllUserMatch() {
        return userMatchService.findAll().stream()
                .map(UserMatchDto::fromEntity)
                .toList();
    }

    /**
     * Récupère toutes les évaluations faites par un utilisateur donné.
     */
    @RateLimiter(name = "userMatchRateLimiter")
    @GetMapping("/user/{id}")
    public List<UserMatchDto> getUserMatchByUser(@PathVariable UUID id) {
        return userMatchService.getByUserId(id).stream()
                .map(UserMatchDto::fromEntity)
                .toList();
    }

    /**
     * Récupère toutes les évaluations d’un match donné.
     */
    @RateLimiter(name = "userMatchRateLimiter")
    @GetMapping("/match/{id}")
    public List<UserMatchDto> getUserMatchByMatch(@PathVariable UUID id) {
        return userMatchService.getByMatchId(id).stream()
                .map(UserMatchDto::fromEntity)
                .toList();
    }

    /**
     * Crée une nouvelle évaluation pour un match par un utilisateur.
     */
    @RateLimiter(name = "userMatchRateLimiter")
    @PostMapping
    public ApiResponseDto<UserMatchDto> saveUserMatch(@RequestBody UserMatchDto dto) {
        UserMatchDto userMatchDto = UserMatchDto.fromEntity(userMatchService.save(dto));
        return ApiResponseDto.success("Evaluation créée", userMatchDto);
    }

    /**
     * Met à jour une évaluation existante.
     */
    @RateLimiter(name = "userMatchRateLimiter")
    @PutMapping("/{id}")
    public ApiResponseDto<UserMatchDto>  updateUserMatch(@PathVariable UUID id, @RequestBody UserMatchUpdateDto dto) {
        UserMatchDto userMatchDto = UserMatchDto.fromEntity(userMatchService.update(id, dto.getNote(), dto.getComment()));
        return ApiResponseDto.success("Evaluation modifiée", userMatchDto);
    }
}
