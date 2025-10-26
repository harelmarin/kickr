package com.kickr_server.match;

import com.kickr_server.config.AppConfig;
import com.kickr_server.dto.Match.MatchDto;
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
    private final ObjectMapper objectMapper;

    public MatchService(RestTemplate restTemplate, AppConfig appConfig, MatchRepository matchRepository, TeamRepository teamRepository) {
        this.restTemplate = restTemplate;
        this.footballApiKey = appConfig.getFootballApiKey();
        this.matchRepository = matchRepository;
        this.teamRepository = teamRepository;

        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    /**
     * Récupère la liste des prochains matchs depuis l'API Football.
     */
    private List<MatchDto> fetchNextMatches() throws Exception {
        int season = 2025;
        int[] leagueIds = {39, 140, 135, 78, 61}; // Premier League, La Liga, Serie A, Bundesliga, Ligue 1
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

                MatchDto match = new MatchDto(
                        teams.path("home").path("name").asText(),
                        teams.path("home").path("logo").asText(),
                        teams.path("away").path("name").asText(),
                        teams.path("away").path("logo").asText(),
                        DateTimeConverter.toLocalTimeFrance(fixture.path("date").asText()),
                        league.path("name").asText(),
                        fixture.path("venue").path("name").asText(null),
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
     * Récupère les prochains matchs et les sauvegarde dans la base de données.
     */
    public void fetchAndSaveNextMatches() throws Exception {
        List<MatchDto> matches = fetchNextMatches();

        for (MatchDto matchDto : matches) {

            // 1️⃣ Vérifie si les équipes existent déjà
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

            Optional<Match> existingMatch = matchRepository.findByExternalFixtureId(matchDto.getExternalFixtureId());

            Match match;
            if (existingMatch.isPresent()) {
                match = existingMatch.get();
                match.setHomeScore(matchDto.getHomeScore());
                match.setAwayScore(matchDto.getAwayScore());
                match.setMatchDate(matchDto.getMatchDate());
                match.setCompetition(matchDto.getCompetition());
                match.setLocation(matchDto.getLocation());
                match.setExternalFixtureId(matchDto.getExternalFixtureId());
            } else {
                match = Match.builder()
                        .externalFixtureId(matchDto.getExternalFixtureId())
                        .homeTeam(homeTeam)
                        .awayTeam(awayTeam)
                        .matchDate(matchDto.getMatchDate())
                        .competition(matchDto.getCompetition())
                        .location(matchDto.getLocation())
                        .homeScore(matchDto.getHomeScore())
                        .awayScore(matchDto.getAwayScore())
                        .build();
            }

            matchRepository.save(match);
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
    public Page<MatchDto> getNextMatchesByDate(int page) {
        Pageable pageable = PageRequest.of(page, 9);
        return matchRepository.findByMatchDateAfterOrderByMatchDateAsc(LocalDateTime.now(), pageable)
                .map(MatchDto::fromEntity);
    }
}
