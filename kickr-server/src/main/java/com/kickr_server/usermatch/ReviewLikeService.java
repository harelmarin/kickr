package com.kickr_server.usermatch;

import com.kickr_server.user.User;
import com.kickr_server.user.UserRepository;
import com.kickr_server.exception.user.UserNotFoundException;
import com.kickr_server.exception.userMatch.UserMatchNotFoundException;
import com.kickr_server.notification.NotificationService;
import com.kickr_server.notification.NotificationType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewLikeService {

    private final ReviewLikeRepository reviewLikeRepository;
    private final UserMatchRepository userMatchRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public void toggleLike(UUID reviewId, UUID userId) {
        UserMatch review = userMatchRepository.findById(reviewId)
                .orElseThrow(() -> new UserMatchNotFoundException("Review not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        reviewLikeRepository.findByUserAndUserMatch(user, review).ifPresentOrElse(
                like -> {
                    reviewLikeRepository.delete(like);
                    review.setLikesCount(Math.max(0, review.getLikesCount() - 1));
                },
                () -> {
                    ReviewLike like = ReviewLike.builder()
                            .user(user)
                            .userMatch(review)
                            .build();
                    reviewLikeRepository.save(like);
                    review.setLikesCount(review.getLikesCount() + 1);

                    // Notify review owner
                    notificationService.createNotification(
                            review.getUser(),
                            user,
                            NotificationType.LIKE,
                            user.getName() + " liked your review",
                            reviewId.toString());
                });
        userMatchRepository.save(review);
    }

    public boolean isLikedByUser(UUID reviewId, UUID userId) {
        UserMatch review = userMatchRepository.findById(reviewId).orElse(null);
        User user = userRepository.findById(userId).orElse(null);
        if (review == null || user == null)
            return false;
        return reviewLikeRepository.existsByUserAndUserMatch(user, review);
    }
}
