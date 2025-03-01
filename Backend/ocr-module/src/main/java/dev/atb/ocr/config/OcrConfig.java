package dev.atb.ocr.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "ocr.tesseract")  // ✅ Ensure this annotation is present
public class OcrConfig {

    private List<String> imageTypes;
    private String configPath;
    private String lang;

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
