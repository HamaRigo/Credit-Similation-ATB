package dev.atb.ocr.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Match all URLs in OcrController
        registry.addMapping("/ocrs/**") // Matches all endpoints in the OcrController
                .allowedOrigins("http://localhost:3000", "http://localhost:9090") // Frontend and Docker URLs
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true); // Allow credentials if necessary
    }
}
