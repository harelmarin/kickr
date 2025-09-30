package com.kickr_server.dto.api;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Fixture {
    private LocalDateTime date;
    private Venue venue;
}
