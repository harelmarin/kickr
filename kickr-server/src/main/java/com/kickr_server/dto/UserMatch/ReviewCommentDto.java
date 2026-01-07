package com.kickr_server.dto.UserMatch;

import com.kickr_server.usermatch.ReviewComment;
import java.time.LocalDateTime;
import java.util.UUID;

public record ReviewCommentDto(
        UUID id,
        UUID userMatchId,
        UUID userId,
        String userName,
        String content,
        LocalDateTime createdAt) {
    public static ReviewCommentDto fromEntity(ReviewComment entity) {
        return new ReviewCommentDto(
                entity.getId(),
                entity.getUserMatch().getId(),
                entity.getUser().getId(),
                entity.getUser().getName(),
                entity.getContent(),
                entity.getCreatedAt());
    }
}
