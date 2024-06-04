package dev.atb.Service;

import dev.atb.dto.CreditDTO;
import dev.atb.dto.CreditModelDTO;
import dev.atb.models.Credit;
import dev.atb.repo.CreditRepository;
import dev.atb.repo.ModeleDeCreditRepository;
import org.apache.kafka.common.errors.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CreditService {
    // Assuming you have CreditRepository and CreditModelRepository
    @Autowired
    private CreditRepository creditRepository;

    @Autowired
    private ModeleDeCreditRepository creditModelRepository;

    public CreditDTO getCreditById(Long id) {
        Credit credit = creditRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Credit not found"));
        return convertToDTO(credit);
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
}
