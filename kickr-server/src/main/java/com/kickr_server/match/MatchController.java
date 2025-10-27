package com.kickr_server.match;

import com.kickr_server.dto.Match.MatchDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matchs")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @Operation(summary = "Récupérer et sauvegarder les prochains matchs depuis la source externe")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Matchs récupérés et sauvegardés"),
            @ApiResponse(responseCode = "500", description = "Erreur lors de la récupération ou sauvegarde")
    })
    @GetMapping("/save")
    public void getNextMatches() throws Exception {
        matchService.fetchAndSaveNextMatches();
    }


    @Operation(summary = "Récupère les prochains matchs avec pagination")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Page de prochains matchs")
    })
    @GetMapping("/next")
    public Page<MatchDto> getNextMatches(
            @Parameter(description = "Numéro de page (0-based)", example = "0")
            @RequestParam(defaultValue = "0") int page
    ) {
        return matchService.getNextMatchesByDate(page);
    }

    @Operation(summary = "Récupère tous les matchs disponibles")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste de tous les matchs")
    })
    @GetMapping
    public List<MatchDto> getAllMatches() {
        return matchService.getAll().stream()
                .map(MatchDto::fromEntity)
                .toList();
    }

}
