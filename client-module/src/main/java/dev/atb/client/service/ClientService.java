package dev.atb.client.service;

import dev.atb.client.dto.ClientDTO;
import dev.atb.client.repo.ClientRepository;
import dev.atb.models.Client;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    public ClientDTO getClientByCIN(String cin) {
        Client client = clientRepository.findByCin(cin)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        return convertToDTO(client);
    }

    public List<ClientDTO> getAllClients() {
        List<Client> clients = clientRepository.findAll();
        return clients.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public ClientDTO createClient(ClientDTO clientDTO) {
        Client client = convertToEntity(clientDTO);
        client = clientRepository.save(client);
        return convertToDTO(client);
    }

    public ClientDTO updateClient(String cin, ClientDTO clientDTO) {
        Client client = clientRepository.findByCin(cin)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        BeanUtils.copyProperties(clientDTO, client, "cin");
        client = clientRepository.save(client);
        return convertToDTO(client);
    }

    public void deleteClient(String cin) {
        Client client = clientRepository.findByCin(cin)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        clientRepository.delete(client);
    }

    private ClientDTO convertToDTO(Client client) {
        return new ClientDTO(client);
    }

    private Client convertToEntity(ClientDTO clientDTO) {
        Client client = new Client();
        BeanUtils.copyProperties(clientDTO, client);
        return client;
    }
}
