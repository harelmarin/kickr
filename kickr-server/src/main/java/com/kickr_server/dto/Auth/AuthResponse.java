package com.kickr_server.dto.Auth;

import com.kickr_server.dto.User.UserDto;

public record AuthResponse(String token, String refreshToken, UserDto user) {

}
