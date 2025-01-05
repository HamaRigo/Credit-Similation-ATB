package dev.atb.ocr.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.config.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class WebConfig implements WebMvcConfigurer {


    public void addCorsMappings(CorsRegistry registry) {
        // Allow CORS for all paths
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")  // Allow requests from your frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*") // Allow all headers
                .allowCredentials(true);  // Allow credentials like cookies
    }
}
