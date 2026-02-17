package com.kickr_server.notification;

import com.kickr_server.event.NotificationEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * Listener that handles NotificationEvents and triggers notification creation.
 * Decouples business services from the NotificationService.
 */
@Component
@RequiredArgsConstructor
public class NotificationEventListener {

    private final NotificationService notificationService;

    @EventListener
    @Async // Makes notification processing asynchronous
    public void handleNotificationEvent(NotificationEvent event) {
        notificationService.createNotification(
                event.getRecipient(),
                event.getActor(),
                event.getType(),
                event.getMessage(),
                event.getTargetId());
    }
}
