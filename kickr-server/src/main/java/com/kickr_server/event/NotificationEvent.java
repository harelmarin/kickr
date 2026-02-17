package com.kickr_server.event;

import com.kickr_server.notification.NotificationType;
import com.kickr_server.user.User;
import lombok.Getter;

/**
 * Event published when a notification needs to be created.
 */
@Getter
public class NotificationEvent extends KickrEvent {
    private final User recipient;
    private final User actor;
    private final NotificationType type;
    private final String message;
    private final String targetId;

    public NotificationEvent(Object source, User recipient, User actor, NotificationType type, String message,
            String targetId) {
        super(source);
        this.recipient = recipient;
        this.actor = actor;
        this.type = type;
        this.message = message;
        this.targetId = targetId;
    }
}
