package com.kickr_server.utils;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

/**
 * Utilitaire pour convertir des dates/horaires UTC en heures locales.
 * <p>
 * Cette classe fournit des méthodes statiques pour convertir des dates/horaires au format
 * UTC vers différents fuseaux horaires. La classe ne peut pas être instanciée.
 */
public class DateTimeConverter {

    /**
     * Constructeur privé pour empêcher l'instanciation de cette classe utilitaire.
     */
    private DateTimeConverter() {}

    /**
     * Convertit une date/heure UTC en heure locale de France (Europe/Paris) et renvoie une chaîne formatée.
     * <p>
     * La date/heure doit être au format ISO 8601 (ex : "2025-09-27T14:00:00Z").
     *
     * @param utcDateTime la date/heure en UTC sous forme de chaîne
     * @return la date/heure convertie en fuseau horaire Europe/Paris, au format "yyyy-MM-dd'T'HH:mm:ss"
     * @throws java.time.format.DateTimeParseException si la chaîne UTC n'est pas au format ISO 8601 valide
     *
     * <p><b>Exemple :</b></p>
     * <pre>
     * String localTime = DateTimeConverter.toLocalTimeFrance("2025-09-27T14:00:00Z");
     * System.out.println(localTime); // "2025-09-27T16:00:00"
     * </pre>
     */
    public static LocalDateTime toLocalTimeFrance(String utcDateTime) {
        ZonedDateTime zdtUtc = ZonedDateTime.parse(utcDateTime);
        ZonedDateTime zdtParis = zdtUtc.withZoneSameInstant(ZoneId.of("Europe/Paris"));
        return zdtParis.toLocalDateTime();
    }
}
