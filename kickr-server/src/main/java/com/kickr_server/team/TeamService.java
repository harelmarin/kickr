package com.kickr_server.team;

import com.kickr_server.dto.team.TeamDto;
import com.kickr_server.team.Team;
import com.kickr_server.team.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    /**
     * Recherche paginée d'équipes avec tri alphabétique
     */
    public Page<TeamDto> searchTeams(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        
        if (search != null && !search.trim().isEmpty()) {
            return teamRepository.findByNameContainingIgnoreCase(search.trim(), pageable)
                    .map(TeamDto::fromEntity);
        } else {
            return teamRepository.findAllByOrderByNameAsc(pageable)
                    .map(TeamDto::fromEntity);
        }
    }
}
