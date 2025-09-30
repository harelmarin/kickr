package com.kickr_server.match;

import com.kickr_server.config.AppConfig;
import com.kickr_server.dto.MatchDto;
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
 * Service pour récupérer les informations sur les matchs de football depuis l'API Football.
 * <p>
 * Ce service envoie des requêtes HTTP à l'API Football et convertit les données reçues en objets
 * {@link MatchDto} exploitables par l'application.
 */
@Service
public class MatchService {

    private final RestTemplate restTemplate;
    private final String footballApiKey;

    /**
     * Constructeur du service MatchService.
     *
     * @param restTemplate RestTemplate pour effectuer les requêtes HTTP
     * @param appConfig    Configuration de l'application contenant la clé API Football
     */
    public MatchService(RestTemplate restTemplate, AppConfig appConfig) {
        this.restTemplate = restTemplate;
        this.footballApiKey = appConfig.getFootballApiKey();
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    /**
     * Récupère la liste des prochains matchs pour une ligue et une saison données.
     * <p>
     * La méthode effectue une requête GET vers l'API Football, parse la réponse JSON et
     * transforme chaque fixture en {@link MatchDto}. Les horaires sont convertis en heure locale de France.
     *
     * @return une liste de {@link MatchDto} représentant les matchs
     * @throws Exception en cas d'erreur lors de la requête HTTP ou du parsing JSON
     */
    public List<MatchDto> fetchNextMatches() throws Exception {
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
                    DateTimeConverter.toLocalTimeFrance(fixture.get("date").asText()), // Conversion en heure locale France
                    league.get("name").asText(),
                    fixture.get("venue") != null && !fixture.get("venue").isNull() ? fixture.get("venue").get("name").asText() : null,
                    goals.get("home").isNull() ? null : goals.get("home").asInt(),
                    goals.get("away").isNull() ? null : goals.get("away").asInt()
            );

            matches.add(match);
        }
        return matches;
    }
}
