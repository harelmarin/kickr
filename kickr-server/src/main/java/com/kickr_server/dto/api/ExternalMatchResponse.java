package com.kickr_server.dto.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kickr_server.dto.match.MatchDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO représentant la réponse complète de l'API externe.
 * Permet de récupérer facilement une liste de matchs.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExternalMatchResponse {
    @JsonProperty("matches")
    private List<MatchDto> matches;
}