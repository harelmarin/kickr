package com.kickr_server.dto.Match;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kickr_server.match.Match;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO pour mapper un match provenant d'une API externe.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchDto {

    @JsonProperty("home_team")
    private String homeTeamName;

    @JsonProperty("home_logo")
    private String homeTeamLogo;

    @JsonProperty("away_team")
    private String awayTeamName;

    @JsonProperty("away_logo")
    private String awayTeamLogo;

    @JsonProperty("match_date")
    private LocalDateTime matchDate;

    @JsonProperty("competition")
    private String competition;

    @JsonProperty("location")
    private String location;

    @JsonProperty("home_score")
    private Integer homeScore;

    @JsonProperty("away_score")
    private Integer awayScore;

    public static MatchDto fromEntity(Match match) {
        if (match == null) return null;
        return new MatchDto(
                match.getHomeTeam().getName(),
                match.getHomeTeam().getLogoUrl(),
                match.getAwayTeam().getName(),
                match.getAwayTeam().getLogoUrl(),
                match.getMatchDate(),
                match.getCompetition(),
                match.getLocation(),
                match.getHomeScore(),
                match.getAwayScore()
        );
    }
}

