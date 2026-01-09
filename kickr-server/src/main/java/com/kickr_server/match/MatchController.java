package com.kickr_server.match;

import com.kickr_server.dto.match.MatchDto;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/matchs")
@RequiredArgsConstructor
@RateLimiter(name = "userMatchRateLimiter")
public class MatchController {

        private final MatchService matchService;

        @Operation(summary = "Synchroniser les matchs", description = "🔒 **ADMIN ONLY** - Par défaut : fenêtre +/- 7 jours. Si fullTournaments=true : synchronise toute la saison des coupes d'europe.", security = @SecurityRequirement(name = "bearerAuth"), tags = {
                        "Admin Actions" })
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Synchronisation effectuée"),
                        @ApiResponse(responseCode = "500", description = "Erreur lors de la synchronisation")
        })
        @GetMapping("/save")
        public void syncMatches(
                        @Parameter(description = "Synchroniser toute la saison des tournois (UCL, UEL, UECL)") @RequestParam(defaultValue = "false") boolean fullTournaments,
                        @Parameter(description = "Synchroniser le classement pour toutes les ligues majeures") @RequestParam(defaultValue = "false") boolean allStandings,
                        @Parameter(description = "Synchroniser le classement pour une ligue spécifique") @RequestParam(required = false) Integer leagueId,
                        @Parameter(description = "Saison pour le classement") @RequestParam(defaultValue = "2025") Integer season)
                        throws Exception {
                if (fullTournaments) {
                        matchService.syncFullSeasonTournaments();
                } else if (allStandings) {
                        matchService.syncAllMajorStandings(season);
                } else if (leagueId != null) {
                        matchService.syncStandings(leagueId, season);
                } else {
                        matchService.fetchAndSaveNextMatches();
                }
        }

        @Operation(summary = "Récupère les prochains matchs avec pagination", tags = { "Public Match Data" })
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Page de prochains matchs")
        })
        @GetMapping("/next")
        public Page<MatchDto> getNextMatches(
                        @Parameter(description = "Numéro de page (0-based)", example = "0") @RequestParam(defaultValue = "0") int page,
                        @Parameter(description = "Nombre d'éléments par page", example = "10") @RequestParam(defaultValue = "10") int limit) {
                return matchService.getNextMatchesByDate(page, limit);
        }

        @Operation(summary = "Récupère tous les matchs disponibles", tags = { "Public Match Data" })
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Liste de tous les matchs")
        })
        @GetMapping
        public List<MatchDto> getAllMatches() {
                return matchService.getAll().stream()
                                .map(MatchDto::fromEntity)
                                .toList();
        }

        @Operation(summary = "Récupère tous les matchs d'une équipe (passés et futurs)", tags = { "Public Match Data" })
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Liste de tous les matchs de l'équipe")
        })
        @GetMapping("/team/{teamId}")
        public List<MatchDto> getAllMatchesByTeam(
                        @Parameter(description = "ID de l'équipe") @PathVariable UUID teamId) {
                return matchService.getAllMatchesByTeamId(teamId);
        }

        @Operation(summary = "Récupère un match spécifique par son ID externe (fixture ID)", tags = {
                        "Public Match Data" })
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

        @Operation(summary = "Recherche des matchs avec filtres (ligue, statut, tri)", tags = { "Public Match Data" })
        @GetMapping("/search")
        public Page<MatchDto> searchMatches(
                        @Parameter(description = "ID de la compétition") @RequestParam(required = false) UUID competitionId,
                        @Parameter(description = "Match terminé (true/false)") @RequestParam(required = false) Boolean finished,
                        @Parameter(description = "Recherche textuelle (équipe)") @RequestParam(required = false) String query,
                        @Parameter(description = "Tour (Round)") @RequestParam(required = false) String round,
                        @Parameter(description = "Tri (popularity, rating, date)") @RequestParam(defaultValue = "date") String sort,
                        @Parameter(description = "Page") @RequestParam(defaultValue = "0") int page,
                        @Parameter(description = "Limite") @RequestParam(defaultValue = "18") int limit) {
                return matchService.findMatchesWithFilters(competitionId, finished, query, round, sort, page, limit);
        }

        @Operation(summary = "Récupère les tours (rounds) d'une compétition", tags = { "Public Match Data" })
        @GetMapping("/rounds/{competitionId}")
        public List<String> getRounds(@PathVariable UUID competitionId) {
                return matchService.getRoundsByCompetitionId(competitionId);
        }

        @Operation(summary = "Récupère les matchs les mieux notés (trending)", tags = { "Public Match Data" })
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Liste des matchs trending")
        })
        @GetMapping("/trending")
        public Page<MatchDto> getTrendingMatches(
                        @Parameter(description = "Nombre de matchs à retourner") @RequestParam(defaultValue = "6") int limit) {
                return matchService.getTrendingMatches(limit);
        }

        @Operation(summary = "Backfill historical matches", description = "🔒 **ADMIN ONLY** - Backfill all matches from season start to present with lineups enrichment", security = @SecurityRequirement(name = "bearerAuth"), tags = {
                        "Admin Actions" })
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Backfill completed successfully"),
                        @ApiResponse(responseCode = "500", description = "Backfill failed")
        })
        @GetMapping("/backfill")
        public void backfillMatches(
                        @Parameter(description = "Start date (YYYY-MM-DD)", example = "2025-08-01") @RequestParam(defaultValue = "2025-08-01") String fromDate,

                        @Parameter(description = "End date (YYYY-MM-DD), defaults to today") @RequestParam(required = false) String toDate)
                        throws Exception {
                if (toDate == null) {
                        toDate = java.time.LocalDate.now().toString();
                }
                matchService.backfillHistoricalMatches(fromDate, toDate);
        }

}
