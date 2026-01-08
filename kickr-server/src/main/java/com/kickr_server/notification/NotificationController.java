package com.kickr_server.notification;

import com.kickr_server.dto.notification.NotificationDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/user/{userId}")
    public List<NotificationDto> getNotifications(@PathVariable UUID userId) {
        return notificationService.getNotificationsForUser(userId).stream()
                .map(NotificationDto::fromEntity)
                .toList();
    }

    @GetMapping("/unread-count/{userId}")
    public long getUnreadCount(@PathVariable UUID userId) {
        return notificationService.getUnreadCount(userId);
    }

    @PostMapping("/{id}/read")
    public void markAsRead(@PathVariable UUID id) {
        notificationService.markAsRead(id);
    }

    @PostMapping("/user/{userId}/read-all")
    public void markAllAsRead(@PathVariable UUID userId) {
        notificationService.markAllAsRead(userId);
    }

    @DeleteMapping("/user/{userId}/clear-all")
    public void deleteAllNotifications(@PathVariable UUID userId) {
        notificationService.clearAll(userId);
    }
}
