package dev.atb.client.controller;

import dev.atb.client.service.ClientService;
import dev.atb.dto.ClientDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clients")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping("/{cin}")
    public ResponseEntity<ClientDTO> getClientByCin(@PathVariable String cin) {
        try {
            ClientDTO clientDTO = clientService.getClientByCIN(cin);
            return new ResponseEntity<>(clientDTO, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping
    public ResponseEntity<List<ClientDTO>> getAllClients() {
        List<ClientDTO> clients = clientService.getAllClients();
        return new ResponseEntity<>(clients, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ClientDTO> createClient(@RequestBody ClientDTO clientDTO) {
        try {
            ClientDTO createdClient = clientService.createClient(clientDTO);
            return new ResponseEntity<>(createdClient, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{cin}")
    public ResponseEntity<ClientDTO> updateClient(@PathVariable String cin, @RequestBody ClientDTO clientDTO) {
        try {
            ClientDTO updatedClient = clientService.updateClient(cin, clientDTO);
            return new ResponseEntity<>(updatedClient, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{cin}")
    public ResponseEntity<Void> deleteClient(@PathVariable String cin) {
        try {
            clientService.deleteClient(cin);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    // HEAD request to check if client exists by CIN
    @RequestMapping(method = RequestMethod.HEAD, value = "/{cin}")
    public ResponseEntity<Void> checkClientExists(@PathVariable String cin) {
        try {
            clientService.getClientByCIN(cin); // This method should not return the client but just check existence
            return new ResponseEntity<>(HttpStatus.OK); // Client exists
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Client does not exist
        }

    }
}
