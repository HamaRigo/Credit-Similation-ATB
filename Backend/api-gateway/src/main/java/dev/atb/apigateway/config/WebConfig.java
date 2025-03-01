package dev.atb.apigateway.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.config.ResourceHandlerRegistry;
import org.springframework.web.reactive.config.WebFluxConfigurer;

@Configuration
public class WebConfig implements WebFluxConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve static resources from the classpath:/static/ directory
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/");
    }
}
