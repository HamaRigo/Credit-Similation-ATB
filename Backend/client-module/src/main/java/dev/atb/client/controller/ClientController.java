package dev.atb.client.controller;

import dev.atb.client.service.ClientService;
import dev.atb.client.service.SignatureStorageService;
import dev.atb.dto.ClientDTO;
import dev.atb.models.Client;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.io.File;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
@RestController
@RequestMapping("/clients")
public class ClientController {
    @Autowired
    private ClientService clientService;

    @Autowired
    private SignatureStorageService signatureStorageService;

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

    @GetMapping("/{id}/signature")
    public ResponseEntity<FileSystemResource> getSignature(@PathVariable final Long id) {
        File signatureFile = signatureStorageService.getSignatureFile(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + signatureFile.getName())
                .contentType(MediaType.IMAGE_PNG)
                .body(new FileSystemResource(signatureFile));
    }

    @PostMapping("/{id}/signature")
    public ResponseEntity<Boolean> uploadSignature(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            boolean result = signatureStorageService.addOrUpdateSignature(id, file);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}/signature")
    public ResponseEntity<Void> deleteSignature(@PathVariable final Long id) {
        try {
            signatureStorageService.deleteSignature(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
