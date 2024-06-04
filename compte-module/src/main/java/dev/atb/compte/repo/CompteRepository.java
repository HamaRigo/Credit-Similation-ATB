package dev.atb.compte.repo;

import dev.atb.models.Compte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

@EnableJpaRepositories
@Repository
public interface CompteRepository extends JpaRepository<Compte, String> {
}
