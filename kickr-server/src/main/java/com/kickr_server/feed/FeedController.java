package com.kickr_server.feed;

import com.kickr_server.dto.UserMatch.UserMatchFullDto;
import com.kickr_server.usermatch.UserMatch;
import com.kickr_server.usermatch.UserMatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/feed/{userId}")
@RequiredArgsConstructor
public class FeedController {

    private final UserMatchService userMatchService;

    @GetMapping
    public List<UserMatchFullDto> getFeed(@PathVariable UUID userId) {
        List<UserMatch> matches = userMatchService.getMatchesFromFollowedUsers(userId);
        return matches.stream()
                .map(UserMatchFullDto::fromEntity)
                .toList();
    }
}

