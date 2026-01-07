package com.kickr_server.dto.UserMatch;

import com.kickr_server.dto.match.MatchDto;
import com.kickr_server.dto.User.UserDto;
import com.kickr_server.usermatch.UserMatch;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserMatchFullDto {

    private UUID id;
    private UserDto user;
    private MatchDto match;
    private double note;
    private String comment;
    private boolean isLiked;
    private LocalDateTime watchedAt;

    public static UserMatchFullDto fromEntity(UserMatch entity) {
        MatchDto matchDto = new MatchDto(
                entity.getMatch().getHomeTeam().getName(),
                entity.getMatch().getHomeTeam().getId(),
                entity.getMatch().getHomeTeam().getLogoUrl(),
                entity.getMatch().getAwayTeam().getName(),
                entity.getMatch().getAwayTeam().getId(),
                entity.getMatch().getAwayTeam().getLogoUrl(),
                entity.getMatch().getMatchDate(),
                entity.getMatch().getCompetition().getId(),
                entity.getMatch().getCompetition().getExternalId(),
                entity.getMatch().getCompetition().getName(),
                entity.getMatch().getCompetition().getLogoUrl(),
                entity.getMatch().getLocation(),
                entity.getMatch().getHomeScore(),
                entity.getMatch().getAwayScore(),
                entity.getMatch().getId(), // matchUuid
                entity.getMatch().getExternalFixtureId(),
                0.0,
                0L);

        return new UserMatchFullDto(
                entity.getId(),
                UserDto.fromEntity(entity.getUser()),
                matchDto,
                entity.getNote(),
                entity.getComment(),
                entity.isLiked(),
                entity.getWatchedAt());
    }
}
