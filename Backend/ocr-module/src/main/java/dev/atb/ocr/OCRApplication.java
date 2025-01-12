package dev.atb.ocr;

import dev.atb.ocr.config.OcrConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
@SpringBootApplication
@EnableConfigurationProperties(OcrConfig.class)  // Enable custom config properties
@ComponentScan(basePackages = {"dev.atb.ocr", "dev.atb"})  // Ensure scanning for both client-specific and shared components
@EntityScan(basePackages = {"dev.atb.models"})  // Scan for shared JPA entities
@EnableJpaRepositories(basePackages = {"dev.atb.repo"})  // Scanning for JPA repositories
public class OCRApplication {
    public static void main(String[] args) {
        SpringApplication.run(OCRApplication.class, args);
    }
}
