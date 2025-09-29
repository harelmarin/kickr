package com.kickr_server.exception.user;

/**
 * Exception levée lorsqu'un utilisateur existe déjà
 * (par exemple lors d'une tentative de création avec un email ou un nom déjà pris).
 * <p>
 * Hérite de {@link RuntimeException}, donc non obligatoire de la déclarer
 * dans les signatures de méthodes.
 */
public class UserAlreadyExistException extends RuntimeException {

    /**
     * Construit une nouvelle exception avec un message explicatif.
     *
     * @param message le message décrivant la cause de l'exception
     */
    public UserAlreadyExistException(String message) {
        super(message);
    }
}
