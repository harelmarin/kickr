package com.kickr_server.match;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "match_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchDetail {

    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    @JdbcTypeCode(SqlTypes.JSON)
    private com.fasterxml.jackson.databind.JsonNode lineups;

    @JdbcTypeCode(SqlTypes.JSON)
    private com.fasterxml.jackson.databind.JsonNode stats;

    @JdbcTypeCode(SqlTypes.JSON)
    private com.fasterxml.jackson.databind.JsonNode events;

    @Column(nullable = false)
    private LocalDateTime lastUpdated;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }
}
