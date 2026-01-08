package com.kickr_server.dto.UserMatch;

import com.kickr_server.usermatch.UserMatch;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO pour transférer les données d'une évaluation de match par un utilisateur.
 * <p>
 * Utilisé pour les requêtes POST/PUT et pour les réponses GET afin de ne pas
 * exposer directement l'entité.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserMatchDto {

    public UUID id;

    @NotNull(message = "User ID is required")
    public UUID userId;

    @NotNull(message = "Match ID is required")
    public UUID matchId;

    @Min(value = 0, message = "Note must be at least 0")
    @Max(value = 10, message = "Note must be at most 10")
    public double note;

    @Size(max = 1000, message = "Comment must not exceed 1000 characters")
    public String comment;

    public boolean isLiked;
    public int likesCount;
    public LocalDateTime watchedAt;

    /**
     * Crée un DTO à partir d'une entité {@link UserMatch}.
     *
     * @param entity l'entité UserMatch
     * @return le DTO correspondant
     */
    public static UserMatchDto fromEntity(UserMatch entity) {
        return UserMatchDto.builder()
                .id(entity.getId())
                .userId(entity.getUser().getId())
                .matchId(entity.getMatch().getId())
                .note(entity.getNote())
                .comment(entity.getComment())
                .isLiked(entity.isLiked())
                .likesCount(entity.getLikesCount())
                .watchedAt(entity.getWatchedAt())
                .build();
    }
}
