package com.kickr_server.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

import java.time.Clock;

/**
 * Base class for all application events in Kickr.
 */
@Getter
public abstract class KickrEvent extends ApplicationEvent {
    public KickrEvent(Object source) {
        super(source);
    }

    public KickrEvent(Object source, Clock clock) {
        super(source, clock);
    }
}
