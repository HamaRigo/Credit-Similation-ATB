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
public interface CompteRepository extends JpaRepository<Compte, Long> {
    boolean existsByNumeroCompte(String numeroCompte);

    @Query("SELECT c FROM Compte c WHERE TYPE(c) = CompteCourant")
    List<CompteCourant> findAllCurrentComptes();

    @Query("SELECT c FROM Compte c WHERE TYPE(c) = CompteEpargne")
    List<CompteEpargne> findAllSavingComptes();

    @Query("SELECT c.typeCompte as type, COUNT(c) as count FROM Compte c GROUP BY TYPE(c)")
    List<Object[]> countComptesByType();

    @Query("SELECT c.activated, COUNT(c) FROM Compte c GROUP BY c.activated")
    List<Object[]> countComptesByStatus();
}
