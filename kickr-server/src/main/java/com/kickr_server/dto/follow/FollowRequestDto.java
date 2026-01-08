package com.kickr_server.dto.follow;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record FollowRequestDto(
        @NotNull(message = "Follower ID is required") UUID followerId,
        @NotNull(message = "Followed ID is required") UUID followedId) {
}
