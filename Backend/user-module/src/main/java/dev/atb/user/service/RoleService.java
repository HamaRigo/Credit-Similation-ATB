package dev.atb.user.service;

import dev.atb.dto.RoleDTO;
import dev.atb.dto.ToDtoConverter;
import dev.atb.models.Role;
import dev.atb.repo.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

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
        role.removeUsers();
        roleRepository.delete(role);
    }
}
