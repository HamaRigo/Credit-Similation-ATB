package dev.atb.client.controller;

import dev.atb.client.service.ClientService;
import dev.atb.client.service.SignatureStorageService;
import dev.atb.dto.ClientDTO;
import dev.atb.models.Client;
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

    @Autowired
    private SignatureStorageService signatureStorageService;  // Inject the signature service

    @GetMapping
    public ResponseEntity<List<ClientDTO>> getAllClients() {
        return new ResponseEntity<>(clientService.getAllClients(), HttpStatus.OK);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getClientsCount() {
        return new ResponseEntity<>(clientService.getClientsCount(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getClientById(@PathVariable final Long id) {
        try {
            return new ResponseEntity<>(clientService.getClientById(id), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/exists")
    public ResponseEntity<Boolean> clientAlreadyExists(@RequestParam final String numeroDocument) {
        return new ResponseEntity<>(clientService.clientAlreadyExists(numeroDocument), HttpStatus.OK);
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
    public ResponseEntity<Void> deleteClient(@PathVariable final Long id) {
        try {
            clientService.deleteClient(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint to upload a signature for a client (Base64 encoded)
    @PostMapping("/{id}/signature")
    public ResponseEntity<String> uploadSignature(@PathVariable Long id, @RequestParam String imagePath) {
        try {
            String result = signatureStorageService.addOrUpdateSignature(id, imagePath);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint to retrieve the signature for a client
    @GetMapping("/{id}/signature")
    public ResponseEntity<String> getSignature(@PathVariable Long id) {
        String signatureBase64 = signatureStorageService.getSignature(id);
        if (signatureBase64 != null) {
            return new ResponseEntity<>(signatureBase64, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Signature not found for the client
        }
    }
}
