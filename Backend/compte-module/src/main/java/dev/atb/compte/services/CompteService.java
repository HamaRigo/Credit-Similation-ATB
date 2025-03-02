package dev.atb.compte.services;

import dev.atb.dto.CompteCountByStatusDTO;
import dev.atb.dto.CompteCountByTypeDTO;
import dev.atb.dto.CompteDTO;
import dev.atb.dto.ToDtoConverter;
import dev.atb.models.Compte;
import dev.atb.models.CompteCourant;
import dev.atb.models.CompteEpargne;
import dev.atb.repo.CompteRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompteService {
    @Autowired
    private CompteRepository compteRepository;

    private final Logger logger = LoggerFactory.getLogger(CompteService.class);

    public List<CompteDTO> findAll() {
        List<Compte> comptes = compteRepository.findAll();
        return comptes.stream().map(ToDtoConverter::compteToDto).collect(Collectors.toList());
    }

    public List<CompteCountByTypeDTO> findComptesCountByType() {
        List<Object[]> comptesByType = compteRepository.countComptesByType();
        return comptesByType.stream()
                .map(row -> new CompteCountByTypeDTO((String) row[0], (Long) row[1]))
                .collect(Collectors.toList());
    }

    public List<CompteCountByStatusDTO> findComptesCountByStatus() {
        List<Object[]> comptesByStatus = compteRepository.countComptesByStatus();
        return comptesByStatus.stream()
                .map(row -> new CompteCountByStatusDTO((Boolean) row[0], (Long) row[1]))
                .collect(Collectors.toList());
    }

    public List<CompteDTO> findAllCurrentComptes() {
        List<CompteCourant> comptes = compteRepository.findAllCurrentComptes();
        return comptes.stream().map(ToDtoConverter::compteToDto).collect(Collectors.toList());
    }

    public List<CompteDTO> findAllSavingComptes() {
        List<CompteEpargne> comptes = compteRepository.findAllSavingComptes();
        return comptes.stream().map(ToDtoConverter::compteToDto).collect(Collectors.toList());
    }

    public CompteDTO findById(final Long id) {
        Compte compte = compteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compte not found"));
        return ToDtoConverter.compteToDto(compte);
    }

    public boolean compteAlreadyExists(final String numeroCompte) {
        return compteRepository.existsByNumeroCompte(numeroCompte);
    }

    public CompteDTO createCurrentCompte(final CompteCourant compte) {
        try {
            return ToDtoConverter.compteToDto(compteRepository.save(compte));
        } catch (Exception e) {
            throw new RuntimeException("Error creating current compte", e);
        }
    }

    public CompteDTO createSavingCompte(final CompteEpargne compte) {
        try {
            return ToDtoConverter.compteToDto(compteRepository.save(compte));
        } catch (Exception e) {
            throw new RuntimeException("Error creating saving compte", e);
        }
    }

    public CompteDTO updateCurrentCompte(final CompteCourant compte) {
        compteRepository.findById(compte.getId())
                .orElseThrow(() -> new RuntimeException("Compte courant not found"));
        return ToDtoConverter.compteToDto(compteRepository.save(compte));
    }

    public CompteDTO updateSavingCompte(final CompteEpargne compte) {
        compteRepository.findById(compte.getId())
                .orElseThrow(() -> new RuntimeException("Compte epargne not found"));
        return ToDtoConverter.compteToDto(compteRepository.save(compte));
    }

    public void deleteById(final Long id) {
        Compte compte = compteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compte not found"));
        compteRepository.delete(compte);
    }
}
