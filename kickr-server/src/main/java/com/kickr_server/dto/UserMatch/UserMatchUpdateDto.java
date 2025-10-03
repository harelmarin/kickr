package com.kickr_server.dto.UserMatch;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserMatchUpdateDto {
    int note;
    String comment;



}
