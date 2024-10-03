package dev.atb.client.service;

import dev.atb.dto.ClientDTO;
import dev.atb.dto.RoleDTO;
import dev.atb.dto.ToDtoConverter;
import dev.atb.dto.UserDTO;
import dev.atb.models.Client;
import dev.atb.models.Role;
import dev.atb.models.User;
import dev.atb.repo.ClientRepository;
import dev.atb.repo.RoleRepository;
import dev.atb.repo.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClientService {
    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    private final Logger logger = LoggerFactory.getLogger(ClientService.class);

    public List<ClientDTO> getAllClients() {
        List<Client> clients = clientRepository.findAll();
        return clients.stream().map(ToDtoConverter::clientToDto).collect(Collectors.toList());
    }

    public ClientDTO getClientById(final String id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        return ToDtoConverter.clientToDto(client);
    }

    public ClientDTO createClient(final Client client) {
        try {
            return ToDtoConverter.clientToDto(clientRepository.save(client));
        } catch (Exception e) {
            throw new RuntimeException("Error saving client", e);
        }
    }

    public ClientDTO updateClient(final Client client) {
        clientRepository.findById(client.getNumeroDocument())
                .orElseThrow(() -> new RuntimeException("Client not found"));
        return ToDtoConverter.clientToDto(clientRepository.save(client));
    }

    public void deleteClient(final String id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        clientRepository.delete(client);
    }

    /*****************************USERS************************************/
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAllWithRoles();
        return users.stream().map(ToDtoConverter::userToDto).collect(Collectors.toList());
    }

    public UserDTO getUserById(final Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ToDtoConverter.userToDto(user);
    }

    public UserDTO createUser(final User user) {
        try {
            return ToDtoConverter.userToDto(userRepository.save(user));
        } catch (Exception e) {
            throw new RuntimeException("Error saving user", e);
        }
    }

    public UserDTO updateUser(final User user) {
        userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ToDtoConverter.userToDto(userRepository.save(user));
    }

    public void deleteUser(final Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }

    /*****************************ROLES************************************/
    public List<RoleDTO> getAllRoles() {
        List<Role> roles = roleRepository.findAll();
        return roles.stream().map(ToDtoConverter::roleToDto).collect(Collectors.toList());
    }

    public RoleDTO getRoleById(final Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        return ToDtoConverter.roleToDto(role);
    }

    public RoleDTO createRole(final Role role) {
        try {
            return ToDtoConverter.roleToDto(roleRepository.save(role));
        } catch (Exception e) {
            throw new RuntimeException("Error saving role", e);
        }
    }

    public RoleDTO updateRole(final Role role) {
        roleRepository.findById(role.getId())
                .orElseThrow(() -> new RuntimeException("Role not found"));
        return ToDtoConverter.roleToDto(roleRepository.save(role));
    }

    public void deleteRole(final Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        roleRepository.delete(role);
    }
}
