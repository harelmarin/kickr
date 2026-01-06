package com.kickr_server.match;

import com.kickr_server.competitions.Competition;
import com.kickr_server.competitions.CompetitionRepository;
import com.kickr_server.config.AppConfig;
import com.kickr_server.dto.match.MatchDto;
import com.kickr_server.team.Team;
import com.kickr_server.team.TeamRepository;
import com.kickr_server.utils.DateTimeConverter;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
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

/**
 * Service pour récupérer et sauvegarder les informations des matchs de football depuis l'API Football.
 */
@Service
public class MatchService {

    private final RestTemplate restTemplate;
    private final String footballApiKey;
    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;
    private final CompetitionRepository competitionRepository;
    private final ObjectMapper objectMapper;

    public MatchService(RestTemplate restTemplate, AppConfig appConfig, MatchRepository matchRepository, TeamRepository teamRepository, CompetitionRepository competitionRepository) {
        this.restTemplate = restTemplate;
        this.footballApiKey = appConfig.getFootballApiKey();
        this.matchRepository = matchRepository;
        this.teamRepository = teamRepository;
        this.competitionRepository = competitionRepository;

        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    /**
     * Récupère la liste des prochains matchs depuis l'API Football.
     */
    private List<MatchDto> fetchNextMatches() throws Exception {
        int season = 2025;
        int[] leagueIds = {
                // Championnats
                39, 140, 135, 78, 61,
                // Coupes nationales
                //45, 143, 137, 81, 66,
                // Compétitions européennes
                2, 3, 848
        };
        List<MatchDto> matches = new ArrayList<>();

        for (int leagueId : leagueIds) {
            String url = "https://v3.football.api-sports.io/fixtures?league=" + leagueId + "&season=" + season;

            HttpHeaders headers = new HttpHeaders();
            headers.set("x-apisports-key", footballApiKey);
            headers.set("Accept", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> responseRaw = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            JsonNode root = objectMapper.readTree(responseRaw.getBody());
            JsonNode responseArray = root.get("response");
            if (responseArray == null || !responseArray.isArray()) continue;

            for (JsonNode fixtureNode : responseArray) {
                JsonNode teams = fixtureNode.get("teams");
                JsonNode fixture = fixtureNode.get("fixture");
                JsonNode league = fixtureNode.get("league");
                JsonNode goals = fixtureNode.get("goals");

                Integer externalId = fixture.path("id").asInt();

                LocalDateTime matchDate = DateTimeConverter.toLocalTimeFrance(fixture.path("date").asText());

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
                                        .build()
                        ));


                MatchDto match = new MatchDto(
                        teams.path("home").path("name").asText(),
                        teams.path("home").path("logo").asText(),
                        teams.path("away").path("name").asText(),
                        teams.path("away").path("logo").asText(),
                        matchDate,
                        competition.getId(),
                        competition.getExternalId(),
                        competition.getName(),
                        competition.getLogoUrl(),
                        location,
                        goals.path("home").isNull() ? null : goals.path("home").asInt(),
                        goals.path("away").isNull() ? null : goals.path("away").asInt(),
                        externalId
                );



                matches.add(match);
            }
        }
        return matches;
    }

    /**
     * Récupère et sauvegarde tous les matchs (championnats, coupes, compétitions européennes)
     * sans gérer les stages.
     */
    public void fetchAndSaveNextMatches() throws Exception {
        int season = 2025;

        int[] leagueIds = {
                // Championnats
                39, 140, 135, 78, 61,
                // Coupes nationales
                45, 143, 137, 81, 66,
                // Compétitions européennes
                2, 3, 848
        };

        List<MatchDto> allMatches = new ArrayList<>();

        HttpHeaders headers = new HttpHeaders();
        headers.set("x-apisports-key", footballApiKey);
        headers.set("Accept", "application/json");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        for (int leagueId : leagueIds) {
            String url = "https://v3.football.api-sports.io/fixtures?league=" + leagueId + "&season=" + season;

            try {
                ResponseEntity<String> responseRaw = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
                JsonNode root = objectMapper.readTree(responseRaw.getBody());
                JsonNode responseArray = root.get("response");

                if (responseArray == null || !responseArray.isArray()) continue;

                for (JsonNode fixtureNode : responseArray) {
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

                    // ✅ Récupération / création de la compétition
                    Integer leagueExternalId = league.path("id").asInt();
                    String leagueName = league.path("name").asText();
                    String leagueLogo = league.path("logo").asText();

                    Competition competition = competitionRepository.findByExternalId(leagueExternalId)
                            .orElseGet(() -> competitionRepository.save(
                                    Competition.builder()
                                            .name(leagueName)
                                            .externalId(leagueExternalId)
                                            .logoUrl(leagueLogo)
                                            .build()
                            ));

                    // ✅ Récupération / création des équipes
                    Team homeTeam = teamRepository.findByName(teams.path("home").path("name").asText())
                            .orElseGet(() -> teamRepository.save(
                                    Team.builder()
                                            .name(teams.path("home").path("name").asText())
                                            .competition(competition)
                                            .logoUrl(teams.path("home").path("logo").asText())
                                            .build()
                            ));

                    Team awayTeam = teamRepository.findByName(teams.path("away").path("name").asText())
                            .orElseGet(() -> teamRepository.save(
                                    Team.builder()
                                            .name(teams.path("away").path("name").asText())
                                            .competition(competition)
                                            .logoUrl(teams.path("away").path("logo").asText())
                                            .build()
                            ));

                    // ✅ Vérifie si le match existe déjà
                    Optional<Match> existingMatch = matchRepository.findByExternalFixtureId(externalId);
                    Match match = existingMatch.orElseGet(Match::new);

                    match.setExternalFixtureId(externalId);
                    match.setHomeTeam(homeTeam);
                    match.setAwayTeam(awayTeam);
                    match.setMatchDate(matchDate);
                    match.setCompetition(competition);
                    match.setLocation(location);
                    match.setHomeScore(goals.path("home").isNull() ? null : goals.path("home").asInt());
                    match.setAwayScore(goals.path("away").isNull() ? null : goals.path("away").asInt());

                    matchRepository.save(match);
                }

            } catch (Exception e) {
                System.out.println("⚠️ Erreur récupération fixtures pour la ligue " + leagueId + " : " + e.getMessage());
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
    public Page<MatchDto> getNextMatchesByDate(int page) {
        Pageable pageable = PageRequest.of(page, 9);
        return matchRepository.findByMatchDateAfterOrderByMatchDateAsc(LocalDateTime.now(), pageable)
                .map(MatchDto::fromEntity);
    }

    /**
     * Récupère tous les matchs d'une équipe spécifique (passés et futurs).
     */
    public List<MatchDto> getAllMatchesByTeamId(java.util.UUID teamId) {
        Optional<Team> teamOpt = teamRepository.findById(teamId);
        if (teamOpt.isEmpty()) {
            return List.of();
        }
        Team team = teamOpt.get();
        return matchRepository.findByHomeTeamOrAwayTeamOrderByMatchDateDesc(team, team)
                .stream()
                .map(MatchDto::fromEntity)
                .toList();
    }

}
