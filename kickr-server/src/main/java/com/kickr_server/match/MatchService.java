package com.kickr_server.match;

import com.kickr_server.config.AppConfig;
import com.kickr_server.dto.Match.MatchDto;
import com.kickr_server.team.Team;
import com.kickr_server.team.TeamRepository;
import com.kickr_server.utils.DateTimeConverter;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.ArrayList;
import java.util.List;

/**
 * Service pour récupérer et sauvegarder les informations des matchs de football depuis l'API Football.
 * <p>
 * Ce service effectue les opérations suivantes :
 * <ul>
 *     <li>Récupération des prochains matchs via l'API Football</li>
 *     <li>Conversion des dates/horaires UTC en heure locale (France)</li>
 *     <li>Gestion et création des équipes si elles n'existent pas encore dans la base</li>
 *     <li>Ajout ou mise à jour des scores pour les matchs terminés</li>
 *     <li>Sauvegarde des matchs dans la base de données</li>
 * </ul>
 */
@Service
public class MatchService {

    private final RestTemplate restTemplate;
    private final String footballApiKey;
    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;

    /**
     * Constructeur du service MatchService.
     *
     * @param restTemplate     RestTemplate pour effectuer les requêtes HTTP vers l'API
     * @param appConfig        Configuration de l'application contenant la clé API Football
     * @param matchRepository  Repository pour persister les matchs
     * @param teamRepository   Repository pour persister et récupérer les équipes
     */
    public MatchService(RestTemplate restTemplate, AppConfig appConfig, MatchRepository matchRepository, TeamRepository teamRepository) {
        this.restTemplate = restTemplate;
        this.footballApiKey = appConfig.getFootballApiKey();
        this.matchRepository = matchRepository;
        this.teamRepository = teamRepository;
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    /**
     * Récupère la liste des prochains matchs depuis l'API Football et mappe chaque fixture en {@link MatchDto}.
     * <p>
     * Les horaires sont convertis en heure locale de France via {@link DateTimeConverter}.
     *
     * @return Liste de {@link MatchDto} représentant les matchs à venir ou en cours
     * @throws Exception en cas d'erreur lors de la requête HTTP ou du parsing JSON
     */
    private List<MatchDto> fetchNextMatches() throws Exception {
        String url = "https://v3.football.api-sports.io/fixtures?league=39&season=2025";

        HttpHeaders headers = new HttpHeaders();
        headers.set("x-apisports-key", footballApiKey);
        headers.set("Accept", "application/json");

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> responseRaw = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(responseRaw.getBody());
        JsonNode responseArray = root.get("response");
        if (responseArray == null || !responseArray.isArray()) {
            return List.of();
        }

        List<MatchDto> matches = new ArrayList<>();
        for (JsonNode fixtureNode : responseArray) {
            JsonNode teams = fixtureNode.get("teams");
            JsonNode fixture = fixtureNode.get("fixture");
            JsonNode league = fixtureNode.get("league");
            JsonNode goals = fixtureNode.get("goals");

            MatchDto match = new MatchDto(
                    teams.get("home").get("name").asText(),
                    teams.get("home").get("logo").asText(),
                    teams.get("away").get("name").asText(),
                    teams.get("away").get("logo").asText(),
                    DateTimeConverter.toLocalTimeFrance(fixture.get("date").asText()),
                    league.get("name").asText(),
                    fixture.get("venue") != null && !fixture.get("venue").isNull() ? fixture.get("venue").get("name").asText() : null,
                    goals.get("home").isNull() ? null : goals.get("home").asInt(),
                    goals.get("away").isNull() ? null : goals.get("away").asInt()
            );
            matches.add(match);
        }
        return matches;
    }

    /**
     * Récupère les prochains matchs et les sauvegarde dans la base de données.
     * <p>
     * Pour chaque match récupéré :
     * <ul>
     *     <li>Les équipes sont récupérées ou créées si elles n'existent pas encore</li>
     *     <li>Si le match existe déjà, ses scores sont mis à jour</li>
     *     <li>Si le match n'existe pas, il est créé avec toutes ses informations</li>
     * </ul>
     *
     * @throws Exception en cas d'erreur lors de la récupération ou de la sauvegarde des matchs
     */
    public void fetchAndSaveNextMatches() throws Exception {
        List<MatchDto> matches = fetchNextMatches();

        for (MatchDto matchDto : matches) {
            Team homeTeam = teamRepository.findByName(matchDto.getHomeTeamName())
                    .orElseGet(() -> teamRepository.save(
                            Team.builder()
                                    .name(matchDto.getHomeTeamName())
                                    .logoUrl(matchDto.getHomeTeamLogo())
                                    .build()
                    ));
            Team awayTeam = teamRepository.findByName(matchDto.getAwayTeamName())
                    .orElseGet(() -> teamRepository.save(
                            Team.builder()
                                    .name(matchDto.getAwayTeamName())
                                    .logoUrl(matchDto.getAwayTeamLogo())
                                    .build()
                    ));
            Match match = matchRepository.findByHomeTeamAndAwayTeamAndMatchDateAndCompetition(
                    homeTeam, awayTeam, matchDto.getMatchDate(), matchDto.getCompetition()
            ).orElse(null);

            if (match == null) {
                match = Match.builder()
                        .homeTeam(homeTeam)
                        .awayTeam(awayTeam)
                        .matchDate(matchDto.getMatchDate())
                        .competition(matchDto.getCompetition())
                        .location(matchDto.getLocation())
                        .homeScore(matchDto.getHomeScore())
                        .awayScore(matchDto.getAwayScore())
                        .build();
            } else {
                match.setHomeScore(matchDto.getHomeScore());
                match.setAwayScore(matchDto.getAwayScore());
            }
            matchRepository.save(match);
        }
    }
}
