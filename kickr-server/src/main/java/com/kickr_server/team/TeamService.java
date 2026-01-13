package com.kickr_server.team;

import com.kickr_server.dto.team.TeamDto;
import com.kickr_server.exception.team.TeamNotFoundException;
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
                .orElseThrow(() -> new TeamNotFoundException("Team introuvable"));
    }

    public Team getTeamByIdOrExternalId(String idStr) {
        try {
            UUID id = UUID.fromString(idStr);
            return getTeamById(id);
        } catch (IllegalArgumentException e) {
            // Not a UUID, try externalId
            try {
                Integer externalId = Integer.parseInt(idStr);
                return teamRepository.findByExternalId(externalId)
                        .orElseThrow(
                                () -> new TeamNotFoundException("Team introuvable avec l'ID externe: " + externalId));
            } catch (NumberFormatException nfe) {
                throw new TeamNotFoundException("ID d'équipe invalide: " + idStr);
            }
        }
    }

    public List<Team> getTeamsByCompetitionId(UUID competitionId) {
        return teamRepository.findTeamsByCompetitionId(competitionId);
    }

    public Page<TeamDto> getTeamsByCompetitionIdPaginated(UUID competitionId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return teamRepository.findTeamsByCompetitionId(competitionId, pageable)
                .map(TeamDto::fromEntity);
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
