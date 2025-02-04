package dev.atb.repo;

import dev.atb.models.Ocr;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@EnableJpaRepositories
public interface OcrRepository extends JpaRepository<Ocr, Long> {
    // Custom query to find OCR records by document type
    List<Ocr> findByTypeDocument(String typeDocument);

    // Custom query to find OCR records marked as fraud
    List<Ocr> findByFraud(boolean fraud);

    // Custom query to find OCR records by account number
    List<Ocr> findByCompteNumeroCompte(@Param("compteId") String compteId);
}
