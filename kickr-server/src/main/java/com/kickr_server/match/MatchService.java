package com.kickr_server.match;

import com.kickr_server.competitions.Competition;
import com.kickr_server.competitions.CompetitionRepository;
import com.kickr_server.config.AppConfig;
import com.kickr_server.dto.match.MatchDto;
import com.kickr_server.team.Team;
import com.kickr_server.team.TeamRepository;
import com.kickr_server.usermatch.UserMatchRepository;
import com.kickr_server.utils.DateTimeConverter;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service pour récupérer et sauvegarder les informations des matchs de football
 * depuis l'API Football.
 */
@Service
public class MatchService {

        private static final int[] LEAGUE_IDS = {
                        39, 140, 135, 78, 61,
                        45, 143, 137, 81, 66,
                        2, 3, 848
        };

        private final RestTemplate restTemplate;
        private final String footballApiKey;
        private final MatchRepository matchRepository;
        private final TeamRepository teamRepository;
        private final CompetitionRepository competitionRepository;
        private final UserMatchRepository userMatchRepository;
        private final MatchDetailRepository matchDetailRepository;
        private final ObjectMapper objectMapper;
        private final TransactionTemplate transactionTemplate;

        public MatchService(RestTemplate restTemplate, AppConfig appConfig, MatchRepository matchRepository,
                        TeamRepository teamRepository, CompetitionRepository competitionRepository,
                        UserMatchRepository userMatchRepository, MatchDetailRepository matchDetailRepository,
                        ObjectMapper objectMapper, PlatformTransactionManager transactionManager) {
                this.restTemplate = restTemplate;
                this.footballApiKey = appConfig.getFootballApiKey();
                this.matchRepository = matchRepository;
                this.teamRepository = teamRepository;
                this.competitionRepository = competitionRepository;
                this.userMatchRepository = userMatchRepository;
                this.matchDetailRepository = matchDetailRepository;
                this.objectMapper = objectMapper;
                this.transactionTemplate = new TransactionTemplate(transactionManager);
                this.transactionTemplate.setPropagationBehavior(
                                org.springframework.transaction.TransactionDefinition.PROPAGATION_REQUIRES_NEW);
        }

        /**
         * Récupère la liste des prochains matchs depuis l'API Football.
         */
        @SuppressWarnings("unused")
        private List<MatchDto> fetchNextMatches() throws Exception {
                int season = 2025;
                List<MatchDto> matches = new ArrayList<>();

                for (int leagueId : LEAGUE_IDS) {
                        String url = "https://v3.football.api-sports.io/fixtures?league=" + leagueId + "&season="
                                        + season;

                        HttpHeaders headers = new HttpHeaders();
                        headers.set("x-apisports-key", footballApiKey);
                        headers.set("Accept", "application/json");

                        HttpEntity<String> entity = new HttpEntity<>(headers);
                        ResponseEntity<String> responseRaw = restTemplate.exchange(url, HttpMethod.GET, entity,
                                        String.class);

                        JsonNode root = objectMapper.readTree(responseRaw.getBody());
                        JsonNode responseArray = root.get("response");
                        if (responseArray == null || !responseArray.isArray())
                                continue;

                        for (JsonNode fixtureNode : responseArray) {
                                processFixture(fixtureNode, new ArrayList<>());
                        }
                }
                return matches;
        }

        /**
         * Récupère et sauvegarde tous les matchs (championnats, coupes, compétitions
         * européennes)
         * sans gérer les stages.
         */
        public void fetchAndSaveNextMatches() throws Exception {
                System.out.println("🚀 Starting fetchAndSaveNextMatches...");
                if (footballApiKey == null || footballApiKey.equals("none")) {
                        System.err.println("❌ ERROR: football.api.key is NOT set!");
                        return;
                }
                try {
                        int season = 2025;
                        List<Integer> leagueIds = java.util.Arrays.stream(LEAGUE_IDS).boxed().toList();
                        String apiUrl = "https://v3.football.api-sports.io/fixtures";
                        LocalDate now = LocalDate.now();
                        String fromDate = now.minusDays(7).toString();
                        String toDate = now.plusDays(7).toString();

                        List<Match> syncedMatches = new ArrayList<>();
                        for (Integer leagueId : leagueIds) {
                                try {
                                        System.out.println("🔄 Synchronisation ligue " + leagueId + " (Fenêtre "
                                                        + fromDate + " -> " + toDate + ")...");
                                        java.net.URI uri = UriComponentsBuilder.fromUriString(apiUrl)
                                                        .queryParam("league", leagueId)
                                                        .queryParam("season", season)
                                                        .queryParam("from", fromDate)
                                                        .queryParam("to", toDate)
                                                        .build()
                                                        .toUri();

                                        HttpHeaders headers = new HttpHeaders();
                                        headers.set("x-apisports-key", footballApiKey);
                                        headers.set("Accept", "application/json");
                                        HttpEntity<String> entity = new HttpEntity<>(headers);

                                        ResponseEntity<String> responseRaw = restTemplate.exchange(uri, HttpMethod.GET,
                                                        entity, String.class);
                                        JsonNode root = objectMapper.readTree(responseRaw.getBody());
                                        JsonNode responseArray = root.get("response");

                                        if (responseArray == null || !responseArray.isArray())
                                                continue;

                                        for (JsonNode fixtureNode : responseArray) {
                                                processFixture(fixtureNode, syncedMatches);
                                        }

                                } catch (Exception e) {
                                        System.out.println("⚠️ Erreur récupération fixtures pour la ligue " + leagueId
                                                        + " : "
                                                        + e.getMessage());
                                }

                                try {
                                        System.out.println(
                                                        "⏳ Attente de 6.5s pour respecter la limite API (10 req/min)...");
                                        Thread.sleep(6500);
                                } catch (InterruptedException ie) {
                                        Thread.currentThread().interrupt();
                                }
                        }

                        List<Match> toEnrich = matchRepository.findMatchesNeedingDetailEnrichment(
                                        LocalDateTime.now().plusHours(2),
                                        PageRequest.of(0, 20));
                        if (!toEnrich.isEmpty()) {
                                fetchAndSaveMultipleMatchDetails(toEnrich);
                        }

                        System.out.println("✅ Synchronisation des matchs terminée.");

                } catch (Exception e) {
                        System.err.println("❌ Erreur globale lors de la synchronisation : " + e.getMessage());
                        throw e;
                }
        }

        /**
         * Synchronise l'intégralité d'une saison pour les compétitions majeures (UCL,
         * UEL, UECL).
         * Utilise la saison 2025 (2025/2026).
         */
        public void syncFullSeasonTournaments() throws Exception {
                int[] tournamentIds = { 2, 3, 848 }; // UCL, UEL, UECL
                int season = 2025;
                String apiUrl = "https://v3.football.api-sports.io/fixtures";

                for (int leagueId : tournamentIds) {
                        try {
                                System.out.println("🌍 [Tournament] Synchronisation complète saison 2025 pour ligue "
                                                + leagueId + "...");
                                java.net.URI uri = UriComponentsBuilder.fromUriString(apiUrl)
                                                .queryParam("league", leagueId)
                                                .queryParam("season", season)
                                                .build()
                                                .toUri();

                                HttpHeaders headers = new HttpHeaders();
                                headers.set("x-apisports-key", footballApiKey);
                                headers.set("Accept", "application/json");
                                HttpEntity<String> entity = new HttpEntity<>(headers);

                                ResponseEntity<String> responseRaw = restTemplate.exchange(uri, HttpMethod.GET, entity,
                                                String.class);
                                JsonNode root = objectMapper.readTree(responseRaw.getBody());
                                JsonNode responseArray = root.get("response");

                                if (responseArray == null || !responseArray.isArray())
                                        continue;

                                List<Match> syncedMatches = new ArrayList<>();
                                for (JsonNode fixtureNode : responseArray) {
                                        processFixture(fixtureNode, syncedMatches);
                                }
                                System.out.println("✅ " + syncedMatches.size() + " matchs synchronisés pour le tournoi "
                                                + leagueId);

                        } catch (Exception e) {
                                System.err.println("❌ Erreur lors de la synchro tournament " + leagueId + " : "
                                                + e.getMessage());
                        }

                        Thread.sleep(6500);
                }
        }

        public void syncAllMajorStandings(Integer season) throws Exception {
                int[] leagueIds = { 61, 39, 140, 78, 135, 2, 3, 848 };
                for (int id : leagueIds) {
                        try {
                                syncStandings(id, season);
                                Thread.sleep(6500);
                        } catch (Exception e) {
                                System.err.println("❌ Erreur synchro standings " + id + " : " + e.getMessage());
                        }
                }
        }

        public void syncStandings(Integer leagueId, Integer season) throws Exception {
                String apiUrl = "https://v3.football.api-sports.io/standings";
                java.net.URI uri = UriComponentsBuilder.fromUriString(apiUrl)
                                .queryParam("league", leagueId)
                                .queryParam("season", season)
                                .build()
                                .toUri();

                HttpHeaders headers = new HttpHeaders();
                headers.set("x-apisports-key", footballApiKey);
                HttpEntity<String> entity = new HttpEntity<>(headers);

                ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.GET, entity, String.class);
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode responseNode = root.get("response");

                if (responseNode != null && responseNode.isArray() && responseNode.size() > 0) {
                        Competition comp = competitionRepository.findByExternalId(leagueId)
                                        .orElseThrow(() -> new RuntimeException("Competition not found"));
                        comp.setStandingsJson(responseNode.get(0).get("league").get("standings").toString());
                        competitionRepository.save(comp);
                }
        }

        private void processFixture(JsonNode fixtureNode, List<Match> syncedMatches) {
                try {
                        JsonNode teams = fixtureNode.get("teams");
                        JsonNode fixture = fixtureNode.get("fixture");
                        JsonNode league = fixtureNode.get("league");
                        JsonNode goals = fixtureNode.get("goals");

                        Integer externalId = fixture.path("id").asInt();
                        LocalDateTime matchDate = DateTimeConverter.toLocalTimeFrance(fixture.path("date").asText());

                        String location = fixture.path("venue").path("name").asText(null);
                        if (location == null || location.isBlank()) {
                                location = "Lieu non communiqué";
                        }

                        Integer leagueExternalId = league.path("id").asInt();
                        String leagueName = league.path("name").asText();
                        String leagueLogo = league.path("logo").asText();
                        String round = league.path("round").asText();

                        Competition competition = competitionRepository.findByExternalId(leagueExternalId)
                                        .orElseGet(() -> competitionRepository.save(
                                                        Competition.builder()
                                                                        .name(leagueName)
                                                                        .externalId(leagueExternalId)
                                                                        .logoUrl(leagueLogo)
                                                                        .type(isCup(leagueExternalId) ? "CUP"
                                                                                        : "LEAGUE")
                                                                        .build()));

                        Integer homeExtId = teams.path("home").path("id").asInt();
                        String homeName = teams.path("home").path("name").asText();
                        Team homeTeam = teamRepository.findByExternalId(homeExtId)
                                        .or(() -> teamRepository.findByName(homeName))
                                        .orElseGet(() -> Team.builder()
                                                        .name(homeName)
                                                        .competition(competition)
                                                        .logoUrl(teams.path("home").path("logo").asText())
                                                        .externalId(homeExtId)
                                                        .build());

                        if (homeTeam.getExternalId() == null)
                                homeTeam.setExternalId(homeExtId);
                        homeTeam = teamRepository.save(homeTeam);

                        Integer awayExtId = teams.path("away").path("id").asInt();
                        String awayName = teams.path("away").path("name").asText();
                        Team awayTeam = teamRepository.findByExternalId(awayExtId)
                                        .or(() -> teamRepository.findByName(awayName))
                                        .orElseGet(() -> Team.builder()
                                                        .name(awayName)
                                                        .competition(competition)
                                                        .logoUrl(teams.path("away").path("logo").asText())
                                                        .externalId(awayExtId)
                                                        .build());

                        if (awayTeam.getExternalId() == null)
                                awayTeam.setExternalId(awayExtId);
                        awayTeam = teamRepository.save(awayTeam);

                        Match match = matchRepository.findByExternalFixtureId(externalId)
                                        .orElse(new Match());

                        match.setExternalFixtureId(externalId);
                        match.setHomeTeam(homeTeam);
                        match.setAwayTeam(awayTeam);
                        match.setMatchDate(matchDate);
                        match.setCompetition(competition);
                        match.setLocation(location);
                        match.setRound(round);
                        match.setHomeScore(goals.path("home").isNull() ? null : goals.path("home").asInt());
                        match.setAwayScore(goals.path("away").isNull() ? null : goals.path("away").asInt());

                        syncedMatches.add(matchRepository.save(match));
                } catch (Exception e) {
                        System.err.println("⚠️ Erreur sur une fixture : " + e.getMessage());
                }
        }

        private boolean isCup(Integer leagueId) {
                return leagueId == 2 || leagueId == 3 || leagueId == 848;
        }

        public List<Match> getAll() {
                return matchRepository.findAll();
        }

        public Page<MatchDto> getNextMatchesByDate(int page, int size) {
                Pageable pageable = PageRequest.of(page, size);
                return matchRepository.findByMatchDateAfterOrderByMatchDateAsc(LocalDateTime.now(), pageable)
                                .map(MatchDto::fromEntity);
        }

        public List<MatchDto> getAllMatchesByTeamId(UUID teamId) {
                Optional<Team> teamOpt = teamRepository.findById(teamId);
                if (teamOpt.isEmpty()) {
                        return List.of();
                }
                Team team = teamOpt.get();
                List<Match> matchEntities = matchRepository.findByHomeTeamOrAwayTeamOrderByMatchDateDesc(team, team);

                List<UUID> matchIds = matchEntities.stream().map(Match::getId).toList();
                List<Object[]> stats = userMatchRepository.findStatsByMatchIds(matchIds);

                java.util.Map<UUID, Double> ratingsMap = new java.util.HashMap<>();
                java.util.Map<UUID, Long> countsMap = new java.util.HashMap<>();
                for (Object[] stat : stats) {
                        ratingsMap.put((UUID) stat[0], (Double) stat[1]);
                        countsMap.put((UUID) stat[0], (Long) stat[2]);
                }

                return matchEntities.stream()
                                .map(m -> MatchDto.fromEntityWithStats(m, ratingsMap.get(m.getId()),
                                                countsMap.get(m.getId())))
                                .toList();
        }

        public Optional<MatchDto> getMatchById(Integer externalId) {
                return matchRepository.findByExternalFixtureId(externalId)
                                .map((Match m) -> {
                                        LocalDateTime now = LocalDateTime.now();
                                        boolean isFinished = m.getHomeScore() != null && m.getAwayScore() != null;
                                        boolean isNearStart = m.getMatchDate().isBefore(now.plusHours(1));

                                        boolean shouldFetch = false;
                                        if (isFinished || isNearStart) {
                                                if (m.getMatchDetail() == null
                                                                || m.getMatchDetail().getLineups() == null) {
                                                        shouldFetch = true;
                                                } else if (!isFinished && m.getMatchDetail().getLastUpdated()
                                                                .isBefore(now.minusMinutes(15))) {
                                                        shouldFetch = true;
                                                }
                                        }

                                        if (shouldFetch) {
                                                fetchAndSaveMatchDetail(m);
                                                m = matchRepository.findById(m.getId()).orElse(m);
                                        }

                                        List<Object[]> stats = userMatchRepository
                                                        .findStatsByMatchIds(List.of(m.getId()));
                                        if (!stats.isEmpty()) {
                                                return MatchDto.fromEntityWithStats(m, (Double) stats.get(0)[1],
                                                                (Long) stats.get(0)[2]);
                                        }
                                        return MatchDto.fromEntity(m);
                                });
        }

        public Page<MatchDto> findMatchesWithFilters(UUID competitionId, Boolean isFinished, String query, String round,
                        String sort,
                        int page, int size) {
                Pageable pageable = PageRequest.of(page, size);
                Page<Match> matchPage = matchRepository.findMatchesWithFilters(competitionId, isFinished, query, round,
                                sort,
                                pageable);

                List<java.util.UUID> matchIds = matchPage.getContent().stream().map(Match::getId).toList();
                List<Object[]> stats = userMatchRepository.findStatsByMatchIds(matchIds);

                java.util.Map<java.util.UUID, Double> ratingsMap = new java.util.HashMap<>();
                java.util.Map<java.util.UUID, Long> countsMap = new java.util.HashMap<>();
                for (Object[] stat : stats) {
                        ratingsMap.put((java.util.UUID) stat[0], (Double) stat[1]);
                        countsMap.put((java.util.UUID) stat[0], (Long) stat[2]);
                }

                return matchPage.map(
                                m -> MatchDto.fromEntityWithStats(m, ratingsMap.get(m.getId()),
                                                countsMap.get(m.getId())));
        }

        public List<String> getRoundsByCompetitionId(UUID competitionId) {
                return matchRepository.findDistinctRoundsByCompetitionId(competitionId);
        }

        public Page<MatchDto> getTrendingMatches(int limit) {
                Pageable pageable = PageRequest.of(0, Math.max(limit * 3, 20));
                Page<Match> matchPage = matchRepository.findMatchesWithFilters(null, true, null, null, "rating",
                                pageable);

                List<java.util.UUID> matchIds = matchPage.getContent().stream().map(Match::getId).toList();
                List<Object[]> stats = userMatchRepository.findStatsByMatchIds(matchIds);

                java.util.Map<java.util.UUID, Double> ratingsMap = new java.util.HashMap<>();
                java.util.Map<java.util.UUID, Long> countsMap = new java.util.HashMap<>();
                for (Object[] stat : stats) {
                        ratingsMap.put((java.util.UUID) stat[0], (Double) stat[1]);
                        countsMap.put((java.util.UUID) stat[0], (Long) stat[2]);
                }

                List<MatchDto> filteredMatches = matchPage.getContent().stream()
                                .filter(m -> countsMap.containsKey(m.getId()) && countsMap.get(m.getId()) > 0)
                                .limit(limit)
                                .map(m -> MatchDto.fromEntityWithStats(
                                                m,
                                                ratingsMap.get(m.getId()),
                                                countsMap.get(m.getId())))
                                .toList();

                return new org.springframework.data.domain.PageImpl<>(
                                filteredMatches,
                                PageRequest.of(0, limit),
                                filteredMatches.size());
        }

        public void fetchAndSaveMatchDetail(Match match) {
                try {
                        Integer fixtureId = match.getExternalFixtureId();
                        if (fixtureId == null)
                                return;

                        String baseUrl = "https://v3.football.api-sports.io/fixtures?id=" + fixtureId;
                        HttpHeaders headers = new HttpHeaders();
                        headers.set("x-apisports-key", footballApiKey);
                        HttpEntity<String> entity = new HttpEntity<>(headers);

                        JsonNode response = restTemplate.exchange(baseUrl, HttpMethod.GET, entity, JsonNode.class)
                                        .getBody();

                        if (response == null || !response.has("response") || response.get("response").isEmpty()) {
                                return;
                        }

                        JsonNode fixtureData = response.get("response").get(0);

                        MatchDetail detail = matchDetailRepository.findByMatchId(match.getId())
                                        .orElseGet(() -> MatchDetail.builder().match(match).build());

                        detail.setLineups(fixtureData.get("lineups"));
                        detail.setStats(fixtureData.get("statistics"));
                        detail.setEvents(fixtureData.get("events"));

                        matchDetailRepository.save(detail);

                } catch (Exception e) {
                        System.err.println("❌ Erreur lors de la récupération des détails du match "
                                        + match.getExternalFixtureId() + " : " + e.getMessage());
                }
        }

        @Scheduled(cron = "0 5 0/6 * * *")
        public void scheduledGlobalSync() {
                try {
                        System.out.println("🕒 Lancement de la synchronisation planifiée (Scores & Classements)...");
                        // 1. Sync match scores/fixtures (All)
                        fetchAndSaveNextMatches();

                        // 2. Sync standings (Major Leagues only - 39, 140, 135, 78, 61)
                        int[] majorLeagues = { 39, 140, 135, 78, 61 };
                        int season = 2025;
                        for (int leagueId : majorLeagues) {
                                try {
                                        syncStandings(leagueId, season);
                                        Thread.sleep(2000); // Small pause to respect API rate limits
                                } catch (Exception e) {
                                        System.err.println("❌ Standings sync skip for " + leagueId + ": "
                                                        + e.getMessage());
                                }
                        }
                } catch (Exception e) {
                        System.err.println("❌ Erreur lors de la sync planifiée : " + e.getMessage());
                }
        }

        @Scheduled(cron = "0 15 * * * *")
        public void prefetchUpcomingLineups() {
                LocalDateTime now = LocalDateTime.now();
                LocalDateTime inOneHour = now.plusHours(1);

                List<Match> upcomingMatches = matchRepository.findByMatchDateBetween(now, inOneHour);

                List<Match> toFetch = upcomingMatches.stream()
                                .filter(m -> m.getMatchDetail() == null || m.getMatchDetail().getLineups() == null)
                                .limit(20)
                                .toList();

                if (!toFetch.isEmpty()) {
                        fetchAndSaveMultipleMatchDetails(toFetch);
                }
        }

        public void fetchAndSaveMultipleMatchDetails(List<Match> matches) {
                try {
                        String ids = matches.stream()
                                        .map(m -> m.getExternalFixtureId().toString())
                                        .collect(Collectors.joining("-"));

                        java.net.URI uri = UriComponentsBuilder
                                        .fromUriString("https://v3.football.api-sports.io/fixtures")
                                        .queryParam("ids", ids)
                                        .build()
                                        .toUri();

                        HttpHeaders headers = new HttpHeaders();
                        headers.set("x-apisports-key", footballApiKey);
                        headers.set("Accept", "application/json");
                        HttpEntity<String> entity = new HttpEntity<>(headers);

                        ResponseEntity<JsonNode> responseEntity = restTemplate.exchange(uri, HttpMethod.GET, entity,
                                        JsonNode.class);
                        JsonNode response = responseEntity.getBody();

                        if (response == null || !response.has("response")) {
                                return;
                        }

                        JsonNode results = response.get("response");

                        for (JsonNode fixtureData : results) {
                                Integer externalId = fixtureData.get("fixture").get("id").asInt();
                                try {
                                        transactionTemplate.execute(status -> {
                                                matchRepository.findByExternalFixtureId(externalId).ifPresent(match -> {
                                                        MatchDetail detail = matchDetailRepository
                                                                        .findByMatchId(match.getId())
                                                                        .orElseGet(() -> MatchDetail.builder()
                                                                                        .match(match).build());

                                                        detail.setLineups(fixtureData.get("lineups"));
                                                        detail.setStats(fixtureData.get("statistics"));
                                                        detail.setEvents(fixtureData.get("events"));

                                                        matchDetailRepository.saveAndFlush(detail);
                                                });
                                                return null;
                                        });
                                } catch (Exception e) {
                                        System.err.println("❌ Erreur lors du traitement du match " + externalId + " : "
                                                        + e.getMessage());
                                }
                        }
                } catch (Exception e) {
                        System.err.println("❌ Erreur lors de la récupération groupée des détails : " + e.getMessage());
                }
        }

        /**
         * Backfill all historical matches from season start to present
         * 
         * @param fromDate Start date (e.g., "2025-08-01")
         * @param toDate   End date (e.g., today)
         */
        public void backfillHistoricalMatches(String fromDate, String toDate) throws Exception {
                try {
                        int season = 2025;
                        List<Integer> leagueIds = java.util.Arrays.stream(LEAGUE_IDS).boxed().toList();
                        String apiUrl = "https://v3.football.api-sports.io/fixtures";

                        List<Match> allMatches = new ArrayList<>();
                        int totalProcessed = 0;

                        System.out.println("🔄 Starting historical backfill: " + fromDate + " → " + toDate);
                        System.out.println("🔑 Using API Key: " + (footballApiKey != null && footballApiKey.length() > 4
                                        ? footballApiKey.substring(0, 4) + "..."
                                        : "invalid/none"));

                        for (Integer leagueId : leagueIds) {
                                try {
                                        System.out.println("📥 Backfilling League " + leagueId + "...");

                                        java.net.URI uri = UriComponentsBuilder.fromUriString(apiUrl)
                                                        .queryParam("league", leagueId)
                                                        .queryParam("season", season)
                                                        .queryParam("from", fromDate)
                                                        .queryParam("to", toDate)
                                                        .build()
                                                        .toUri();

                                        HttpHeaders headers = new HttpHeaders();
                                        headers.set("x-apisports-key", footballApiKey);
                                        headers.set("Accept", "application/json");
                                        HttpEntity<String> entity = new HttpEntity<>(headers);

                                        ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.GET,
                                                        entity, String.class);
                                        JsonNode root = objectMapper.readTree(response.getBody());
                                        JsonNode fixtures = root.get("response");

                                        if (fixtures != null && fixtures.isArray()) {
                                                int leagueCount = 0;
                                                for (JsonNode fixture : fixtures) {
                                                        processFixture(fixture, allMatches);
                                                        leagueCount++;
                                                }
                                                totalProcessed += leagueCount;
                                                System.out.println("   ✓ " + leagueCount
                                                                + " matches processed for league " + leagueId);
                                        }

                                        Thread.sleep(6500);

                                } catch (Exception e) {
                                        System.err.println("⚠️ Error backfilling league " + leagueId + ": "
                                                        + e.getMessage());
                                }
                        }

                        System.out.println("📊 Total fixtures processed: " + totalProcessed);

                        // Enrich finished matches with lineups (batch by 20)
                        List<Match> finishedMatches = allMatches.stream()
                                        .filter(m -> m.getHomeScore() != null && m.getAwayScore() != null)
                                        .toList();

                        // Filter out matches that already have lineups
                        List<Match> matchesNeedingLineups = finishedMatches.stream()
                                        .filter(m -> {
                                                MatchDetail detail = matchDetailRepository.findByMatchId(m.getId())
                                                                .orElse(null);
                                                return detail == null || detail.getLineups() == null;
                                        })
                                        .toList();

                        int alreadyEnriched = finishedMatches.size() - matchesNeedingLineups.size();
                        if (alreadyEnriched > 0) {
                                System.out.println("⏭️  Skipping " + alreadyEnriched
                                                + " matches that already have lineups");
                        }

                        if (matchesNeedingLineups.isEmpty()) {
                                System.out.println("✅ All finished matches already have lineups!");
                        } else {
                                System.out.println("🔍 Enriching " + matchesNeedingLineups.size()
                                                + " matches with lineups...");

                                int enriched = 0;
                                for (int i = 0; i < matchesNeedingLineups.size(); i += 20) {
                                        List<Match> batch = matchesNeedingLineups.subList(i,
                                                        Math.min(i + 20, matchesNeedingLineups.size()));
                                        fetchAndSaveMultipleMatchDetails(batch);
                                        enriched += batch.size();
                                        System.out.println("   ✓ Enriched " + enriched + "/"
                                                        + matchesNeedingLineups.size() + " matches");
                                        Thread.sleep(6500);
                                }
                        }

                        System.out.println("✅ Backfill complete! Total: " + totalProcessed + " matches, "
                                        + matchesNeedingLineups.size() + " newly enriched, "
                                        + alreadyEnriched + " already had lineups");

                } catch (Exception e) {
                        System.err.println("❌ Backfill failed: " + e.getMessage());
                        throw e;
                }
        }
}
