package com.kickr_server.match;

import com.kickr_server.competitions.Competition;
import com.kickr_server.team.Team;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "matches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Match {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "home_team_id", nullable = false)
    private Team homeTeam;

    @ManyToOne
    @JoinColumn(name = "away_team_id", nullable = false)
    private Team awayTeam;

    @Column(nullable = false)
    private LocalDateTime matchDate;

    /**
     * Relation vers la compétition dans laquelle le match a lieu.
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "competition_id", nullable = false)
    private Competition competition;

    @Column(nullable = false)
    private String location;

    @Column
    private Integer homeScore;

    @Column
    private Integer awayScore;

    @Column(unique = true, nullable = false)
    private Integer externalFixtureId;
}
