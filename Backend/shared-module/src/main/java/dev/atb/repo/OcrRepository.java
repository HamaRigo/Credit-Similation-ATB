package dev.atb.repo;

import dev.atb.models.Ocr;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OcrRepository extends JpaRepository<Ocr, String> {
    List<Ocr> findByNumeroCompte_Id(String numeroCompteId);
    List<Ocr> findByResultatsReconnaissanceContaining(String searchText);
}
