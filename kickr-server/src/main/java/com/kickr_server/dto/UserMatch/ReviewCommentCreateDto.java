package com.kickr_server.dto.UserMatch;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ReviewCommentCreateDto(
        @NotBlank(message = "Content is required") @Size(max = 500, message = "Comment must not exceed 500 characters") String content) {
}
