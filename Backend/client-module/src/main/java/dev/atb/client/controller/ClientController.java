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

    @GetMapping("/{cin}")
    public ResponseEntity<?> getClientByCin(@PathVariable final String cin) {
        try {
            return new ResponseEntity<>(clientService.getClientByCin(cin), HttpStatus.OK);
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

    @DeleteMapping("/{cin}")
    public ResponseEntity<Void> deleteClient(@PathVariable final String cin) {
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
            clientService.getClientByCin(cin); // This method should not return the client but just check existence
            return new ResponseEntity<>(HttpStatus.OK); // Client exists
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Client does not exist
        }
    }
    // Endpoint to upload a signature for a client (Base64 encoded)
    @PostMapping("/{cin}/signature")
    public ResponseEntity<String> uploadSignature(@PathVariable String cin, @RequestParam String imagePath) {
        try {
            String result = signatureStorageService.addOrUpdateSignature(cin, imagePath);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint to retrieve the signature for a client
    @GetMapping("/{cin}/signature")
    public ResponseEntity<String> getSignature(@PathVariable String cin) {
        String signatureBase64 = signatureStorageService.getSignature(cin);
        if (signatureBase64 != null) {
            return new ResponseEntity<>(signatureBase64, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Signature not found for the client
        }
    }
}
