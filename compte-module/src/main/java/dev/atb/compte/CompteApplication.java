package dev.atb.compte;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
@EnableDiscoveryClient
@SpringBootApplication
@EnableJpaRepositories(basePackages = {
        "dev.atb.client.repo",
        "dev.atb.compte.repo",
        "dev.atb.repo"
})
@EntityScan(basePackages = "dev.atb.models")
public class CompteApplication {

    public static void main(String[] args) {
        SpringApplication.run(CompteApplication.class, args);
    }

}
