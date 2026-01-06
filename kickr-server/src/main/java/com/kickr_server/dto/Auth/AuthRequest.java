package com.kickr_server.dto.Auth;

import jakarta.validation.constraints.NotBlank;

public record AuthRequest(
                @NotBlank String username,
                @NotBlank String password) {
}
