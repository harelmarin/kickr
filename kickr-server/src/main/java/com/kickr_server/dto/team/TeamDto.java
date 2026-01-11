package com.kickr_server.dto.team;

import com.kickr_server.dto.competition.CompetitionDto;
import com.kickr_server.team.Team;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "DTO représentant une équipe")
public class TeamDto {

    @Schema(description = "Identifiant unique de l'équipe", example = "1e8c8e60-5717-4562-b3fc-2c963f66afa6")
    private UUID id;

    @Schema(description = "Nom de l'équipe", example = "Paris FC")
    private String name;

    @Schema(description = "URL du logo de l'équipe", example = "https://example.com/team-logo.png")
    private String logoUrl;

    @Schema(description = "Compétition à laquelle appartient l'équipe")
    private CompetitionDto competition;

    public static TeamDto fromEntity(Team team) {
        CompetitionDto compDto = CompetitionDto.builder()
                .id(team.getCompetition().getId())
                .name(team.getCompetition().getName())
                .externalId(team.getCompetition().getExternalId())
                .logoUrl(team.getCompetition().getLogoUrl())
                .country(team.getCompetition().getCountry())
                .build();

        return TeamDto.builder()
                .id(team.getId())
                .name(team.getName())
                .logoUrl(team.getLogoUrl())
                .competition(compDto)
                .build();
    }

}
