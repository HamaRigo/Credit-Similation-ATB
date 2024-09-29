package dev.atb.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;

import java.util.Collections;

@Configuration
public class SpringFoxConfig {

    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.basePackage("dev.atb")) // Change this to the base package of your modules
                .paths(PathSelectors.any())
                .build()
                .apiInfo(apiInfo());
    }


    private ApiInfo apiInfo() {
        return new ApiInfo(
                "My REST API", // Title
                "API description", // Description
                "1.0", // Version
                "Terms of service", // Terms of service URL
                new Contact("Your Name", "www.example.com", "email@example.com"), // Contact
                "License of API", // License
                "API license URL", // License URL
                Collections.emptyList() // Vendor extensions (if any)
        );
    }

}
