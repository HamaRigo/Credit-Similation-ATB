package dev.atb.repo;


import dev.atb.models.Credit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@EnableJpaRepositories
public interface CreditRepository extends JpaRepository<Credit, Long> {
    @Query("SELECT c.type as type, COUNT(c) as count FROM Credit c GROUP BY TYPE(c)")
    List<Object[]> countCreditsByType();
}
