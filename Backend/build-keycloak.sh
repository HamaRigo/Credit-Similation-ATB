#!/bin/bash

# Project root directory
PROJECT_ROOT="Keycloak"
#mkdir -p $PROJECT_ROOT

echo "Creating project structure under $PROJECT_ROOT..."

# Create main directories
mkdir -p $PROJECT_ROOT/src/main/java/dev/atb/config
mkdir -p $PROJECT_ROOT/src/main/java/dev/atb/keycloak
mkdir -p $PROJECT_ROOT/src/main/java/dev/atb/controllers
mkdir -p $PROJECT_ROOT/src/main/java/dev/atb/services
mkdir -p $PROJECT_ROOT/src/main/resources/static
mkdir -p $PROJECT_ROOT/src/main/resources/templates
mkdir -p $PROJECT_ROOT/src/test

# Create Docker directory for Keycloak
mkdir -p $PROJECT_ROOT/keycloak-docker

# Create key configuration files
cat <<EOL > $PROJECT_ROOT/src/main/resources/application.yml
keycloak:
  realm: myrealm
  auth-server-url: http://localhost:8080/auth
  ssl-required: external
  resource: myclient
  credentials:
    secret: my-client-secret
  use-resource-role-mappings: true

spring:
  security:
    oauth2:
      client:
        provider:
          keycloak:
            issuer-uri: http://localhost:8080/auth/realms/myrealm
EOL

cat <<EOL > $PROJECT_ROOT/src/main/resources/application-dev.yml
# Development-specific configuration
EOL

cat <<EOL > $PROJECT_ROOT/src/main/resources/application-prod.yml
# Production-specific configuration
EOL

cat <<EOL > $PROJECT_ROOT/Dockerfile
# Dockerfile for Spring Boot Application
# Add instructions to build and run the Spring Boot app here
EOL

cat <<EOL > $PROJECT_ROOT/keycloak-docker/docker-compose.yml
version: '3'
services:
  keycloak:
    image: quay.io/keycloak/keycloak:21.0.0
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
    ports:
      - 8080:8080
    command: ["start-dev"]
EOL

# Sample Java Configuration Files
cat <<EOL > $PROJECT_ROOT/src/main/java/dev/atb/config/AppConfig.java
package dev.atb.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
    // General application configuration
}
EOL

cat <<EOL > $PROJECT_ROOT/src/main/java/dev/atb/config/SecurityConfig.java
package dev.atb.config;

import org.keycloak.adapters.springsecurity.KeycloakConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@KeycloakConfiguration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
            .antMatchers("/public/**").permitAll()
            .antMatchers("/admin/**").hasRole("ADMIN")
            .antMatchers("/user/**").hasRole("USER")
            .anyRequest().authenticated();
    }
}
EOL

cat <<EOL > $PROJECT_ROOT/src/main/java/dev/atb/keycloak/KeycloakConfig.java
package dev.atb.keycloak;

import org.keycloak.adapters.springboot.KeycloakSpringBootConfigResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KeycloakConfig {

    @Bean
    public KeycloakSpringBootConfigResolver keycloakConfigResolver() {
        return new KeycloakSpringBootConfigResolver();
    }
}
EOL

cat <<EOL > $PROJECT_ROOT/src/main/java/dev/atb/controllers/AdminController.java
package dev.atb.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @GetMapping("/status")
    public String adminStatus() {
        return "Admin endpoint accessed.";
    }
}
EOL

cat <<EOL > $PROJECT_ROOT/src/main/java/dev/atb/controllers/UserController.java
package dev.atb.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {

    @GetMapping("/status")
    public String userStatus() {
        return "User endpoint accessed.";
    }
}
EOL

cat <<EOL > $PROJECT_ROOT/src/main/java/dev/atb/services/AdminService.java
package dev.atb.services;

import org.springframework.stereotype.Service;

@Service
public class AdminService {
    // Business logic for admin functionality
}
EOL

cat <<EOL > $PROJECT_ROOT/src/main/java/dev/atb/services/UserService.java
package dev.atb.services;

import org.springframework.stereotype.Service;

@Service
public class UserService {
    // Business logic for user functionality
}
EOL

# Create README file
cat <<EOL > $PROJECT_ROOT/README.md
# My Spring Boot Project with Keycloak Integration

This project demonstrates a modular structure for integrating Spring Boot with Keycloak for authentication and authorization.

## Project Structure
- \`src/main/java/dev/atb/config\`: General configuration files.
- \`src/main/java/dev/atb/keycloak\`: Keycloak-specific configurations.
- \`src/main/java/dev/atb/controllers\`: REST controllers for different user roles.
- \`src/main/resources/application.yml\`: Main application properties including Keycloak configuration.
- \`keycloak-docker/docker-compose.yml\`: Docker Compose setup for Keycloak server.

## Running the Project
1. Start Keycloak server using Docker Compose:
   \`\`\`
   cd keycloak-docker
   docker-compose up
   \`\`\`

2. Run the Spring Boot application:
   \`\`\`
   ./mvnw spring-boot:run
   \`\`\`

EOL

echo "Project structure created successfully!"
