package com.kickr_server.competitions;

import com.kickr_server.competitions.Competition;
import com.kickr_server.competitions.CompetitionService;
import com.kickr_server.dto.competition.CompetitionDto;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/competitions")
@RequiredArgsConstructor
@Tag(name = "Competitions", description = "Endpoints pour gérer les compétitions")
@RateLimiter(name = "userRateLimiter")
public class CompetitionController {

    private final CompetitionService competitionService;

    @GetMapping
    @Operation(summary = "Récupérer toutes les compétitions")
    public List<CompetitionDto> getAllCompetitions() {
        return competitionService.findAll().stream()
                .map(CompetitionDto::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer une compétition par ID")
    public CompetitionDto getCompetitionById(@PathVariable UUID id) {
        Competition comp = competitionService.getCompetitionById(id);
        return CompetitionDto.fromEntity(comp);
    }
}
