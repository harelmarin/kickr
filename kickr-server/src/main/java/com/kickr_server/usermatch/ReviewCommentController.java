package com.kickr_server.usermatch;

import com.kickr_server.dto.UserMatch.ReviewCommentCreateDto;
import com.kickr_server.dto.UserMatch.ReviewCommentDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/review-comments")
@RequiredArgsConstructor
public class ReviewCommentController {

    private final ReviewCommentService reviewCommentService;

    @GetMapping("/review/{reviewId}")
    public List<ReviewCommentDto> getComments(@PathVariable UUID reviewId) {
        return reviewCommentService.getCommentsByReviewId(reviewId)
                .stream()
                .map(ReviewCommentDto::fromEntity)
                .toList();
    }

    @PostMapping("/review/{reviewId}/user/{userId}")
    public ReviewCommentDto addComment(
            @PathVariable UUID reviewId,
            @PathVariable UUID userId,
            @Valid @RequestBody ReviewCommentCreateDto dto) {
        return ReviewCommentDto.fromEntity(reviewCommentService.addComment(reviewId, userId, dto.content()));
    }

    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable UUID id) {
        reviewCommentService.deleteComment(id);
    }
}
