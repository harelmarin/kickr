package com.kickr_server.team;

import com.kickr_server.dto.team.TeamDto;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
@Tag(name = "Teams", description = "Endpoints pour gérer les équipes")
@RateLimiter(name = "userRateLimiter")
public class TeamController {

    private final TeamService teamService;

    @GetMapping
    @Operation(summary = "Récupérer toutes les équipes")
    public List<TeamDto> getAllTeams() {
        return teamService.findAll().stream()
                .map(TeamDto::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/search")
    @Operation(summary = "Rechercher des équipes avec pagination")
    public Page<TeamDto> searchTeams(
            @Parameter(description = "Terme de recherche (nom de l'équipe)") @RequestParam(required = false) String search,
            @Parameter(description = "Numéro de page (0-based)", example = "0") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Nombre d'éléments par page", example = "20") @RequestParam(defaultValue = "20") int size) {
        return teamService.searchTeams(search, page, size);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer une équipe par ID")
    public TeamDto getTeamById(@PathVariable UUID id) {
        Team team = teamService.getTeamById(id);
        return TeamDto.fromEntity(team);
    }

    @GetMapping("/competition/{competitionId}")
    @Operation(summary = "Récupérer les équipes d'une compétition avec pagination")
    public Page<TeamDto> getTeamsByCompetition(
            @PathVariable UUID competitionId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return teamService.getTeamsByCompetitionIdPaginated(competitionId, page, size);
    }
}
