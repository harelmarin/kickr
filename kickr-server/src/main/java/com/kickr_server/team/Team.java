package com.kickr_server.team;

import com.kickr_server.competitions.Competition;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "teams")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Team {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    /**
     * Relation vers la compétition à laquelle appartient l’équipe.
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "competition_id", nullable = false)
    private Competition competition;

    @Column
    private String logoUrl;
}
