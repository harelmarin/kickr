package com.kickr_server.match;

import com.kickr_server.dto.ExternalMatchDto;
import com.kickr_server.dto.ExternalMatchResponse;
import com.kickr_server.team.Team;
import com.kickr_server.team.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;
    private final RestTemplate restTemplate; // injecté via Spring

    public List<Match> fetchAndSaveNextMatches() {
        String url = "https://api-football.com/v3/fixtures?league=PL&season=2025";
        ResponseEntity<ExternalMatchResponse> response = restTemplate.getForEntity(url, ExternalMatchResponse.class);
        assert response.getBody() != null;

        List<ExternalMatchDto> externalMatches = response.getBody().getMatches();

        return externalMatches.stream().map(dto -> {
            // Récupérer ou créer les équipes
            Team homeTeam = teamRepository.findByName(dto.getHomeTeamName())
                    .orElseGet(() -> teamRepository.save(
                            new Team(null, dto.getHomeTeamName(), dto.getHomeTeamLogo())
                    ));

            Team awayTeam = teamRepository.findByName(dto.getAwayTeamName())
                    .orElseGet(() -> teamRepository.save(
                            new Team(null, dto.getAwayTeamName(), dto.getAwayTeamLogo())
                    ));

            // Vérifier si le match existe déjà (homeTeam + awayTeam + date + competition)
            return matchRepository.findByHomeTeamAndAwayTeamAndMatchDateAndCompetition(
                            homeTeam, awayTeam, dto.getMatchDate(), dto.getCompetition())
                    .orElseGet(() -> {
                        Match match = Match.builder()
                                .homeTeam(homeTeam)
                                .awayTeam(awayTeam)
                                .matchDate(dto.getMatchDate())
                                .competition(dto.getCompetition())
                                .location(dto.getLocation())
                                .build();
                        return matchRepository.save(match);
                    });
        }).toList();
    }
}
