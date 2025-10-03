package com.kickr_server.dto.Team;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO représentant une équipe dans la réponse de l'API externe.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeamDto {
    private String name;

    @JsonProperty("logo")
    private String logoUrl;
}
