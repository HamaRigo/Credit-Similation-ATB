package dev.atb.user.service;

import dev.atb.dto.ToDtoConverter;
import dev.atb.dto.UserDTO;
import dev.atb.models.User;
import dev.atb.repo.UserRepository;
import dev.atb.user.PasswordUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    private final Logger logger = LoggerFactory.getLogger(UserService.class);

    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAllWithRoles();
        return users.stream().map(ToDtoConverter::userToDto).collect(Collectors.toList());
    }

    public Long getUsersCount() {
        return userRepository.countUsers();
    }

    public UserDTO getUserById(final Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ToDtoConverter.userToDto(user);
    }

    public boolean isUsernameTaken(String username, Long userId) {
        User existingUser = userRepository.findByUsername(username);
        if (existingUser != null) {
            return userId == null ? true : !existingUser.getId().equals(userId);
        }
        return false;
    }

    public boolean isEmailTaken(String email, Long userId) {
        User existingUser = userRepository.findByEmail(email);
        if (existingUser != null) {
            return userId == null ? true : !existingUser.getId().equals(userId);
        }
        return false;
    }

    public void checkUsernameAndEmail(User user, Long userId) {
        boolean usernameTaken = isUsernameTaken(user.getUsername(), userId);
        boolean emailTaken = isEmailTaken(user.getEmail(), userId);
        if (usernameTaken || emailTaken) {
            String message = usernameTaken && emailTaken ? "User(s) with this username and this email already exists"
                    : usernameTaken ? "User with this username already exists"
                    : "User with this email already exists";
            throw new IllegalArgumentException(message);
        }
    }

    public UserDTO createUser(final User user) {
        checkUsernameAndEmail(user, null);
        String hashedPassword = PasswordUtils.hashPassword(user.getPassword());
        user.setPassword(hashedPassword);
        return ToDtoConverter.userToDto(userRepository.save(user));
    }

    public UserDTO updateUser(final User user) {
        User userToUpdate = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        checkUsernameAndEmail(user, userToUpdate.getId());
        user.setPassword(userToUpdate.getPassword());
        return ToDtoConverter.userToDto(userRepository.save(user));
    }

    public void updateUserPassword(final User user, final String oldPassword) {
        User userToUpdate = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        String newPassword = user.getPassword();
        if (PasswordUtils.verifyPassword(oldPassword, userToUpdate.getPassword())) {
            String hashedPassword = PasswordUtils.hashPassword(newPassword);
            userToUpdate.setPassword(hashedPassword);
            userRepository.save(userToUpdate);
        } else {
            throw new IllegalArgumentException("Wrong password");
        }
    }

    public void deleteUser(final Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }
}
