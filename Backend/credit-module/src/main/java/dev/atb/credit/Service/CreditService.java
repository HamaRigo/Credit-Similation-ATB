package dev.atb.credit.Service;

import dev.atb.dto.CreditDTO;
import dev.atb.dto.CreditModelDTO;
import dev.atb.dto.ToDtoConverter;
import dev.atb.models.Credit;
import dev.atb.models.CreditModel;
import dev.atb.repo.CreditModelRepository;
import dev.atb.repo.CreditRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.stream.Collectors;

@Service
public class CreditService {
    @Autowired
    private CreditRepository creditRepository;

    @Autowired
    private CreditModelRepository creditModelRepository;

    private final Logger logger = LoggerFactory.getLogger(CreditService.class);

    public List<CreditDTO> getAllCredits() {
        List<Credit> credits = creditRepository.findAll();
        return credits.stream().map(ToDtoConverter::creditToDto).collect(Collectors.toList());
    }

    public CreditDTO getCreditById(final Long id) {
        Credit credit = creditRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Credit not found"));
        return ToDtoConverter.creditToDto(credit);
    }

    public CreditDTO createCredit(final Credit credit) {
        try {
            return ToDtoConverter.creditToDto(creditRepository.save(credit));
        } catch (Exception e) {
            throw new RuntimeException("Error saving credit", e);
        }
    }

    public CreditDTO updateCredit(final Credit credit) {
        logger.error("updating ... " + credit.toString());
        creditRepository.findById(credit.getId())
                .orElseThrow(() -> new RuntimeException("Credit not found"));
        return ToDtoConverter.creditToDto(creditRepository.save(credit));
    }

    public void deleteCredit(final Long id) {
        Credit credit = creditRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Credit not found"));
        creditRepository.delete(credit);
    }

    public List<CreditModelDTO> getAllCreditModels() {
        List<CreditModel> creditModels = creditModelRepository.findAll();
        return creditModels.stream().map(ToDtoConverter::creditModelToDto).collect(Collectors.toList());
    }

    public CreditModelDTO getCreditModelById(final Long id) {
        CreditModel creditModel = creditModelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Credit Model not found"));
        return ToDtoConverter.creditModelToDto(creditModel);
    }

    public CreditModelDTO createCreditModel(final CreditModel creditModel) {
        try {
            return ToDtoConverter.creditModelToDto(creditModelRepository.save(creditModel));
        } catch (Exception e) {
            throw new RuntimeException("Error saving credit model", e);
        }
    }

    public CreditModelDTO updateCreditModel(final CreditModel creditModel) {
        creditModelRepository.findById(creditModel.getId())
                .orElseThrow(() -> new RuntimeException("Credit Model not found"));
        return ToDtoConverter.creditModelToDto(creditModelRepository.save(creditModel));
    }

    public void deleteCreditModel(final Long id) {
        CreditModel creditModel = creditModelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Credit Model not found"));
        creditModelRepository.delete(creditModel);
    }
}
