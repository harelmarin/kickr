package com.kickr_server.dto.competition;

import com.kickr_server.competitions.Competition;
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
@Schema(description = "DTO représentant une compétition")
public class CompetitionDto {

    @Schema(description = "Identifiant unique de la compétition", example = "3fa85f64-5717-4562-b3fc-2c963f66afa6")
    private UUID id;

    @Schema(description = "Nom de la compétition", example = "Ligue des Champions")
    private String name;

    @Schema(description = "Identifiant externe unique de la compétition", example = "101")
    private Integer externalId;

    @Schema(description = "URL du logo de la compétition", example = "https://example.com/logo.png")
    private String logoUrl;

    @Schema(description = "Pays de la compétition", example = "France")
    private String country;

    @Schema(description = "Type de compétition (LEAGUE/CUP)", example = "CUP")
    private String type;

    @Schema(description = "Classement en format JSON (pour les ligues)")
    private String standingsJson;

    public static CompetitionDto fromEntity(Competition competition) {
        return CompetitionDto.builder()
                .id(competition.getId())
                .name(competition.getName())
                .externalId(competition.getExternalId())
                .logoUrl(competition.getLogoUrl())
                .country(competition.getCountry())
                .type(competition.getType())
                .standingsJson(competition.getStandingsJson())
                .build();
    }
}
