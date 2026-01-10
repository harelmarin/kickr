package com.kickr_server.user;

import com.kickr_server.dto.User.UserDto;
import com.kickr_server.dto.User.UserProfileUpdateDto;
import com.kickr_server.dto.generic.ApiResponseDto;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

        private final UserService userService;

        /**
         * Get list of all users.
         *
         * @return list of users as DTOs (without passwords)
         */
        @Operation(summary = "Get all users")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "List retrieved successfully")
        })
        @RateLimiter(name = "userRateLimiter")
        @GetMapping
        public List<UserDto> getAllUsers() {
                return userService.findAllWithStats();
        }

        /**
         * Get a user by their identifier.
         *
         * @param id User UUID
         * @return user as DTO
         */
        @Operation(summary = "Get a user by ID")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "User found"),
                        @ApiResponse(responseCode = "404", description = "User not found")
        })
        @RateLimiter(name = "userRateLimiter")
        @GetMapping("/{id}")
        public UserDto getUserById(@PathVariable UUID id) {
                return userService.getUserDtoWithStats(id);
        }

        /**
         * Delete a user by their identifier.
         *
         * @param id User UUID
         */
        @Operation(summary = "Delete a user by ID")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "204", description = "User deleted"),
                        @ApiResponse(responseCode = "404", description = "User not found")
        })
        @RateLimiter(name = "userRateLimiter")
        @DeleteMapping("/{id}")
        @ResponseStatus(HttpStatus.NO_CONTENT)
        public ApiResponseDto<Void> deleteUser(@PathVariable UUID id) {
                userService.deleteById(id);
                return new ApiResponseDto<>("SUCCESS", "User deleted successfully", null, null);
        }

        @Operation(summary = "Update my profile information")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Profile updated"),
                        @ApiResponse(responseCode = "400", description = "Invalid data / Name already taken"),
                        @ApiResponse(responseCode = "401", description = "Not authenticated")
        })
        @RateLimiter(name = "userRateLimiter")
        @PutMapping("/me")
        public ApiResponseDto<UserDto> updateProfile(
                        @Valid @RequestBody UserProfileUpdateDto updateDto,
                        Authentication authentication) {
                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                com.kickr_server.user.User user = userService.getUserByEmail(userDetails.getUsername());
                var updatedUser = userService.updateProfile(user.getId(), updateDto.name(), updateDto.email());
                return ApiResponseDto.success("Profile updated successfully",
                                userService.getUserDtoWithStats(updatedUser.getId()));
        }

        @Operation(summary = "Update my profile picture")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Picture updated"),
                        @ApiResponse(responseCode = "401", description = "Not authenticated")
        })
        @RateLimiter(name = "userRateLimiter")
        @PostMapping("/me/avatar")
        public ApiResponseDto<UserDto> uploadAvatar(
                        @RequestParam("file") MultipartFile file,
                        Authentication authentication) throws IOException {
                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                com.kickr_server.user.User user = userService.getUserByEmail(userDetails.getUsername());
                var updatedUser = userService.updateAvatar(user.getId(), file);
                return ApiResponseDto.success("Avatar updated successfully",
                                userService.getUserDtoWithStats(updatedUser.getId()));
        }

        @Operation(summary = "Delete my profile picture")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Picture deleted"),
                        @ApiResponse(responseCode = "401", description = "Not authenticated")
        })
        @RateLimiter(name = "userRateLimiter")
        @DeleteMapping("/me/avatar")
        public ApiResponseDto<UserDto> deleteAvatar(Authentication authentication) throws IOException {
                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                com.kickr_server.user.User user = userService.getUserByEmail(userDetails.getUsername());
                var updatedUser = userService.deleteAvatar(user.getId());
                return ApiResponseDto.success("Avatar deleted successfully",
                                userService.getUserDtoWithStats(updatedUser.getId()));
        }
}
