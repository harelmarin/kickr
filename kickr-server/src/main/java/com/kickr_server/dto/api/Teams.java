package com.kickr_server.dto.api;

import lombok.Data;

@Data
public class Teams {
    private TeamInfo home;
    private TeamInfo away;
}
