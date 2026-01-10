package com.kickr_server.user;

import com.kickr_server.config.CloudinaryService;
import com.kickr_server.dto.User.UserDto;
import com.kickr_server.usermatch.UserMatchRepository;
import com.kickr_server.exception.user.UserAlreadyExistException;
import com.kickr_server.exception.user.UserNotFoundException;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
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
    private final CloudinaryService cloudinaryService;

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
                throw new UserAlreadyExistException("Email address already in use");
            }
            if (userRepository.existsByName(user.getName())) {
                throw new UserAlreadyExistException("Callsign already taken by another tactician");
            }
        }
        return userRepository.save(user);
    }

    public User update(User user) {
        return userRepository.save(user);
    }

    public User updateProfile(UUID userId, String newName, String newEmail) {
        User user = getUserById(userId);

        // Check if name is taken by another user
        if (!user.getName().equals(newName) && userRepository.existsByName(newName)) {
            throw new UserAlreadyExistException("Name already in use by another tactician");
        }

        // Check if email is taken by another user
        if (!user.getEmail().equals(newEmail) && userRepository.existsByEmail(newEmail)) {
            throw new UserAlreadyExistException("Email already in use");
        }

        user.setName(newName);
        user.setEmail(newEmail);

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
        User user = getUserById(id);
        if (user.getAvatarPublicId() != null) {
            try {
                cloudinaryService.delete(user.getAvatarPublicId());
            } catch (IOException e) {
                log.error("Failed to delete avatar from Cloudinary for user {}: {}", id, e.getMessage());
            }
        }
        userRepository.deleteById(id);
    }

    public User updateAvatar(UUID userId, MultipartFile file) throws IOException {
        User user = getUserById(userId);

        // Upload new avatar
        Map<String, Object> uploadResult = cloudinaryService.upload(file);
        String newUrl = (String) uploadResult.get("secure_url");
        String newPublicId = (String) uploadResult.get("public_id");

        // Delete old avatar if it exists
        if (user.getAvatarPublicId() != null) {
            cloudinaryService.delete(user.getAvatarPublicId());
        }

        user.setAvatarUrl(newUrl);
        user.setAvatarPublicId(newPublicId);

        return userRepository.save(user);
    }

    public User deleteAvatar(UUID userId) throws IOException {
        User user = getUserById(userId);

        if (user.getAvatarPublicId() != null) {
            cloudinaryService.delete(user.getAvatarPublicId());
        }

        user.setAvatarUrl(null);
        user.setAvatarPublicId(null);

        return userRepository.save(user);
    }
}
