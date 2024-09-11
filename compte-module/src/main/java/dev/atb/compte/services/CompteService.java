package dev.atb.compte.services;

import dev.atb.compte.dto.CompteDTO;
import dev.atb.models.Compte;
import dev.atb.models.Client;
import dev.atb.models.Ocrs;
import dev.atb.models.Credit;
import dev.atb.repo.ClientRepository;
import dev.atb.repo.CompteRepository;
import dev.atb.repo.CreditRepository;
import dev.atb.repo.OcrRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CompteService {

    @Autowired
    private CompteRepository compteRepository;
    @Autowired
    private ClientRepository clientRepository;
    @Autowired
    private OcrRepository ocrRepository;
    @Autowired
    private CreditRepository creditRepository;

    public CompteDTO findById(String numeroCompte) {
        Compte compte = compteRepository.findById(numeroCompte).orElse(null);
        return convertToDTO(compte);
    }

    public List<CompteDTO> findAll() {
        List<Compte> comptes = compteRepository.findAll();
        return comptes.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public CompteDTO save(CompteDTO compteDTO) {
        Compte existingCompte = compteRepository.findById(compteDTO.getNumeroCompte()).orElse(null);
        if (existingCompte != null) {
            // Update the existing compte
            BeanUtils.copyProperties(compteDTO, existingCompte, "numeroCompte"); // Keep numeroCompte unchanged
            Compte updatedCompte = compteRepository.save(existingCompte);
            return convertToDTO(updatedCompte);
        } else {
            // Create a new compte
            Compte newCompte = convertToEntity(compteDTO);
            Compte savedCompte = compteRepository.save(newCompte);
            return convertToDTO(savedCompte);
        }
    }

    public void deleteById(String id) {
        compteRepository.deleteById(id);
    }

    private CompteDTO convertToDTO(Compte compte) {
        if (compte == null) {
            return null;
        }
        CompteDTO dto = new CompteDTO();
        BeanUtils.copyProperties(compte, dto);

        if (compte.getOcrs() != null) {
            Set<String> ocrs = compte.getOcrs().stream()
                    .map(Ocrs::getId)
                    .collect(Collectors.toSet());
            dto.setOcrs(ocrs);
        }

        if (compte.getClient() != null) {
            dto.setClientCin(compte.getClient().getCin()); // Set cin of the client
        }

        if (compte.getCredits() != null) {
            Set<String> credits = compte.getCredits().stream()
                    .map(credit -> String.valueOf(credit.getId()))
                    .collect(Collectors.toSet());
            dto.setCredits(credits);
        }

        return dto;
    }

    private Compte convertToEntity(CompteDTO dto) {
        Compte compte = new Compte();
        BeanUtils.copyProperties(dto, compte);

        if (dto.getClientCin() != null) {
            Client client = clientRepository.findById(dto.getClientCin()).orElse(null);
            compte.setClient(client); // Set the Client entity
        }

        if (dto.getOcrs() != null) {
            Set<Ocrs> ocrs = dto.getOcrs().stream()
                    .map(ocrId -> ocrRepository.findById(ocrId).orElse(null))
                    .filter(java.util.Objects::nonNull)
                    .collect(Collectors.toSet());
            compte.setOcrs(ocrs);
        }

        if (dto.getCredits() != null) {
            Set<Credit> credits = dto.getCredits().stream()
                    .map(creditId -> creditRepository.findById(Long.valueOf(creditId)).orElse(null))
                    .filter(java.util.Objects::nonNull)
                    .collect(Collectors.toSet());
            compte.setCredits(credits);
        }

        return compte;
    }
}
