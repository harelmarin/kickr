package com.kickr_server.user;

import com.kickr_server.dto.User.UserDto;
import com.kickr_server.usermatch.UserMatchRepository;
import com.kickr_server.exception.user.UserAlreadyExistException;
import com.kickr_server.exception.user.UserNotFoundException;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Service métier pour la gestion des utilisateurs.
 * <p>
 * Fournit les méthodes principales pour :
 * <ul>
 * <li>Récupérer tous les utilisateurs</li>
 * <li>Récupérer un utilisateur par son UUID ou son email</li>
 * <li>Créer un nouvel utilisateur</li>
 * <li>Supprimer un utilisateur</li>
 * </ul>
 * <p>
 * Les exceptions personnalisées {@link UserNotFoundException} et
 * {@link UserAlreadyExistException}
 * sont levées en cas de problème métier.
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final UserMatchRepository userMatchRepository;
    private final com.kickr_server.follow.FollowRepository followRepository;

    public UserDto getUserDtoWithStats(UUID id) {
        User user = getUserById(id);
        long matchesCount = userMatchRepository.countByUserId(id);
        long followersCount = followRepository.countByFollowedId(id);
        long followingCount = followRepository.countByFollowerId(id);
        return UserDto.fromEntityWithStats(user, (int) followersCount, (int) followingCount, matchesCount);
    }

    /**
     * Récupère la liste de tous les utilisateurs avec leurs statistiques.
     *
     * @return liste des utilisateurs sous forme de DTO avec stats.
     */
    public List<UserDto> findAllWithStats() {
        return userRepository.findAll().stream()
                .map(user -> {
                    long matchesCount = userMatchRepository.countByUserId(user.getId());
                    long followersCount = followRepository.countByFollowedId(user.getId());
                    long followingCount = followRepository.countByFollowerId(user.getId());
                    return UserDto.fromEntityWithStats(user, (int) followersCount, (int) followingCount, matchesCount);
                })
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Récupère la liste de tous les utilisateurs.
     *
     * @return une liste contenant tous les {@link User} de la base.
     */
    public List<User> findAll() {
        return userRepository.findAll();
    }

    /**
     * Récupère un utilisateur par son identifiant UUID.
     *
     * @param id l'UUID de l'utilisateur recherché.
     * @return l'utilisateur correspondant.
     * @throws UserNotFoundException si aucun utilisateur n'est trouvé avec cet id.
     */
    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur introuvable"));

    }

    /**
     * Récupère un utilisateur par son email.
     *
     * @param email l'email de l'utilisateur recherché.
     * @return l'utilisateur correspondant.
     * @throws UserNotFoundException si aucun utilisateur n'est trouvé avec cet
     *                               email.
     */
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur introuvable"));
    }

    /**
     * Récupère un utilisateur par son nom.
     *
     * @param name le nom de l'utilisateur recherché.
     * @return l'utilisateur correspondant.
     * @throws UserNotFoundException si aucun utilisateur n'est trouvé avec ce nom.
     */
    public User getUserByName(String name) {
        return userRepository.findByName(name)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur introuvable"));
    }

    /**
     * Crée un nouvel utilisateur.
     * <p>
     * Vérifie que l'email et le nom sont uniques avant la sauvegarde.
     *
     * @param user l'utilisateur à créer.
     * @return l'utilisateur sauvegardé, incluant son UUID généré.
     * @throws UserAlreadyExistException si l'email ou le nom existe déjà.
     */
    public User save(User user) {
        log.info("Saving user: {} (id: {})", user.getEmail(), user.getId());
        if (user.getId() == null) {
            if (userRepository.existsByEmail(user.getEmail())) {
                throw new UserAlreadyExistException("Email déjà utilisé");
            }
            if (userRepository.existsByName(user.getName())) {
                throw new UserAlreadyExistException("Nom déjà utilisé");
            }
        }
        return userRepository.save(user);
    }

    public User update(User user) {
        return userRepository.save(user);
    }

    /**
     * Supprime un utilisateur par son UUID.
     * <p>
     * Vérifie d'abord que l'utilisateur existe, sinon lève une exception.
     *
     * @param id l'UUID de l'utilisateur à supprimer.
     * @throws UserNotFoundException si l'utilisateur n'existe pas.
     */
    public void deleteById(UUID id) {
        getUserById(id);
        userRepository.deleteById(id);
    }
}
