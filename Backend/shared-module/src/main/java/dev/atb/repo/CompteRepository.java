package dev.atb.repo;

import dev.atb.models.Compte;
import dev.atb.models.CompteCourant;
import dev.atb.models.CompteEpargne;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@EnableJpaRepositories
public interface CompteRepository extends JpaRepository<Compte, String> {
    @Query("SELECT c FROM Compte c WHERE TYPE(c) = CompteCourant")
    List<CompteCourant> findAllCurrentComptes();

    @Query("SELECT c FROM Compte c WHERE TYPE(c) = CompteEpargne")
    List<CompteEpargne> findAllSavingComptes();
}
