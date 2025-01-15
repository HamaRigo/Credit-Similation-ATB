package dev.atb.repo;

import dev.atb.models.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

@Repository
@EnableJpaRepositories
public interface ClientRepository extends JpaRepository<Client, Long> {
    Client findByNumeroDocument(String numeroDocument);

    @Query("SELECT COUNT(c) FROM Client c")
    Long countClients();
}
