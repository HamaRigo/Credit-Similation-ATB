package dev.atb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
@EnableDiscoveryClient

@SpringBootApplication
@EnableJpaRepositories(basePackages = "dev.atb.repo")
@EntityScan(basePackages = "dev.atb.models")
public class CreditApplication {
    public static void main(String[] args) {SpringApplication.run(CreditApplication.class, args);}
}