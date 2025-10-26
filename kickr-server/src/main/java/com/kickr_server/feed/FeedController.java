package com.kickr_server.feed;

import com.kickr_server.dto.UserMatch.UserMatchFullDto;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/feed")
@RequiredArgsConstructor
public class FeedController {

    private final FeedService feedService;

    @Operation(summary = "Récupère le feed paginé d'un utilisateur (matches des suivis)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste paginée des matches"),
            @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé")
    })
    @RateLimiter(name = "feedRateLimiter")
    @GetMapping("/preview/{userId}")
    public List<UserMatchFullDto> getPreviewFeed(
            @Parameter(description = "UUID de l'utilisateur dont on veut le feed", required = true)
            @PathVariable UUID userId,
            @Parameter(description = "Numéro de page", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Nombre d'éléments par page", example = "10")
            @RequestParam(defaultValue = "10") int size
    ) {
        List<UserMatchFullDto> feed = feedService.getFeedFull(userId);
        int start = Math.min(page * size, feed.size());
        int end = Math.min(start + size, feed.size());
        return feed.subList(start, end);
    }

    @Operation(summary = "Récupère le dernier match noté par chaque utilisateur suivi")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste des derniers matches"),
            @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé")
    })
    @RateLimiter(name = "feedRateLimiter")
    @GetMapping("/latest/{userId}")
    public List<UserMatchFullDto> getLatestFeed(
            @Parameter(description = "UUID de l'utilisateur dont on veut le feed", required = true)
            @PathVariable UUID userId
    ) {
        return feedService.getLatestFeedFull(userId);
    }
}
