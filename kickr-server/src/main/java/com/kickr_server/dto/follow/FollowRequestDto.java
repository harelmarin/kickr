package com.kickr_server.dto.follow;

import java.util.UUID;

public record FollowRequestDto(UUID followerId, UUID followedId) {}

