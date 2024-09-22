package dev.atb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
@SpringBootApplication
@EnableJpaRepositories(basePackages = "dev.atb.repo") // Corrected base package for JPA repositories
@EntityScan(basePackages = "dev.atb.models") // Ensure the package for entities is included
public class OCRApplication {
    public static void main(String[] args) {
        SpringApplication.run(OCRApplication.class, args);
    }
}
