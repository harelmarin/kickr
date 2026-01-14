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

        @Operation(summary = "Synchronize matches", description = "🔒 **ADMIN ONLY** - Default: window +/- 7 days. If fullTournaments=true: synchronizes the entire season of European cups.", security = @SecurityRequirement(name = "bearerAuth"), tags = {
                        "Admin Actions" })
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Synchronization successful"),
                        @ApiResponse(responseCode = "500", description = "Error during synchronization")
        })
        @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
        @GetMapping("/save")
        public org.springframework.http.ResponseEntity<String> syncMatches(
                        @Parameter(description = "Synchronize the entire season of tournaments (UCL, UEL, UECL)") @RequestParam(defaultValue = "false") boolean fullTournaments,
                        @Parameter(description = "Synchronize standings for all major leagues") @RequestParam(defaultValue = "false") boolean allStandings,
                        @Parameter(description = "Synchronize standings for a specific league") @RequestParam(required = false) Integer leagueId,
                        @Parameter(description = "Season for standings") @RequestParam(defaultValue = "2025") Integer season)
                        throws Exception {
                if (fullTournaments) {
                        matchService.syncFullSeasonTournaments();
                        return org.springframework.http.ResponseEntity.ok("Tournament sync completed.");
                } else if (allStandings) {
                        matchService.syncAllStandingsAsync(season);
                        return org.springframework.http.ResponseEntity.accepted()
                                        .body("All league standings sync started in background for season " + season
                                                        + ".");
                } else if (leagueId != null) {
                        matchService.syncStandings(leagueId, season);
                        return org.springframework.http.ResponseEntity
                                        .ok("Standings for league " + leagueId + " synced.");
                } else {
                        matchService.fetchAndSaveNextMatches();
                        return org.springframework.http.ResponseEntity.ok("Daily matches synced.");
                }
        }

        @Operation(summary = "Retrieve upcoming matches with pagination", tags = { "Public Match Data" })
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Page of upcoming matches")
        })
        @GetMapping("/next")
        public Page<MatchDto> getNextMatches(
                        @Parameter(description = "Page number (0-based)", example = "0") @RequestParam(defaultValue = "0") int page,
                        @Parameter(description = "Number of elements per page", example = "10") @RequestParam(defaultValue = "10") int limit) {
                return matchService.getNextMatchesByDate(page, limit);
        }

        @Operation(summary = "Retrieve all available matches", tags = { "Public Match Data" })
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "List of all matches")
        })
        @GetMapping
        public List<MatchDto> getAllMatches() {
                return matchService.getAll().stream()
                                .map(MatchDto::fromEntity)
                                .toList();
        }

        @Operation(summary = "Retrieve all matches for a team (past and upcoming)", tags = { "Public Match Data" })
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "List of all match for the team")
        })
        @GetMapping("/team/{teamId}")
        public List<MatchDto> getAllMatchesByTeam(
                        @Parameter(description = "Team ID (UUID or externalId)") @PathVariable String teamId) {
                return matchService.getAllMatchesByTeamIdOrExternalId(teamId);
        }

        @Operation(summary = "Retrieve a specific match by its external ID (fixture ID)", tags = {
                        "Public Match Data" })
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Match details"),
                        @ApiResponse(responseCode = "404", description = "Match not found")
        })
        @GetMapping("/{id}")
        public MatchDto getMatchById(
                        @Parameter(description = "External match ID (fixture ID)") @PathVariable Integer id) {
                return matchService.getMatchById(id)
                                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                                                org.springframework.http.HttpStatus.NOT_FOUND, "Match not found"));
        }

        @Operation(summary = "Search matches with filters (league, status, sort)", tags = { "Public Match Data" })
        @GetMapping("/search")
        public Page<MatchDto> searchMatches(
                        @Parameter(description = "Competition ID") @RequestParam(required = false) UUID competitionId,
                        @Parameter(description = "Match finished (true/false)") @RequestParam(required = false) Boolean finished,
                        @Parameter(description = "Text search (team)") @RequestParam(required = false) String query,
                        @Parameter(description = "Round") @RequestParam(required = false) String round,
                        @Parameter(description = "Sort (popularity, rating, date)") @RequestParam(defaultValue = "date_asc") String sort,
                        @Parameter(description = "Page") @RequestParam(defaultValue = "0") int page,
                        @Parameter(description = "Limit") @RequestParam(defaultValue = "18") int limit) {
                return matchService.findMatchesWithFilters(competitionId, finished, query, round, sort, page, limit);
        }

        @Operation(summary = "Retrieve rounds for a competition", tags = { "Public Match Data" })
        @GetMapping("/rounds/{competitionId}")
        public List<String> getRounds(@PathVariable UUID competitionId) {
                return matchService.getRoundsByCompetitionId(competitionId);
        }

        @Operation(summary = "Retrieve best rated matches (trending)", tags = { "Public Match Data" })
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "List of trending matches")
        })
        @GetMapping("/trending")
        public Page<MatchDto> getTrendingMatches(
                        @Parameter(description = "Number of matches to return") @RequestParam(defaultValue = "6") int limit) {
                return matchService.getTrendingMatches(limit);
        }

        @Operation(summary = "Backfill historical matches", description = "🔒 **ADMIN ONLY** - Backfill all matches from season start to present with lineups enrichment", security = @SecurityRequirement(name = "bearerAuth"), tags = {
                        "Admin Actions" })
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Backfill completed successfully"),
                        @ApiResponse(responseCode = "500", description = "Backfill failed")
        })
        @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
        @GetMapping("/backfill")
        public org.springframework.http.ResponseEntity<String> backfillMatches(
                        @Parameter(description = "Start date (YYYY-MM-DD)", example = "2025-08-01") @RequestParam(defaultValue = "2025-08-01") String fromDate,
                        @Parameter(description = "End date (YYYY-MM-DD), defaults to today") @RequestParam(required = false) String toDate)
                        throws Exception {
                if (toDate == null) {
                        toDate = java.time.LocalDate.now().toString();
                }
                matchService.backfillHistoricalMatches(fromDate, toDate);
                return org.springframework.http.ResponseEntity.accepted()
                                .body("Historical backfill started in background spanning " + fromDate + " to " + toDate
                                                + ". Check server logs for progress.");
        }

}
