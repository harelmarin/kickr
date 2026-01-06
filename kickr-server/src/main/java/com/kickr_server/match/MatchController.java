package com.kickr_server.match;

import com.kickr_server.dto.match.MatchDto;
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
                        @Parameter(description = "Numéro de page (0-based)", example = "0") @RequestParam(defaultValue = "0") int page) {
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

        @Operation(summary = "Récupère tous les matchs d'une équipe (passés et futurs)")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Liste de tous les matchs de l'équipe")
        })
        @GetMapping("/team/{teamId}")
        public List<MatchDto> getAllMatchesByTeam(
                        @Parameter(description = "ID de l'équipe") @PathVariable java.util.UUID teamId) {
                return matchService.getAllMatchesByTeamId(teamId);
        }

        @Operation(summary = "Récupère un match spécifique par son ID externe (fixture ID)")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Détails du match"),
                        @ApiResponse(responseCode = "404", description = "Match non trouvé")
        })
        @GetMapping("/{id}")
        public MatchDto getMatchById(
                        @Parameter(description = "ID externe du match (fixture ID)") @PathVariable Integer id) {
                return matchService.getMatchById(id)
                                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                                                org.springframework.http.HttpStatus.NOT_FOUND, "Match non trouvé"));
        }

}
