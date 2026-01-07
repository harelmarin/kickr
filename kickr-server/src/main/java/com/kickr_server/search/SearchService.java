package com.kickr_server.search;

import com.kickr_server.competitions.Competition;
import com.kickr_server.competitions.CompetitionRepository;
import com.kickr_server.dto.User.UserDto;
import com.kickr_server.dto.competition.CompetitionDto;
import com.kickr_server.dto.team.TeamDto;
import com.kickr_server.team.Team;
import com.kickr_server.team.TeamRepository;
import com.kickr_server.user.User;
import com.kickr_server.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final CompetitionRepository competitionRepository;

    /**
     * Searches across users, teams, and competitions based on the query string.
     *
     * @param query the search query
     * @return SearchResponseDTO containing matching results
     */
    public SearchResponseDTO search(String query) {
        if (query == null || query.trim().isEmpty()) {
            return new SearchResponseDTO(List.of(), List.of(), List.of());
        }

        String trimmedQuery = query.trim();

        // Search users by name or email
        List<User> users = userRepository
                .findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(trimmedQuery, trimmedQuery);
        List<UserDto> userDtos = users.stream()
                .limit(10) // Limit results
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());

        // Search teams by name
        List<Team> teams = teamRepository.findByNameContainingIgnoreCase(trimmedQuery);
        List<TeamDto> teamDtos = teams.stream()
                .limit(10) // Limit results
                .map(TeamDto::fromEntity)
                .collect(Collectors.toList());

        // Search competitions by name
        List<Competition> competitions = competitionRepository.findByNameContainingIgnoreCase(trimmedQuery);
        List<CompetitionDto> competitionDtos = competitions.stream()
                .limit(10) // Limit results
                .map(CompetitionDto::fromEntity)
                .collect(Collectors.toList());

        return new SearchResponseDTO(userDtos, teamDtos, competitionDtos);
    }
}
