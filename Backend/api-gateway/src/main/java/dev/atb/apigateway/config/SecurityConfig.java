package dev.atb.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverterAdapter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.header.CrossOriginOpenerPolicyServerHttpHeadersWriter;
import org.springframework.security.web.server.header.ReferrerPolicyServerHttpHeadersWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import reactor.core.publisher.Mono;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
                .csrf(ServerHttpSecurity.CsrfSpec::disable) // Disable CSRF for APIs
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Configure CORS
                .authorizeExchange(exchange -> exchange
                        .pathMatchers("/", "/public/**", "/actuator/**", "/favicon.ico").permitAll() // Public endpoints
                        .pathMatchers("/api/admin/**").hasAuthority("ROLE_admin") // Admin-only endpoints
                        .pathMatchers("/api/user/**").hasAuthority("ROLE_user") // User-only endpoints
                        .anyExchange().authenticated() // Secure all other endpoints
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .jwtDecoder(jwtDecoder()) // Custom JWT decoder
                                .jwtAuthenticationConverter(jwtAuthenticationConverter())) // Custom JWT authentication converter
                )
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((exchange, exception) -> {
                            // Handle unauthorized access
                            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                            return Mono.empty();
                        })
                )
                .headers(headers -> headers
                        .referrerPolicy(referrer -> referrer.policy(ReferrerPolicyServerHttpHeadersWriter.ReferrerPolicy.NO_REFERRER)) // Referrer policy
                        .permissionsPolicy(permissions -> permissions.policy("geolocation=(), microphone=()")) // Permissions policy
                        .crossOriginOpenerPolicy(opener -> opener.policy(CrossOriginOpenerPolicyServerHttpHeadersWriter.CrossOriginOpenerPolicy.SAME_ORIGIN)) // COOP
                );

        return http.build();
    }

    @Bean
    public ReactiveJwtDecoder jwtDecoder() {
        // Replace with your Keycloak JWKS URI
        String jwkSetUri = "http://localhost:8282/realms/spring-microservices-realm/protocol/openid-connect/certs";
        return NimbusReactiveJwtDecoder.withJwkSetUri(jwkSetUri).build();
    }

    @Bean
    public ReactiveJwtAuthenticationConverterAdapter jwtAuthenticationConverter() {
        // Define a JWT converter to extract roles from the token
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(this::extractAuthorities);
        return new ReactiveJwtAuthenticationConverterAdapter(converter::convert);
    }

    private Collection<GrantedAuthority> extractAuthorities(Jwt jwt) {
        // Extract roles from "realm_access.roles" claim
        List<String> roles = jwt.getClaimAsStringList("realm_access.roles");
        if (roles == null) {
            return List.of();
        }
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                .collect(Collectors.toList());
    }

    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        // Configure CORS to allow frontend origin
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000")); // Frontend origin
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}