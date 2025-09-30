package com.kickr_server.match;

import com.kickr_server.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_matches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserMatch {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private int note;

    @Column(length = 1000)
    private String comment;

    private LocalDateTime watchedAt;
}
