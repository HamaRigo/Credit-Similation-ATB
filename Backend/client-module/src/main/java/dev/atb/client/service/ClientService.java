package dev.atb.client.service;

import dev.atb.dto.ClientDTO;
import dev.atb.dto.ToDtoConverter;
import dev.atb.models.Client;
import dev.atb.repo.ClientRepository;
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

    private final Logger logger = LoggerFactory.getLogger(ClientService.class);

    public List<ClientDTO> getAllClients() {
        List<Client> clients = clientRepository.findAll();
        return clients.stream().map(ToDtoConverter::clientToDto).collect(Collectors.toList());
    }

    public Long getClientsCount() {
        return clientRepository.countClients();
    }

    public ClientDTO getClientById(final Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        return ToDtoConverter.clientToDto(client);
    }

    public Boolean clientAlreadyExists(final String numeroDocument) {
        Client client = clientRepository.findByNumeroDocument(numeroDocument);
        if(client == null) {
            return Boolean.FALSE;
        }
        return Boolean.TRUE;
    }

    public ClientDTO createClient(final Client client) {
        try {
            return ToDtoConverter.clientToDto(clientRepository.save(client));
        } catch (Exception e) {
            throw new RuntimeException("Error saving client", e);
        }
    }

    public ClientDTO updateClient(final Client client) {
        clientRepository.findById(client.getId())
                .orElseThrow(() -> new RuntimeException("Client not found"));
        return ToDtoConverter.clientToDto(clientRepository.save(client));
    }

    public void deleteClient(final Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        clientRepository.delete(client);
    }
}
