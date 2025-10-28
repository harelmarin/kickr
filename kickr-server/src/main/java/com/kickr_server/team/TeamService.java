package com.kickr_server.team;

import com.kickr_server.team.Team;
import com.kickr_server.team.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;

    public List<Team> findAll() {
        return teamRepository.findAll();
    }

    public Team getTeamById(UUID id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team introuvable"));
    }

    public List<Team> getTeamsByCompetitionId(UUID competitionId) {
        return teamRepository.findByCompetitionId(competitionId);
    }
}
