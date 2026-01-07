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
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
        private final ObjectMapper objectMapper;

        public MatchService(RestTemplate restTemplate, AppConfig appConfig, MatchRepository matchRepository,
                        TeamRepository teamRepository, CompetitionRepository competitionRepository,
                        UserMatchRepository userMatchRepository, ObjectMapper objectMapper) {
                this.restTemplate = restTemplate;
                this.footballApiKey = appConfig.getFootballApiKey();
                this.matchRepository = matchRepository;
                this.teamRepository = teamRepository;
                this.competitionRepository = competitionRepository;
                this.userMatchRepository = userMatchRepository;
                this.objectMapper = objectMapper;
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
                                                0L);

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
                int season = 2025;

                HttpHeaders headers = new HttpHeaders();
                headers.set("x-apisports-key", footballApiKey);
                headers.set("Accept", "application/json");

                HttpEntity<String> entity = new HttpEntity<>(headers);

                for (int leagueId : LEAGUE_IDS) {
                        String url = "https://v3.football.api-sports.io/fixtures?league=" + leagueId + "&season="
                                        + season;

                        try {
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
                                                                                        .logoUrl(teams.path("home")
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
                                                                                        .logoUrl(teams.path("away")
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

                                        matchRepository.save(match);
                                }

                        } catch (Exception e) {
                                System.out.println("⚠️ Erreur récupération fixtures pour la ligue " + leagueId + " : "
                                                + e.getMessage());
                        }
                }

                System.out.println("✅ Synchronisation des matchs terminée (toutes compétitions confondues).");
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
                                        List<Object[]> stats = userMatchRepository
                                                        .findStatsByMatchIds(List.of(m.getId()));
                                        if (!stats.isEmpty()) {
                                                return MatchDto.fromEntityWithStats(m, (Double) stats.get(0)[1],
                                                                (Long) stats.get(0)[2]);
                                        }
                                        return MatchDto.fromEntity(m);
                                });
        }

        public Page<MatchDto> findMatchesWithFilters(UUID competitionId, Boolean isFinished, String sort,
                        int page, int size) {
                Pageable pageable = PageRequest.of(page, size);
                Page<Match> matchPage = matchRepository.findMatchesWithFilters(competitionId, isFinished, sort,
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

                return matchPage.map(m -> MatchDto.fromEntityWithStats(
                                m,
                                ratingsMap.get(m.getId()),
                                countsMap.get(m.getId())));
        }

}
