//package dev.atb.repo;
//
//import dev.atb.models.Client;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
//import org.springframework.stereotype.Repository;
//
//import java.util.Optional;
//@Repository
//@EnableJpaRepositories
//
//public interface ClientRepository extends JpaRepository<Client, String> {
//    Optional<Client> findByCin(String cin);
//}
package dev.atb.repo;

import dev.atb.models.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByCin(String cin);
}
