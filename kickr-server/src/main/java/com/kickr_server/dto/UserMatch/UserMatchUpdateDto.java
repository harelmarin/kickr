package com.kickr_server.dto.UserMatch;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserMatchUpdateDto {
    @Min(value = 0, message = "Note must be at least 0")
    @Max(value = 10, message = "Note must be at most 10")
    double note;

    @Size(max = 1000, message = "Comment must not exceed 1000 characters")
    String comment;

}
