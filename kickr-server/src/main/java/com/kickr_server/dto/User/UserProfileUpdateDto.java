package com.kickr_server.dto.User;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserProfileUpdateDto(
                @NotBlank(message = "Name is required") @Size(min = 3, max = 10, message = "Name must be between 3 and 10 characters") String name,

                @NotBlank(message = "Email is required") @Email(message = "Invalid email format") @Size(max = 100, message = "Email is too long") String email) {
}
