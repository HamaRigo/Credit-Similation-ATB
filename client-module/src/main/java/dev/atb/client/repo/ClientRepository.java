package dev.atb.client.repo;

import dev.atb.models.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.util.Optional;

@EnableJpaRepositories
public interface ClientRepository extends JpaRepository<Client, String> {
    Optional<Client> findByCin(String cin);

}
