package com.kickr_server.dev;

import com.kickr_server.auth.refreshToken.RefreshTokenRepository;
import com.kickr_server.follow.FollowRepository;
import com.kickr_server.user.UserRepository;
import com.kickr_server.usermatch.UserMatchRepository;
import com.kickr_server.dto.generic.ApiResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dev")
@RequiredArgsConstructor
public class DevController {

    private final UserRepository userRepository;
    private final UserMatchRepository userMatchRepository;
    private final FollowRepository followRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    @DeleteMapping("/reset-data")
    @Transactional
    public ApiResponseDto<String> resetTestData() {
        // Order matters for foreign keys
        refreshTokenRepository.deleteAll(); // Must delete tokens before users
        followRepository.deleteAll();
        userMatchRepository.deleteAll();
        userRepository.deleteAll();

        return ApiResponseDto.success(
                "All testing data (users, matches ratings, follows) has been wiped. Matches and Competitions are preserved.",
                null);
    }
}
