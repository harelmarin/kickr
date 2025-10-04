package com.kickr_server.follow;

import com.kickr_server.dto.User.UserDto;
import com.kickr_server.dto.follow.FollowRequestDto;
import com.kickr_server.dto.follow.FollowResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/follows")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    /**
     * Faire suivre un utilisateur.
     */
    @PostMapping("/follow")
    public FollowResponseDto follow(@RequestBody  FollowRequestDto request) {
        followService.follow(request.followerId(), request.followedId());
        return FollowResponseDto.success(request.followerId(), request.followedId(), true);
    }

    /**
     * Ne plus suivre un utilisateur.
     */
    @PostMapping("/unfollow")
    public FollowResponseDto unfollow(@RequestBody FollowRequestDto request) {
        followService.unfollow(request.followerId(), request.followedId());
        return FollowResponseDto.success(request.followerId(), request.followedId(),false);
    }

    /**
     * Liste des utilisateurs suivis par un utilisateur.
     */
    @GetMapping("/following/{userId}")
    public List<UserDto> getFollowing(@PathVariable UUID userId) {
        return followService.getFollowing(userId).stream().map(UserDto::fromEntity).toList();
    }

    /**
     * Liste des utilisateurs qui suivent un utilisateur.
     */
    @GetMapping("/followers/{userId}")
    public List<UserDto> getFollowers(@PathVariable UUID userId) {
        return followService.getFollowers(userId).stream().map(UserDto::fromEntity).toList();
    }

}
