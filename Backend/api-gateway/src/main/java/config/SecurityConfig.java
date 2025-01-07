package config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.header.CrossOriginOpenerPolicyServerHttpHeadersWriter;
import org.springframework.security.web.server.header.ReferrerPolicyServerHttpHeadersWriter;

import reactor.core.publisher.Mono;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
                .csrf(ServerHttpSecurity.CsrfSpec::disable) // Disable CSRF if unnecessary
                .authorizeExchange(exchange -> exchange
                        .pathMatchers("/", "/public/**", "/actuator/**", "/favicon.ico").permitAll() // Public endpoints
                        .pathMatchers("/api/admin/**").hasAuthority("ROLE_admin") // Admin-only endpoints
                        .pathMatchers("/api/user/**").hasAuthority("ROLE_user") // User-only endpoints
                        .anyExchange().authenticated() // Secure all other paths
                )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtDecoder(jwtDecoder())) // Use JWT decoder
            )
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((exchange, exception) -> {
                            // Handle 401 errors
                            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                            return Mono.empty();
                        })
                )
                .headers(headers -> headers
                        .referrerPolicy(referrer -> referrer.policy(ReferrerPolicyServerHttpHeadersWriter.ReferrerPolicy.NO_REFERRER)) // Referrer Policy
                        .permissionsPolicy(permissions -> permissions.policy("geolocation=(), microphone=()")) // Permissions Policy
                        .crossOriginOpenerPolicy(opener -> opener.policy(CrossOriginOpenerPolicyServerHttpHeadersWriter.CrossOriginOpenerPolicy.SAME_ORIGIN)) // COOP
                );
        return http.build();
    }
    @Bean
    public ReactiveJwtDecoder jwtDecoder() {
        // Replace with your Keycloak's JWKS URI
        String jwkSetUri = "http://localhost:8282/realms/spring-microservices-realm/protocol/openid-connect/certs";
        return NimbusReactiveJwtDecoder.withJwkSetUri(jwkSetUri).build();
    }
}