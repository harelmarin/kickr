package com.kickr_server.usermatch;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/review-likes")
@RequiredArgsConstructor
public class ReviewLikeController {

    private final ReviewLikeService reviewLikeService;

    @PostMapping("/review/{reviewId}/user/{userId}")
    public void toggleLike(@PathVariable UUID reviewId, @PathVariable UUID userId) {
        reviewLikeService.toggleLike(reviewId, userId);
    }

    @GetMapping("/review/{reviewId}/user/{userId}/check")
    public boolean checkLike(@PathVariable UUID reviewId, @PathVariable UUID userId) {
        return reviewLikeService.isLikedByUser(reviewId, userId);
    }
}
