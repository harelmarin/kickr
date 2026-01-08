package com.kickr_server.usermatch;

import com.kickr_server.exception.user.UserNotFoundException;
import com.kickr_server.exception.userMatch.UserMatchNotFoundException;
import com.kickr_server.user.User;
import com.kickr_server.user.UserRepository;
import com.kickr_server.notification.NotificationService;
import com.kickr_server.notification.NotificationType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewCommentService {

    private final ReviewCommentRepository reviewCommentRepository;
    private final UserMatchRepository userMatchRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public List<ReviewComment> getCommentsByReviewId(UUID reviewId) {
        return reviewCommentRepository.findByUserMatchIdOrderByCreatedAtAsc(reviewId);
    }

    @Transactional
    public ReviewComment addComment(UUID reviewId, UUID userId, String content) {
        UserMatch userMatch = userMatchRepository.findById(reviewId)
                .orElseThrow(() -> new UserMatchNotFoundException("Review not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        ReviewComment comment = ReviewComment.builder()
                .userMatch(userMatch)
                .user(user)
                .content(content)
                .build();

        ReviewComment saved = reviewCommentRepository.save(comment);

        // Notify the review author
        if (!userMatch.getUser().getId().equals(userId)) {
            notificationService.createNotification(
                    userMatch.getUser(),
                    user,
                    NotificationType.COMMENT,
                    user.getName() + " commented on your review",
                    reviewId.toString());
        }

        return saved;
    }

    @Transactional
    public void deleteComment(UUID commentId) {
        reviewCommentRepository.deleteById(commentId);
    }

    @Transactional
    public ReviewComment moderate(UUID commentId) {
        ReviewComment comment = reviewCommentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        comment.setModerated(true);
        comment.setContent("[Comment excluded by an administrator]");
        return reviewCommentRepository.save(comment);
    }
}
