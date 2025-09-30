package com.kickr_server.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

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
    private String matchDate;

    @JsonProperty("competition")
    private String competition;

    @JsonProperty("location")
    private String location;

    @JsonProperty("home_score")
    private Integer homeScore;

    @JsonProperty("away_score")
    private Integer awayScore;
}
