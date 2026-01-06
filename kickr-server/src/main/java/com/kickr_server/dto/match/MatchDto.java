package com.kickr_server.dto.match;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kickr_server.match.Match;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO pour mapper un match provenant d'une API externe.
 * Expose les informations essentielles, y compris les détails de la
 * compétition.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchDto {

    @JsonProperty("home_team")
    private String homeTeamName;

    @JsonProperty("home_team_id")
    private UUID homeTeamId;

    @JsonProperty("home_logo")
    private String homeTeamLogo;

    @JsonProperty("away_team")
    private String awayTeamName;

    @JsonProperty("away_team_id")
    private UUID awayTeamId;

    @JsonProperty("away_logo")
    private String awayTeamLogo;

    @JsonProperty("match_date")
    private LocalDateTime matchDate;

    @JsonProperty("competition_id")
    private UUID competitionId;

    @JsonProperty("competition_externalId")
    private Integer competitionExternalId;

    @JsonProperty("competition_name")
    private String competitionName;

    @JsonProperty("competition_logo")
    private String competitionLogo;

    @JsonProperty("location")
    private String location;

    @JsonProperty("home_score")
    private Integer homeScore;

    @JsonProperty("away_score")
    private Integer awayScore;

    @JsonProperty("id")
    private Integer externalFixtureId;

    /**
     * Convertit une entité Match en DTO.
     */
    public static MatchDto fromEntity(Match match) {
        if (match == null)
            return null;
        return new MatchDto(
                match.getHomeTeam().getName(),
                match.getHomeTeam().getId(),
                match.getHomeTeam().getLogoUrl(),
                match.getAwayTeam().getName(),
                match.getAwayTeam().getId(),
                match.getAwayTeam().getLogoUrl(),
                match.getMatchDate(),
                match.getCompetition().getId(),
                match.getCompetition().getExternalId(),
                match.getCompetition().getName(),
                match.getCompetition().getLogoUrl(),
                match.getLocation(),
                match.getHomeScore(),
                match.getAwayScore(),
                match.getExternalFixtureId());
    }
}
