package com.kickr_server.dto.notification;

import com.kickr_server.notification.Notification;
import com.kickr_server.notification.NotificationType;
import lombok.Builder;
import java.time.LocalDateTime;
import java.util.UUID;

@Builder
public record NotificationDto(
        UUID id,
        UUID recipientId,
        UUID actorId,
        String actorName,
        NotificationType type,
        String message,
        String targetId,
        boolean isRead,
        LocalDateTime createdAt) {
    public static NotificationDto fromEntity(Notification entity) {
        return NotificationDto.builder()
                .id(entity.getId())
                .recipientId(entity.getRecipient().getId())
                .actorId(entity.getActor().getId())
                .actorName(entity.getActor().getName())
                .type(entity.getType())
                .message(entity.getMessage())
                .targetId(entity.getTargetId())
                .isRead(entity.isRead())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
