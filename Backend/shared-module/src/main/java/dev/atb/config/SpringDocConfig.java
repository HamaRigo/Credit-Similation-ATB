package dev.atb.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;

@Configuration
public class SpringDocConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("My REST API")
                        .version("1.0")
                        .description("API description")
                        .contact(new Contact()
                                .name("Your Name")
                                .url("www.example.com")
                                .email("email@example.com")
                        )
                );
    }
}