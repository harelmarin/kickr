package com.kickr_server.dto.api;

import lombok.Data;

@Data
public class FixtureWrapper {
    private Fixture fixture;
    private Teams teams;
    private League league;
    private Goals goals;
}
