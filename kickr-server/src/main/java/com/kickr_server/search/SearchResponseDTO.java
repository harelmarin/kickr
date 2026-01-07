package com.kickr_server.search;

import com.kickr_server.dto.competition.CompetitionDto;
import com.kickr_server.dto.team.TeamDto;
import com.kickr_server.dto.User.UserDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchResponseDTO {
    private List<UserDto> users;
    private List<TeamDto> teams;
    private List<CompetitionDto> competitions;
}
