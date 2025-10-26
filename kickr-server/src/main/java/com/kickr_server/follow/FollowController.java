package com.kickr_server.follow;

import com.kickr_server.dto.User.UserDto;
import com.kickr_server.dto.follow.FollowRequestDto;
import com.kickr_server.dto.follow.FollowResponseDto;
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
@RequestMapping("/api/follows")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    @Operation(summary = "Faire suivre un utilisateur")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Utilisateur suivi avec succès"),
            @ApiResponse(responseCode = "404", description = "Utilisateur introuvable")
    })
    @RateLimiter(name = "followRateLimiter")
    @PostMapping("/follow")
    public FollowResponseDto follow(@RequestBody FollowRequestDto request) {
        followService.follow(request.followerId(), request.followedId());
        return FollowResponseDto.success(request.followerId(), request.followedId(), true);
    }

    @Operation(summary = "Ne plus suivre un utilisateur")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Utilisateur non suivi avec succès"),
            @ApiResponse(responseCode = "404", description = "Utilisateur introuvable")
    })
    @RateLimiter(name = "followRateLimiter")
    @PostMapping("/unfollow")
    public FollowResponseDto unfollow(@RequestBody FollowRequestDto request) {
        followService.unfollow(request.followerId(), request.followedId());
        return FollowResponseDto.success(request.followerId(), request.followedId(), false);
    }

    @Operation(summary = "Liste des utilisateurs suivis par un utilisateur")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste des utilisateurs suivis"),
            @ApiResponse(responseCode = "404", description = "Utilisateur introuvable")
    })
    @RateLimiter(name = "followRateLimiter")
    @GetMapping("/following/{userId}")
    public List<UserDto> getFollowing(
            @Parameter(description = "UUID de l'utilisateur dont on veut la liste des suivis", required = true)
            @PathVariable UUID userId
    ) {
        return followService.getFollowing(userId).stream().map(UserDto::fromEntity).toList();
    }

    @Operation(summary = "Liste des utilisateurs qui suivent un utilisateur")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste des followers"),
            @ApiResponse(responseCode = "404", description = "Utilisateur introuvable")
    })
    @RateLimiter(name = "followRateLimiter")
    @GetMapping("/followers/{userId}")
    public List<UserDto> getFollowers(
            @Parameter(description = "UUID de l'utilisateur dont on veut la liste des followers", required = true)
            @PathVariable UUID userId
    ) {
        return followService.getFollowers(userId).stream().map(UserDto::fromEntity).toList();
    }
}
