package dev.atb.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.reactive.config.ResourceHandlerRegistry;
import org.springframework.web.reactive.config.WebFluxConfigurer;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

import java.util.concurrent.TimeUnit;

@Configuration
public class WebConfig implements WebFluxConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve static resources from the classpath:/static/ directory
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .setCacheControl(CacheControl.maxAge(365, TimeUnit.DAYS)); // Set caching for static resources
    }

    /**
     * Redirects unknown routes to index.html for SPA (Single Page Application).
     */
    @Bean
    public RouterFunction<ServerResponse> indexRouter() {
        return RouterFunctions.resources("/**", new org.springframework.core.io.ClassPathResource("static/index.html"));
    }
}