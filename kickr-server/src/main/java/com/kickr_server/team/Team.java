package com.kickr_server.team;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

/**
 * Entité représentant une équipe de football.
 * <p>
 * Une {@code Team} contient les informations de base sur une équipe,
 * comme son nom et un éventuel logo associé. Chaque équipe est identifiée
 * de manière unique par un {@link UUID}.
 */
@Entity
@Table(name = "teams")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Team {

    /**
     * Identifiant unique de l’équipe (UUID généré automatiquement).
     */
    @Id
    @GeneratedValue
    private UUID id;

    /**
     * Nom officiel de l’équipe.
     * <p>
     * Ce champ est unique et obligatoire.
     */
    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String competition;

    /**
     * URL pointant vers le logo de l’équipe (optionnel).
     */
    @Column
    private String logoUrl;
}
