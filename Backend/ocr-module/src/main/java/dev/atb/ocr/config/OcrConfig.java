package dev.atb.ocr.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Setter
@Getter
@Configuration
@ConfigurationProperties(prefix = "ocr.tesseract")
public class OcrConfig {

    // Getters and Setters
    private List<String> imageTypes;
    private String configPath;
    private String lang;

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
