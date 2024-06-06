package dev.atb.client.controller;

import dev.atb.client.dto.ClientDTO;
import dev.atb.client.repo.ClientRepository;

import dev.atb.models.Client;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/clients")
public class ClientController {

    @Autowired
    private ClientRepository clientRepository;

    @GetMapping("/{cin}")
    public ResponseEntity<ClientDTO> getClientByCin(@PathVariable String cin) {
        Optional<Client> clientOptional = clientRepository.findByCin(cin);
        if (clientOptional.isPresent()) {
            Client client = clientOptional.get();
            ClientDTO clientDTO = new ClientDTO();
            BeanUtils.copyProperties(client, clientDTO);
            return new ResponseEntity<>(clientDTO, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping
    public ResponseEntity<List<ClientDTO>> getAllClients() {
        List<Client> clients = clientRepository.findAll();
        List<ClientDTO> clientDTOs = clients.stream()
                .map(client -> {
                    ClientDTO clientDTO = new ClientDTO();
                    BeanUtils.copyProperties(client, clientDTO);
                    return clientDTO;
                })
                .collect(Collectors.toList());
        return new ResponseEntity<>(clientDTOs, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> createClient(@RequestBody ClientDTO clientDTO) {
        try {
            // Check if clientDTO is not null
            if (clientDTO == null) {
                return new ResponseEntity<>("ClientDTO is required", HttpStatus.BAD_REQUEST);
            }

            Client client = new Client();
            BeanUtils.copyProperties(clientDTO, client);

            // Save the client to the repository
            client = clientRepository.save(client);

            // Check if client is not null after saving
            if (client == null) {
                return new ResponseEntity<>("Failed to create client", HttpStatus.INTERNAL_SERVER_ERROR);
            }

            // Set cin in the DTO
            clientDTO.setCin(clientDTO.getCin());

            // Return the created client DTO with CREATED status
            return new ResponseEntity<>(clientDTO, HttpStatus.CREATED);
        } catch (Exception e) {
            // Handle any exception and return an error response
            return new ResponseEntity<>("Error creating client: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PutMapping("/{cin}")
    public ResponseEntity<?> updateClient(@PathVariable String cin, @RequestBody ClientDTO clientDTO) {
        try {
            // Check if clientDTO is not null
            if (clientDTO == null) {
                return new ResponseEntity<>("ClientDTO is required", HttpStatus.BAD_REQUEST);
            }

            // Find the client by cin
            Optional<Client> clientOptional = clientRepository.findByCin(cin);
            if (clientOptional.isPresent()) {
                // Update the client with the data from the DTO
                Client client = clientOptional.get();
                BeanUtils.copyProperties(clientDTO, client);

                // Save the updated client to the repository
                client = clientRepository.save(client);

                // Check if client is not null after saving
                if (client == null) {
                    return new ResponseEntity<>("Failed to update client", HttpStatus.INTERNAL_SERVER_ERROR);
                }

                // Set cin in the DTO
                clientDTO.setCin(cin);

                // Return the updated client DTO with OK status
                return new ResponseEntity<>(clientDTO, HttpStatus.OK);
            } else {
                // Return not found response if client with provided cin is not found
                return new ResponseEntity<>("Client not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            // Handle any exception and return an error response
            return new ResponseEntity<>("Error updating client: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @DeleteMapping("/{cin}")
    public ResponseEntity<Void> deleteClient(@PathVariable String cin) {
        Optional<Client> clientOptional = clientRepository.findByCin(cin);
        if (clientOptional.isPresent()) {
            clientRepository.delete(clientOptional.get());
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
