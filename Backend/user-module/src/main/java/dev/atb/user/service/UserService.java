package dev.atb.user.service;

import dev.atb.dto.ToDtoConverter;
import dev.atb.dto.UserDTO;
import dev.atb.models.User;
import dev.atb.repo.UserRepository;
import dev.atb.user.PasswordUtils;
import jakarta.transaction.Transactional;
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

    public boolean userExistByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean userExistByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Transactional
    public UserDTO createUser(final User user) {
        try {
            String hashedPassword = PasswordUtils.hashPassword(user.getPassword());
            user.setPassword(hashedPassword);
            return ToDtoConverter.userToDto(userRepository.save(user));
        } catch (Exception e) {
            throw new RuntimeException("Error saving user", e);
        }
    }

    public UserDTO updateUser(final User user) {
        userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        //String hashedPassword = PasswordUtils.hashPassword(user.getPassword());
        //user.setPassword(hashedPassword);
        return ToDtoConverter.userToDto(userRepository.save(user));
    }

    public void deleteUser(final Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }
}
