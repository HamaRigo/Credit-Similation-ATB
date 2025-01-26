package dev.atb.credit.Service;

import dev.atb.dto.CreditDTO;
import dev.atb.dto.ToDtoConverter;
import dev.atb.models.Credit;
import dev.atb.models.CreditType;
import dev.atb.repo.CreditRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.*;
import java.util.stream.Collectors;

@Service
public class CreditService {
    @Autowired
    private CreditRepository creditRepository;

    private final Logger logger = LoggerFactory.getLogger(CreditService.class);

    public List<CreditDTO> getAllCredits() {
        List<Credit> credits = creditRepository.findAll();
        return credits.stream().map(ToDtoConverter::creditToDto).collect(Collectors.toList());
    }

    public List<CreditType> getCreditTypes() {
        return Arrays.stream(CreditType.values())
                .sorted(Comparator.comparing(Enum::name))
                .collect(Collectors.toList());
    }

    public Map<CreditType, Long> findCreditsCountByType() {
        List<Object[]> creditsByType = creditRepository.countCreditsByType();

        Map<CreditType, Long> creditCounts = new TreeMap<>(Comparator.comparing(Enum::name));
        Arrays.stream(CreditType.values()).forEach(type -> creditCounts.put(type, 0L));
        creditsByType.forEach(credit -> creditCounts.put((CreditType) credit[0], (Long) credit[1]));

        return creditCounts;
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
        creditRepository.findById(credit.getId())
                .orElseThrow(() -> new RuntimeException("Credit not found"));
        return ToDtoConverter.creditToDto(creditRepository.save(credit));
    }

    public void deleteCredit(final Long id) {
        Credit credit = creditRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Credit not found"));
        creditRepository.delete(credit);
    }
}
