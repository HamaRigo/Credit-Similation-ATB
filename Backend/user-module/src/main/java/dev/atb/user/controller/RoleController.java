package dev.atb.user.controller;

import dev.atb.dto.RoleDTO;
import dev.atb.models.Role;
import dev.atb.user.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
@RestController
@RequestMapping("/admin/roles")
public class RoleController {
    @Autowired
    private RoleService roleService;

    @GetMapping
    public ResponseEntity<List<RoleDTO>> getAllRoles() {
        return new ResponseEntity<>(roleService.getAllRoles(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRoleById(@PathVariable final Long id) {
        try {
            return new ResponseEntity<>(roleService.getRoleById(id), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/exists")
    public ResponseEntity<Boolean> clientAlreadyExists(@RequestParam final String name) {
        return new ResponseEntity<>(roleService.roleAlreadyExists(name), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<RoleDTO> createRole(@RequestBody final Role role) {
        try {
            return new ResponseEntity<>(roleService.createRole(role), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping
    public ResponseEntity<RoleDTO> updateRole(@RequestBody final Role role) {
        try {
            return new ResponseEntity<>(roleService.updateRole(role), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable final Long id) {
        try {
            roleService.deleteRole(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
