package dev.atb.compte.services;


import dev.atb.dto.CompteDTO;
import dev.atb.models.Compte;
import dev.atb.models.Client;
import dev.atb.models.Ocr;
import dev.atb.models.Credit;

import dev.atb.repo.ClientRepository;
import dev.atb.repo.CompteRepository;
import dev.atb.repo.CreditRepository;
import dev.atb.repo.OcrRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
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
        Compte compte = convertToEntity(compteDTO);
        Compte savedCompte = compteRepository.save(compte);
        return convertToDTO(savedCompte);
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
                    .map(ocr -> ocr.getId().toString())
                    .collect(Collectors.toSet());
            dto.setOcrs(ocrs);
        }

        if (compte.getClient() != null) {
            dto.setClient_cin(compte.getClient().getCin()); // Set cin of the client
        }

        if (compte.getCredits() != null) {
            Set<String> credits = compte.getCredits().stream()
                    .map(credit -> credit.getId().toString())
                    .collect(Collectors.toSet());
            dto.setCredits(credits);
        }

        return dto;
    }


    private Compte convertToEntity(CompteDTO dto) {
        Compte compte = new Compte();
        BeanUtils.copyProperties(dto, compte);

        if (dto.getClient_cin() != null) {
            Client client = clientRepository.findById(dto.getClient_cin()).orElse(null);
            compte.setClient(client); // Set the Client entity
        }

        if (dto.getOcrs() != null) {
            Set<Ocr> ocrs = dto.getOcrs().stream()
                    .map(ocrId -> ocrRepository.findById(String.valueOf(Long.valueOf(ocrId))).orElse(null))
                    .collect(Collectors.toSet());
            compte.setOcrs(ocrs);
        }

        if (dto.getCredits() != null) {
            Set<Credit> credits = dto.getCredits().stream()
                    .map(creditId -> creditRepository.findById(Long.valueOf(creditId)).orElse(null))
                    .collect(Collectors.toSet());
            compte.setCredits(credits);
        }

        return compte;
    }

}
