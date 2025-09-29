package com.kickr_server.exception.user;

/**
 * Exception levée lorsqu'un utilisateur demandé n'est pas trouvé en base de données.
 * <p>
 * Elle hérite de {@link RuntimeException}, ce qui permet de la lancer sans
 * obligation de la déclarer dans la signature des méthodes (unchecked exception).
 */
public class UserNotFoundException extends RuntimeException {

    /**
     * Construit une nouvelle exception avec un message explicatif.
     *
     * @param message le message décrivant la cause de l'exception
     */
    public UserNotFoundException(String message) {
        super(message);
    }
}
