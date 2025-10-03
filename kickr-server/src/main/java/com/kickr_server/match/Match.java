package com.kickr_server.match;



import com.kickr_server.team.Team;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entité représentant un match de football entre deux équipes.
 * <p>
 * Un {@code Match} contient les informations principales comme :
 * <ul>
 *     <li>Les équipes en présence (domicile et extérieur)</li>
 *     <li>La date, l’heure et le lieu du match</li>
 *     <li>La compétition associée</li>
 *     <li>Le score final (facultatif, si disponible)</li>
 * </ul>
 * <p>
 * Chaque match est identifié de manière unique par un {@link UUID}.
 */
@Entity
@Table(name = "matches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Match {

    /**
     * Identifiant unique du match (UUID généré automatiquement).
     */
    @Id
    @GeneratedValue
    private UUID id;

    /**
     * L’équipe qui joue à domicile.
     */
    @ManyToOne
    @JoinColumn(name = "home_team_id", nullable = false)
    private Team homeTeam;

    /**
     * L’équipe qui joue à l’extérieur.
     */
    @ManyToOne
    @JoinColumn(name = "away_team_id", nullable = false)
    private Team awayTeam;

    /**
     * Date et heure de la rencontre.
     */
    @Column(nullable = false)
    private LocalDateTime matchDate;

    /**
     * Nom de la compétition dans laquelle le match a lieu
     * (ex. "Ligue des Champions", "Premier League").
     */
    @Column(nullable = false)
    private String competition;

    /**
     * Lieu où se déroule le match (nom du stade ou ville).
     */
    @Column(nullable = false)
    private String location;

    /**
     * Score de l’équipe à domicile (peut être nul si le match n’est pas encore joué).
     */
    @Column
    private Integer homeScore;

    /**
     * Score de l’équipe à l’extérieur (peut être nul si le match n’est pas encore joué).
     */
    @Column
    private Integer awayScore;
}
