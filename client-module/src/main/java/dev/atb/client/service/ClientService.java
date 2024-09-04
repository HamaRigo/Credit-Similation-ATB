//package dev.atb.client.service;
//
//import dev.atb.dto.ClientDTO;
//import dev.atb.dto.CompteDTO;
//import dev.atb.models.Client;
//import dev.atb.models.Compte;
//import dev.atb.repo.ClientRepository;
//import jakarta.transaction.Transactional;
//import org.springframework.beans.BeanUtils;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@Transactional
//public class ClientService {
//
//    @Autowired
//    private ClientRepository clientRepository;
//
//    public ClientDTO getClientByCIN(String cin) {
//        Client client = clientRepository.findByCin(cin)
//                .orElseThrow(() -> new RuntimeException("Client not found"));
//        return convertToDTO(client);
//    }
//
//    public List<ClientDTO> getAllClients() {
//        List<Client> clients = clientRepository.findAll();
//        return clients.stream().map(this::convertToDTO).collect(Collectors.toList());
//    }
//
//    public ClientDTO createClient(ClientDTO clientDTO) {
//        // Ensure that the cin is set
//        if (clientDTO.getCin() == null || clientDTO.getCin().isEmpty()) {
//            throw new RuntimeException("CIN must be provided");
//        }
//
//        Client client = convertToEntity(clientDTO);
//        client = clientRepository.save(client);
//        return convertToDTO(client);
//    }
//
//    public ClientDTO updateClient(String cin, ClientDTO clientDTO) {
//        Client client = clientRepository.findByCin(cin)
//                .orElseThrow(() -> new RuntimeException("Client not found"));
//        BeanUtils.copyProperties(clientDTO, client, "cin");
//        client = clientRepository.save(client);
//        return convertToDTO(client);
//    }
//
//    public void deleteClient(String cin) {
//        Client client = clientRepository.findByCin(cin)
//                .orElseThrow(() -> new RuntimeException("Client not found"));
//        clientRepository.delete(client);
//    }
//
//    private ClientDTO convertToDTO(Client client) {
//        ClientDTO clientDTO = new ClientDTO();
//        BeanUtils.copyProperties(client, clientDTO);
//        return clientDTO;
//    }
//
//    private CompteDTO convertToDTO(Compte compte) {
//        CompteDTO compteDTO = new CompteDTO();
//        BeanUtils.copyProperties(compte, compteDTO);
//
//        // Set only the 'cin' from the client
//        if (compte.getClient() != null) {
//            compteDTO.setClient(compte.getClient().getCin());
//        }
//
//        return compteDTO;
//    }
//
//    private Client convertToEntity(ClientDTO clientDTO) {
//        Client client = new Client();
//        BeanUtils.copyProperties(clientDTO, client);
//        return client;
//    }
//
//    private Compte convertToEntity(CompteDTO compteDTO) {
//        Compte compte = new Compte();
//        BeanUtils.copyProperties(compteDTO, compte);
//        return compte;
//    }
//}
package dev.atb.client.service;

import dev.atb.dto.ClientDTO;
import dev.atb.models.Client;
import dev.atb.repo.ClientRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ClientService {

    private final Logger logger = LoggerFactory.getLogger(ClientService.class);

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

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
        try {
            Client client = convertToEntity(clientDTO); // Manually map ClientDTO to Client

            // Log the client details before saving
            logger.info("Saving client: {}", client);

            Client savedClient = clientRepository.save(client);
            return convertToDTO(savedClient); // Manually map Client back to ClientDTO
        } catch (Exception e) {
            logger.error("Error saving client: {}", e.getMessage(), e);
            throw new RuntimeException("Error saving client", e);
        }
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

    private Client convertToEntity(ClientDTO clientDTO) {
        Client client = new Client();
        BeanUtils.copyProperties(clientDTO, client);
        return client;
    }
}
