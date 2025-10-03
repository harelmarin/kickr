package com.kickr_server.follow;

import com.kickr_server.dto.User.UserDto;
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
    public String follow(@RequestParam UUID followerId, @RequestParam UUID followedId) {
        followService.follow(followerId, followedId);
        return "User " + followerId + " now follows " + followedId;
    }

    /**
     * Ne plus suivre un utilisateur.
     */
    @PostMapping("/unfollow")
    public String unfollow(@RequestParam UUID followerId, @RequestParam UUID followedId) {
        followService.unfollow(followerId, followedId);
        return "User " + followerId + " unfollowed " + followedId;
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
