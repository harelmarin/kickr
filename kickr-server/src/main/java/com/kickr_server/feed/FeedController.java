package com.kickr_server.feed;

import com.kickr_server.dto.UserMatch.UserMatchFullDto;
import com.kickr_server.usermatch.UserMatch;
import com.kickr_server.usermatch.UserMatchService;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/feed")
@RequiredArgsConstructor
public class FeedController {

    private final FeedService feedService;

    /**
     * Récupère le feed paginé d'un utilisateur (matches des suivis)
     */
    @GetMapping("/preview/{userId}")
    @RateLimiter(name = "feedRateLimiter")
    public List<UserMatchFullDto> getPreviewFeed(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        List<UserMatchFullDto> feed = feedService.getFeedFull(userId);

        int start = Math.min(page * size, feed.size());
        int end = Math.min(start + size, feed.size());

        return feed.subList(start, end);
    }

    /**
     * Récupère le dernier match noté par chaque utilisateur suivi
     */
    @GetMapping("/latest/{userId}")
    @RateLimiter(name = "feedRateLimiter")
    public List<UserMatchFullDto> getLatestFeed(@PathVariable UUID userId) {
        return feedService.getLatestFeedFull(userId);
    }
}
