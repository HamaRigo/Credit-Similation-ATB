package dev.atb.client.service;

import dev.atb.dto.ClientDTO;
import dev.atb.dto.CompteDTO;
import dev.atb.models.Client;
import dev.atb.models.Compte;
import dev.atb.repo.ClientRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
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
        ClientDTO clientDTO = new ClientDTO();
        BeanUtils.copyProperties(client, clientDTO);
        return clientDTO;
    }

    private CompteDTO convertToDTO(Compte compte) {
        CompteDTO compteDTO = new CompteDTO();
        BeanUtils.copyProperties(compte, compteDTO);

        // Set only the 'cin' from the client
        if (compte.getClient() != null) {
            compteDTO.setClient(compte.getClient().getCin());
        }

        return compteDTO;
    }


    private Client convertToEntity(ClientDTO clientDTO) {
        Client client = new Client();
        BeanUtils.copyProperties(clientDTO, client);
        return client;
    }

    private Compte convertToEntity(CompteDTO compteDTO) {
        Compte compte = new Compte();
        BeanUtils.copyProperties(compteDTO, compte);
        return compte;
    }
}
