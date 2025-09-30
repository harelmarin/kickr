package com.kickr_server.dto.api;

import lombok.Data;
import java.util.List;

@Data
public class ApiResponse {
    private List<FixtureWrapper> response;
}
