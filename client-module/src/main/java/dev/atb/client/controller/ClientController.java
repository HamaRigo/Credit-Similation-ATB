package dev.atb.client.controller;

import dev.atb.client.dto.ClientDTO;
import dev.atb.client.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clients")
public class ClientController {

    @Autowired
    private ClientService clientService;

    @GetMapping("/{cin}")
    public ResponseEntity<ClientDTO> getClientByCin(@PathVariable String cin) {
        ClientDTO clientDTO = clientService.getClientByCIN(cin);
        return new ResponseEntity<>(clientDTO, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<ClientDTO>> getAllClients() {
        List<ClientDTO> clientDTOs = clientService.getAllClients();
        return new ResponseEntity<>(clientDTOs, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ClientDTO> createClient(@RequestBody ClientDTO clientDTO) {
        ClientDTO createdClient = clientService.createClient(clientDTO);
        return new ResponseEntity<>(createdClient, HttpStatus.CREATED);
    }

    @PutMapping("/{cin}")
    public ResponseEntity<ClientDTO> updateClient(@PathVariable String cin, @RequestBody ClientDTO clientDTO) {
        ClientDTO updatedClient = clientService.updateClient(cin, clientDTO);
        return new ResponseEntity<>(updatedClient, HttpStatus.OK);
    }

    @DeleteMapping("/{cin}")
    public ResponseEntity<Void> deleteClient(@PathVariable String cin) {
        clientService.deleteClient(cin);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
