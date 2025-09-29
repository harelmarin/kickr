package com.kickr_server.dto;

public record AuthResponse(String token, String refreshToken, UserDto user) {

}
