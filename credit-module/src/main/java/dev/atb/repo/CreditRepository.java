package dev.atb.repo;


import dev.atb.models.Credit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableJpaRepositories
public interface CreditRepository extends JpaRepository<Credit, Long> {
}
