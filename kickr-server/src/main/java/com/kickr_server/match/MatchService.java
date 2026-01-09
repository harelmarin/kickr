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
                        // Championnats
                        39, 140, 135, 78, 61,
                        // Coupes nationales
                        45, 143, 137, 81, 66,
                        // Compétitions européennes
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
                                JsonNode teams = fixtureNode.get("teams");
                                JsonNode fixture = fixtureNode.get("fixture");
                                JsonNode league = fixtureNode.get("league");
                                JsonNode goals = fixtureNode.get("goals");

                                Integer externalId = fixture.path("id").asInt();

                                LocalDateTime matchDate = DateTimeConverter
                                                .toLocalTimeFrance(fixture.path("date").asText());

                                String location = fixture.path("venue").path("name").asText(null);
                                if (location == null || location.isBlank()) {
                                        location = "";
                                }

                                Integer leagueExternalId = league.path("id").asInt();
                                String leagueName = league.path("name").asText();
                                String leagueLogo = league.path("logo").asText();

                                Competition competition = competitionRepository.findByExternalId(leagueExternalId)
                                                .orElseGet(() -> competitionRepository.save(
                                                                Competition.builder()
                                                                                .name(leagueName)
                                                                                .externalId(leagueExternalId)
                                                                                .logoUrl(leagueLogo)
                                                                                .build()));

                                // Récupérer ou créer les équipes pour avoir leurs IDs
                                String homeTeamName = teams.path("home").path("name").asText();
                                String homeTeamLogo = teams.path("home").path("logo").asText();
                                Integer homeTeamExternalId = teams.path("home").path("id").asInt();

                                Team homeTeam = teamRepository.findByExternalId(homeTeamExternalId)
                                                .orElseGet(() -> teamRepository.save(
                                                                Team.builder()
                                                                                .name(homeTeamName)
                                                                                .externalId(homeTeamExternalId)
                                                                                .logoUrl(homeTeamLogo)
                                                                                .competition(competition)
                                                                                .build()));

                                String awayTeamName = teams.path("away").path("name").asText();
                                String awayTeamLogo = teams.path("away").path("logo").asText();
                                Integer awayTeamExternalId = teams.path("away").path("id").asInt();

                                Team awayTeam = teamRepository.findByExternalId(awayTeamExternalId)
                                                .orElseGet(() -> teamRepository.save(
                                                                Team.builder()
                                                                                .name(awayTeamName)
                                                                                .externalId(awayTeamExternalId)
                                                                                .logoUrl(awayTeamLogo)
                                                                                .competition(competition)
                                                                                .build()));

                                MatchDto match = new MatchDto(
                                                homeTeamName,
                                                homeTeam.getId(),
                                                homeTeamLogo,
                                                awayTeamName,
                                                awayTeam.getId(),
                                                awayTeamLogo,
                                                homeTeamExternalId,
                                                awayTeamExternalId,
                                                matchDate,
                                                competition.getId(),
                                                competition.getExternalId(),
                                                competition.getName(),
                                                competition.getLogoUrl(),
                                                location,
                                                goals.path("home").isNull() ? null : goals.path("home").asInt(),
                                                goals.path("away").isNull() ? null : goals.path("away").asInt(),
                                                null,
                                                externalId,
                                                0.0,
                                                0L,
                                                null,
                                                null,
                                                null);

                                matches.add(match);
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
                                                // ... existing sync logic ...
                                                JsonNode teams = fixtureNode.get("teams");
                                                JsonNode fixture = fixtureNode.get("fixture");
                                                JsonNode league = fixtureNode.get("league");
                                                JsonNode goals = fixtureNode.get("goals");

                                                Integer externalId = fixture.path("id").asInt();
                                                LocalDateTime matchDate = DateTimeConverter
                                                                .toLocalTimeFrance(fixture.path("date").asText());

                                                String location = fixture.path("venue").path("name").asText(null);
                                                if (location == null || location.isBlank()) {
                                                        location = "Lieu non communiqué";
                                                }

                                                // ✅ Récupération / création de la compétition
                                                Integer leagueExternalId = league.path("id").asInt();
                                                String leagueName = league.path("name").asText();
                                                String leagueLogo = league.path("logo").asText();

                                                Competition competition = competitionRepository
                                                                .findByExternalId(leagueExternalId)
                                                                .orElseGet(() -> competitionRepository.save(
                                                                                Competition.builder()
                                                                                                .name(leagueName)
                                                                                                .externalId(leagueExternalId)
                                                                                                .logoUrl(leagueLogo)
                                                                                                .build()));

                                                // ✅ Récupération / création des équipes
                                                Team homeTeam = teamRepository
                                                                .findByName(teams.path("home").path("name").asText())
                                                                .orElseGet(() -> teamRepository.save(
                                                                                Team.builder()
                                                                                                .name(teams.path("home")
                                                                                                                .path("name")
                                                                                                                .asText())
                                                                                                .competition(competition)
                                                                                                .logoUrl(teams.path(
                                                                                                                "home")
                                                                                                                .path("logo")
                                                                                                                .asText())
                                                                                                .build()));

                                                Team awayTeam = teamRepository
                                                                .findByName(teams.path("away").path("name").asText())
                                                                .orElseGet(() -> teamRepository.save(
                                                                                Team.builder()
                                                                                                .name(teams.path("away")
                                                                                                                .path("name")
                                                                                                                .asText())
                                                                                                .competition(competition)
                                                                                                .logoUrl(teams.path(
                                                                                                                "away")
                                                                                                                .path("logo")
                                                                                                                .asText())
                                                                                                .build()));

                                                // ✅ Vérifie si le match existe déjà
                                                Optional<Match> existingMatch = matchRepository
                                                                .findByExternalFixtureId(externalId);
                                                Match match = existingMatch.orElseGet(Match::new);

                                                match.setExternalFixtureId(externalId);
                                                match.setHomeTeam(homeTeam);
                                                match.setAwayTeam(awayTeam);
                                                match.setMatchDate(matchDate);
                                                match.setCompetition(competition);
                                                match.setLocation(location);
                                                match.setHomeScore(goals.path("home").isNull() ? null
                                                                : goals.path("home").asInt());
                                                match.setAwayScore(goals.path("away").isNull() ? null
                                                                : goals.path("away").asInt());

                                                Match savedMatch = matchRepository.save(match);
                                                syncedMatches.add(savedMatch);
                                        }

                                } catch (Exception e) {
                                        System.out.println("⚠️ Erreur récupération fixtures pour la ligue " + leagueId
                                                        + " : "
                                                        + e.getMessage());
                                }

                                // ✅ Respect de la limite de 10 req/minute : pause de 6.5s entre chaque ligue
                                try {
                                        System.out.println(
                                                        "⏳ Attente de 6.5s pour respecter la limite API (10 req/min)...");
                                        Thread.sleep(6500);
                                } catch (InterruptedException ie) {
                                        Thread.currentThread().interrupt();
                                }
                        }

                        // ✅ Enrichissement des détails pour les 20 matchs les plus récents qui n'en ont
                        // pas
                        // (finis ou imminents)
                        List<Match> toEnrich = matchRepository.findMatchesNeedingDetailEnrichment(
                                        LocalDateTime.now().plusHours(2),
                                        PageRequest.of(0, 20));

                        if (!toEnrich.isEmpty()) {
                                System.out.println("ℹ️ Enrichissement batch de " + toEnrich.size()
                                                + " matchs détectés...");
                                fetchAndSaveMultipleMatchDetails(toEnrich);
                        } else {
                                System.out.println(
                                                "ℹ️ Aucun match ne nécessite d'enrichissement de détails pour le moment.");
                        }

                        System.out.println("✅ Synchronisation des matchs terminée.");

                } catch (Exception e) {
                        System.err.println("❌ Erreur globale lors de la synchronisation : " + e.getMessage());
                        throw e;
                }
        }

        /**
         * Récupère tous les matchs enregistrés.
         */
        public List<Match> getAll() {
                return matchRepository.findAll();
        }

        /**
         * Récupère les prochains matchs (après la date actuelle) avec pagination.
         */
        public Page<MatchDto> getNextMatchesByDate(int page, int size) {
                Pageable pageable = PageRequest.of(page, size);
                return matchRepository.findByMatchDateAfterOrderByMatchDateAsc(LocalDateTime.now(), pageable)
                                .map(MatchDto::fromEntity);
        }

        /**
         * Récupère tous les matchs d'une équipe spécifique (passés et futurs).
         */
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

        /**
         * Récupère un match spécifique par son ID externe (fixture ID).
         */
        public Optional<MatchDto> getMatchById(Integer externalId) {
                return matchRepository.findByExternalFixtureId(externalId)
                                .map((Match m) -> {
                                        // ✅ Stratégie intelligente de cache pour économiser tes 100 req/jour
                                        LocalDateTime now = LocalDateTime.now();
                                        boolean isFinished = m.getHomeScore() != null && m.getAwayScore() != null;
                                        boolean isNearStart = m.getMatchDate().isBefore(now.plusHours(1));

                                        boolean shouldFetch = false;
                                        if (isFinished || isNearStart) {
                                                if (m.getMatchDetail() == null
                                                                || m.getMatchDetail().getLineups() == null) {
                                                        // On n'a aucune donnée riche (lineups/stats)
                                                        shouldFetch = true;
                                                } else if (!isFinished && m.getMatchDetail().getLastUpdated()
                                                                .isBefore(now.minusMinutes(15))) {
                                                        // Le match est en cours ou proche : on rafraîchit toutes les 15
                                                        // mins max
                                                        shouldFetch = true;
                                                }
                                        }

                                        if (shouldFetch) {
                                                fetchAndSaveMatchDetail(m);
                                                // Recharger le match pour avoir les détails fraîchement sauvés
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

        public Page<MatchDto> findMatchesWithFilters(UUID competitionId, Boolean isFinished, String query, String sort,
                        int page, int size) {
                Pageable pageable = PageRequest.of(page, size);
                Page<Match> matchPage = matchRepository.findMatchesWithFilters(competitionId, isFinished, query, sort,
                                pageable);

                // Récupérer les stats pour les matchs de la page
                List<java.util.UUID> matchIds = matchPage.getContent().stream().map(Match::getId).toList();
                List<Object[]> stats = userMatchRepository.findStatsByMatchIds(matchIds);

                // Mapper les stats par matchId
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

        /**
         * Récupère les matchs les mieux notés (trending)
         * Filtre uniquement les matchs qui ont au moins une note
         */
        public Page<MatchDto> getTrendingMatches(int limit) {
                // Récupérer plus de matchs pour avoir assez après filtrage
                Pageable pageable = PageRequest.of(0, Math.max(limit * 3, 20));
                Page<Match> matchPage = matchRepository.findMatchesWithFilters(null, true, null, "rating", pageable);

                // Récupérer les stats pour les matchs de la page
                List<java.util.UUID> matchIds = matchPage.getContent().stream().map(Match::getId).toList();
                List<Object[]> stats = userMatchRepository.findStatsByMatchIds(matchIds);

                // Mapper les stats par matchId
                java.util.Map<java.util.UUID, Double> ratingsMap = new java.util.HashMap<>();
                java.util.Map<java.util.UUID, Long> countsMap = new java.util.HashMap<>();
                for (Object[] stat : stats) {
                        ratingsMap.put((java.util.UUID) stat[0], (Double) stat[1]);
                        countsMap.put((java.util.UUID) stat[0], (Long) stat[2]);
                }

                // Filtrer uniquement les matchs qui ont au moins une note et limiter
                List<MatchDto> filteredMatches = matchPage.getContent().stream()
                                .filter(m -> countsMap.containsKey(m.getId()) && countsMap.get(m.getId()) > 0)
                                .limit(limit)
                                .map(m -> MatchDto.fromEntityWithStats(
                                                m,
                                                ratingsMap.get(m.getId()),
                                                countsMap.get(m.getId())))
                                .toList();

                // Créer une page avec les résultats filtrés
                return new org.springframework.data.domain.PageImpl<>(
                                filteredMatches,
                                PageRequest.of(0, limit),
                                filteredMatches.size());
        }

        /**
         * Récupère et sauvegarde les détails riches d'un match (lineups, stats,
         * events).
         */
        public void fetchAndSaveMatchDetail(Match match) {
                try {
                        Integer fixtureId = match.getExternalFixtureId();
                        if (fixtureId == null)
                                return;

                        String baseUrl = "https://v3.football.api-sports.io/fixtures?id=" + fixtureId;
                        HttpHeaders headers = new HttpHeaders();
                        headers.set("x-apisports-key", footballApiKey);
                        HttpEntity<String> entity = new HttpEntity<>(headers);

                        // Un seul appel pour tout récupérer (fixtures?id renvoie lineups, stats et
                        // events)
                        JsonNode response = restTemplate.exchange(baseUrl, HttpMethod.GET, entity, JsonNode.class)
                                        .getBody();

                        if (response == null || !response.has("response") || response.get("response").isEmpty()) {
                                return;
                        }

                        JsonNode fixtureData = response.get("response").get(0);

                        MatchDetail detail = matchDetailRepository.findByMatchId(match.getId())
                                        .orElseGet(() -> MatchDetail.builder().match(match).build());

                        // Conversion JsonNode -> Object (Map/List) pour Hibernate
                        detail.setLineups(fixtureData.get("lineups"));
                        detail.setStats(fixtureData.get("statistics"));
                        detail.setEvents(fixtureData.get("events"));

                        matchDetailRepository.save(detail);

                } catch (Exception e) {
                        System.err.println("❌ Erreur lors de la récupération des détails du match "
                                        + match.getExternalFixtureId() + " : " + e.getMessage());
                }
        }

        /**
         * Tâche planifiée pour synchroniser les scores de toutes les ligues.
         * S'exécute toutes les 6 heures pour économiser le quota (100 req/jour).
         * 12 ligues * 4 fois = 48 requêtes/jour.
         */
        @Scheduled(cron = "0 5 0/6 * * *")
        public void scheduledGlobalSync() {
                try {
                        System.out.println("🕒 Lancement de la synchronisation planifiée des scores...");
                        fetchAndSaveNextMatches();
                } catch (Exception e) {
                        System.err.println("❌ Erreur lors de la sync planifiée : " + e.getMessage());
                }
        }

        /**
         * Tâche planifiée pour pré-récupérer les compositions d'équipes 1h avant le
         * début du match.
         * S'exécute toutes les heures.
         */
        @Scheduled(cron = "0 15 * * * *")
        public void prefetchUpcomingLineups() {
                LocalDateTime now = LocalDateTime.now();
                LocalDateTime inOneHour = now.plusHours(1);

                // Récupérer les matchs qui commencent dans l'heure qui vient
                List<Match> upcomingMatches = matchRepository.findByMatchDateBetween(now, inOneHour);

                List<Match> toFetch = upcomingMatches.stream()
                                .filter(m -> m.getMatchDetail() == null || m.getMatchDetail().getLineups() == null)
                                .limit(20) // On peut même monter à 20 sans soucis car c'est 1 seule requête !
                                .toList();

                if (!toFetch.isEmpty()) {
                        fetchAndSaveMultipleMatchDetails(toFetch);
                }
        }

        /**
         * Récupère et sauvegarde les détails de plusieurs matchs en un seul appel API
         * (Optimisation Quota).
         */
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

                        System.out.println("DEBUG: Appel API Batch URI: " + uri);
                        HttpHeaders headers = new HttpHeaders();
                        headers.set("x-apisports-key", footballApiKey);
                        headers.set("Accept", "application/json");
                        HttpEntity<String> entity = new HttpEntity<>(headers);

                        ResponseEntity<JsonNode> responseEntity = restTemplate.exchange(uri, HttpMethod.GET, entity,
                                        JsonNode.class);
                        JsonNode response = responseEntity.getBody();

                        if (response == null || !response.has("response")) {
                                System.err.println("❌ Réponse API Batch vide ou invalide. Body: "
                                                + (response != null ? response.toString() : "null"));
                                return;
                        }

                        if (response.has("errors") && !response.get("errors").isEmpty()
                                        && response.get("errors").size() > 0) {
                                System.err.println(
                                                "⚠️ API a renvoyé des erreurs: " + response.get("errors").toString());
                        }

                        JsonNode results = response.get("response");
                        System.out.println("ℹ️ API a renvoyé " + results.size() + " résultats de détails.");

                        if (results.size() == 0) {
                                System.out.println("DEBUG: Response JSON complet: " + response.toString());
                        }

                        for (JsonNode fixtureData : results) {
                                Integer externalId = fixtureData.get("fixture").get("id").asInt();
                                try {
                                        transactionTemplate.execute(status -> {
                                                matchRepository.findByExternalFixtureId(externalId).ifPresent(match -> {
                                                        MatchDetail detail = matchDetailRepository
                                                                        .findByMatchId(match.getId())
                                                                        .orElseGet(() -> {
                                                                                System.out.println(
                                                                                                "🆕 Création nouveau MatchDetail pour match ID: "
                                                                                                                + match.getId()
                                                                                                                + " (Ext: "
                                                                                                                + externalId
                                                                                                                + ")");
                                                                                return MatchDetail.builder()
                                                                                                .match(match).build();
                                                                        });

                                                        detail.setLineups(fixtureData.get("lineups"));
                                                        detail.setStats(fixtureData.get("statistics"));
                                                        detail.setEvents(fixtureData.get("events"));

                                                        matchDetailRepository.saveAndFlush(detail);
                                                        System.out.println("✅ Détails enregistrés en base pour match "
                                                                        + externalId);
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
                        e.printStackTrace();
                }
        }

}
