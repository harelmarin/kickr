package com.kickr_server.team;

import com.kickr_server.dto.team.TeamDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
@Tag(name = "Teams", description = "Endpoints pour gérer les équipes")
public class TeamController {

    private final TeamService teamService;

    @GetMapping
    @Operation(summary = "Récupérer toutes les équipes")
    public List<TeamDto> getAllTeams() {
        return teamService.findAll().stream()
                .map(TeamDto::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer une équipe par ID")
    public TeamDto getTeamById(@PathVariable UUID id) {
        Team team = teamService.getTeamById(id);
        return TeamDto.fromEntity(team);
    }

    @GetMapping("/competition/{competitionId}")
    @Operation(summary = "Récupérer toutes les équipes d'une compétition")
    public List<TeamDto> getTeamsByCompetition(@PathVariable UUID competitionId) {
        return teamService.getTeamsByCompetitionId(competitionId)
                .stream()
                .map(TeamDto::fromEntity)
                .collect(Collectors.toList());
    }
}
