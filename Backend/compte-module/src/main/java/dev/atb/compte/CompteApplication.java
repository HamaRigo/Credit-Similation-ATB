package dev.atb.compte;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableDiscoveryClient
@SpringBootApplication
@ComponentScan(basePackages = {"dev.atb.compte", "dev.atb"})  // Ensure scanning for both client-specific and shared components
@EntityScan(basePackages = {"dev.atb.models"})  // Scan for shared JPA entities
@EnableJpaRepositories(basePackages = {"dev.atb.repo"})
public class CompteApplication {

    public static void main(String[] args) {
        SpringApplication.run(CompteApplication.class, args);
    }
}
