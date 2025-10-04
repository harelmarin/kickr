package com.kickr_server.dto.follow;

import java.util.UUID;

/**
 * DTO de réponse après une action de follow/unfollow.
 */
public record FollowResponseDto(
        UUID followerId,
        UUID followedId,
        String status,
        String message
) {
    public static FollowResponseDto success(UUID followerId, UUID followedId, boolean isFollow) {
        return new FollowResponseDto(
                followerId,
                followedId,
                "SUCCESS",
                isFollow
                        ? "Follow created successfully"
                        : "Unfollow completed successfully"
        );
    }
}
