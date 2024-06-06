package dev.atb.Service;

import dev.atb.dto.CreditDTO;
import dev.atb.dto.CreditModelDTO;
import dev.atb.models.Credit;
import dev.atb.models.Credit_model;
import dev.atb.repo.CreditModelRepository;
import dev.atb.repo.CreditRepository;

import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CreditService {

    @Autowired
    private CreditRepository creditRepository;

    @Autowired
    private CreditModelRepository creditModelRepository;

    public CreditDTO getCreditById(Long id) {
        Credit credit = creditRepository.findById(id).orElseThrow(() -> new RuntimeException("Credit not found"));
        return convertToDTO(credit);
    }

    public List<CreditDTO> getAllCredits() {
        List<Credit> credits = creditRepository.findAll();
        return credits.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public CreditDTO createCredit(CreditDTO creditDTO) {
        Credit credit = convertToEntity(creditDTO);
        credit = creditRepository.save(credit);
        return convertToDTO(credit);
    }

    public CreditDTO updateCredit(Long id, CreditDTO creditDTO) {
        Credit credit = creditRepository.findById(id).orElseThrow(() -> new RuntimeException("Credit not found"));
        BeanUtils.copyProperties(creditDTO, credit, "id");
        credit = creditRepository.save(credit);
        return convertToDTO(credit);
    }

    public void deleteCredit(Long id) {
        Credit credit = creditRepository.findById(id).orElseThrow(() -> new RuntimeException("Credit not found"));
        creditRepository.delete(credit);
    }

    private CreditDTO convertToDTO(Credit credit) {
        CreditModelDTO creditModelDTO = new CreditModelDTO(
                credit.getModeldecredit().getId(),
                credit.getModeldecredit().getFacteursDeRisque(),
                credit.getModeldecredit().getScores(),
                credit.getModeldecredit().getCreditId().getId()
        );

        return new CreditDTO(
                credit.getId(),
                credit.getMontant(),
                credit.getTauxInteret(),
                credit.getDuree(),
                credit.getStatut(),
                credit.getNumeroCompte().getNumeroCompte(),
                creditModelDTO
        );
    }

    private Credit convertToEntity(CreditDTO creditDTO) {
        Credit credit = new Credit();
        BeanUtils.copyProperties(creditDTO, credit);
        Credit_model creditModel = new Credit_model(); // Use Credit_model instead of Credit_Model
        creditModel.setId(creditDTO.getModeldecredit().getId());
        creditModel.setFacteursDeRisque(creditDTO.getModeldecredit().getFacteursDeRisque());
        creditModel.setScores(creditDTO.getModeldecredit().getScores());
        // Set the Credit entity reference in CreditModel
        creditModel.setCreditId(credit);
        credit.setModeldecredit(creditModel);
        return credit;
    }

    // CRUD operations for CreditModelDTO

    public CreditModelDTO getCreditModelById(Long id) {
        Credit_model creditModel = creditModelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Credit Model not found"));
        return convertToDTO(creditModel);
    }

    public List<CreditModelDTO> getAllCreditModels() {
        List<Credit_model> creditModels = creditModelRepository.findAll();
        return creditModels.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public CreditModelDTO createCreditModel(CreditModelDTO creditModelDTO) {
        Credit_model creditModel = convertToEntity(creditModelDTO);
        creditModel = creditModelRepository.save(creditModel);
        return convertToDTO(creditModel);
    }

    public CreditModelDTO updateCreditModel(Long id, CreditModelDTO creditModelDTO) {
        Credit_model creditModel = creditModelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Credit Model not found"));
        BeanUtils.copyProperties(creditModelDTO, creditModel, "id");
        creditModel = creditModelRepository.save(creditModel);
        return convertToDTO(creditModel);
    }

    public void deleteCreditModel(Long id) {
        Credit_model creditModel = creditModelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Credit Model not found"));
        creditModelRepository.delete(creditModel);
    }

    private CreditModelDTO convertToDTO(Credit_model creditModel) {
        CreditModelDTO creditModelDTO = new CreditModelDTO();
        BeanUtils.copyProperties(creditModel, creditModelDTO);
        return creditModelDTO;
    }

    private Credit_model convertToEntity(CreditModelDTO creditModelDTO) {
        Credit_model creditModel = new Credit_model();
        BeanUtils.copyProperties(creditModelDTO, creditModel);
        return creditModel;
    }
}
