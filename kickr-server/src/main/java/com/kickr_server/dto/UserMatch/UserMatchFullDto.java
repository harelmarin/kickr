package com.kickr_server.dto.UserMatch;

import com.kickr_server.dto.Match.MatchDto;
import com.kickr_server.dto.User.UserDto;
import com.kickr_server.usermatch.UserMatch;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor // nécessaire pour Jackson
@AllArgsConstructor
public class UserMatchFullDto {

    private UUID id;
    private UserDto user;
    private MatchDto match;
    private int note;
    private String comment;
    private LocalDateTime watchedAt;

    public static UserMatchFullDto fromEntity(UserMatch entity) {
        MatchDto matchDto = new MatchDto(
                entity.getMatch().getHomeTeam().getName(),
                entity.getMatch().getHomeTeam().getLogoUrl(),
                entity.getMatch().getAwayTeam().getName(),
                entity.getMatch().getAwayTeam().getLogoUrl(),
                entity.getMatch().getMatchDate(),
                entity.getMatch().getCompetition(),
                entity.getMatch().getLocation(),
                entity.getMatch().getHomeScore(),
                entity.getMatch().getAwayScore()
        );

        return new UserMatchFullDto(
                entity.getId(),
                UserDto.fromEntity(entity.getUser()),
                matchDto,
                entity.getNote(),
                entity.getComment(),
                entity.getWatchedAt()
        );
    }
}
