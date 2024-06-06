package dev.atb.repo;

import dev.atb.models.Credit_model;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableJpaRepositories

public interface CreditModelRepository extends JpaRepository<Credit_model, Long> {
}
