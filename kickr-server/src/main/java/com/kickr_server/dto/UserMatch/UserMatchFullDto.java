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
    private int likesCount;
    private LocalDateTime watchedAt;

    public static UserMatchFullDto fromEntity(UserMatch entity) {
        MatchDto matchDto = MatchDto.fromEntity(entity.getMatch());

        return new UserMatchFullDto(
                entity.getId(),
                UserDto.fromEntity(entity.getUser()),
                matchDto,
                entity.getNote(),
                entity.getComment(),
                entity.isLiked(),
                entity.getLikesCount(),
                entity.getWatchedAt());
    }
}
