package com.kickr_server.dto.User;

import com.kickr_server.user.Role;
import com.kickr_server.user.User;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO pour exposer un utilisateur au frontend sans le mot de passe.
 */
public record UserDto(
        UUID id,
        String name,
        String email,
        Role role,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        long followersCount,
        long followingCount,
        long matchesCount) {
    /**
     * Convertit un User en UserDto.
     *
     * @param user l'entité User
     * @return le DTO correspondant
     */
    public static UserDto fromEntity(User user) {
        return new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt(),
                user.getUpdatedAt(),
                0L, 0L, 0L);
    }

    public static UserDto fromEntityWithStats(User user, long followers, long following, long matches) {
        return new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt(),
                user.getUpdatedAt(),
                followers,
                following,
                matches);
    }
}
