package dev.atb.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import reactor.core.publisher.Mono;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
            .csrf(ServerHttpSecurity.CsrfSpec::disable) // Disable CSRF if unnecessary
            .authorizeExchange(exchange -> exchange
                .pathMatchers("/", "/public/**", "/actuator/**", "/favicon.ico").permitAll() // Public endpoints
                .anyExchange().authenticated() // Secure all other paths
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults())) // Enable JWT authentication
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((exchange, exception) -> {
                    // Handle 401 errors
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return Mono.empty();
                })
        );
        return http.build();
    }
}
