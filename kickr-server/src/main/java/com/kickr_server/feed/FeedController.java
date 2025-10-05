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

    private final UserMatchService userMatchService;
    private final FeedService feedService;

    @GetMapping("/{userId}")
    @RateLimiter(name = "feedRateLimiter")
    public List<UserMatchFullDto> getFeed(@PathVariable UUID userId) {
        List<UserMatch> matches = userMatchService.getMatchesFromFollowedUsers(userId);
        return matches.stream()
                .map(UserMatchFullDto::fromEntity)
                .toList();
    }

    @GetMapping("/preview/{userId}")
    @RateLimiter(name = "feedRateLimiter")
    public List<UserMatchFullDto> getPreviewFeed(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        List<UserMatch> latestMatches = feedService.getLatestMatchesFromFollowedUsers(userId);
        int start = Math.min(page * size, latestMatches.size());
        int end = Math.min(start + size, latestMatches.size());

        return latestMatches.subList(start, end).stream()
                .map(UserMatchFullDto::fromEntity)
                .toList();
    }
}

