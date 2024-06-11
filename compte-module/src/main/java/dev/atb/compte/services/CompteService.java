package dev.atb.compte.services;


import dev.atb.client.repo.ClientRepository;
import dev.atb.compte.dto.CompteDTO;
import dev.atb.models.Compte;
import dev.atb.models.Client;
import dev.atb.models.Ocr;
import dev.atb.models.Credit;
import dev.atb.compte.repo.CompteRepository;
 // Ensure the correct package is imported
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
            Set<String> ocrs = new HashSet<>();
            for (Ocr ocr : compte.getOcrs()) {
                Long id = ocr.getId();
                ocrs.add(String.valueOf(id));
            }
            dto.setOcrs(ocrs);
        }

        if (compte.getCin() != null) {
            dto.setClient(compte.getCin().toString());
        }

        if (compte.getCredits() != null) {
            Set<String> credits = new HashSet<>();
            for (Credit credit : compte.getCredits()) {
                Long id = credit.getId();
                credits.add(String.valueOf(id));
            }
            dto.setCredits(credits);
        }

        return dto;
    }

    private Compte convertToEntity(CompteDTO dto) {
        Compte compte = new Compte();
        BeanUtils.copyProperties(dto, compte);

        if (dto.getClient() != null) {
            Client client = clientRepository.findById(dto.getClient()).orElse(null);
            compte.setCin(client);
        }

        if (dto.getOcrs() != null) {
            Set<Ocr> ocrs = dto.getOcrs().stream()
                    .map(ocrId -> ocrRepository.findById(ocrId).orElse(null))
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
