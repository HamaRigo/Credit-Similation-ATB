package dev.atb.client.controller;

import dev.atb.client.service.ClientService;
import dev.atb.dto.ClientDTO;
import dev.atb.dto.RoleDTO;
import dev.atb.dto.UserDTO;
import dev.atb.models.Client;
import dev.atb.models.Role;
import dev.atb.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
@RestController
@RequestMapping("/clients")
public class ClientController {
    @Autowired
    private ClientService clientService;

    @GetMapping
    public ResponseEntity<List<ClientDTO>> getAllClients() {
        return new ResponseEntity<>(clientService.getAllClients(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getClientById(@PathVariable final String id) {
        try {
            return new ResponseEntity<>(clientService.getClientById(id), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<ClientDTO> createClient(@RequestBody final Client client) {
        try {
            return new ResponseEntity<>(clientService.createClient(client), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping
    public ResponseEntity<ClientDTO> updateClient(@RequestBody final Client client) {
        try {
            return new ResponseEntity<>(clientService.updateClient(client), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable final String id) {
        try {
            clientService.deleteClient(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // HEAD request to check if client exists by CIN
    @RequestMapping(method = RequestMethod.HEAD, value = "/{id}")
    public ResponseEntity<Void> checkClientExists(@PathVariable String id) {
        try {
            clientService.getClientById(id); // This method should not return the client but just check existence
            return new ResponseEntity<>(HttpStatus.OK); // Client exists
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Client does not exist
        }
    }

    /*****************************USERS************************************/
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return new ResponseEntity<>(clientService.getAllUsers(), HttpStatus.OK);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable final Long id) {
        try {
            return new ResponseEntity<>(clientService.getUserById(id), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/users")
    public ResponseEntity<UserDTO> createUser(@RequestBody final User user) {
        try {
            return new ResponseEntity<>(clientService.createUser(user), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable final Long id) {
        try {
            clientService.deleteUser(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/users")
    public ResponseEntity<UserDTO> updateUser(@RequestBody final User user) {
        try {
            return new ResponseEntity<>(clientService.updateUser(user), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /*****************************ROLES************************************/
    @GetMapping("/roles")
    public ResponseEntity<List<RoleDTO>> getAllRoles() {
        return new ResponseEntity<>(clientService.getAllRoles(), HttpStatus.OK);
    }

    @GetMapping("/roles/{id}")
    public ResponseEntity<?> getRoleById(@PathVariable final Long id) {
        try {
            return new ResponseEntity<>(clientService.getRoleById(id), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/roles")
    public ResponseEntity<RoleDTO> createRole(@RequestBody final Role role) {
        try {
            return new ResponseEntity<>(clientService.createRole(role), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/roles")
    public ResponseEntity<RoleDTO> updateRole(@RequestBody final Role role) {
        try {
            return new ResponseEntity<>(clientService.updateRole(role), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/roles/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable final Long id) {
        try {
            clientService.deleteRole(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
