package dev.atb.client;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableDiscoveryClient
@SpringBootApplication
@ComponentScan(basePackages = {"dev.atb.client", "dev.atb"})  // Ensure scanning for both client-specific and shared components
@EntityScan(basePackages = {"dev.atb.models"})  // Scan for shared JPA entities
@EnableJpaRepositories(basePackages = {"dev.atb.repo"})  // Scanning for shared repositories
public class ClientApplication {

    public static void main(String[] args) {
        SpringApplication.run(ClientApplication.class, args);
    }

}
