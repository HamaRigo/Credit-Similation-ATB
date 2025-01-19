package dev.atb.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "USER_ENTITY") // Matches Keycloak's user table
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID") // Matches Keycloak's user ID column
    private String id;

    @NotNull
    @Column(name = "USERNAME", unique = true, updatable = false)
    private String username;

    @NotNull
    @Column(name = "PASSWORD") // Stored hashed in Keycloak
    private String password;

    @NotNull
    @Column(name = "EMAIL", unique = true)
    private String email;

    @Column(name = "FIRST_NAME") // Maps to Keycloak's `firstName`
    private String prenom;

    @Column(name = "LAST_NAME") // Maps to Keycloak's `lastName`
    private String nom;

    @Column(name = "TELEPHONE") // Custom field not in Keycloak by default
    private String telephone;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "USER_ROLE_MAPPING", // Keycloak's user-role mapping table
        joinColumns = @JoinColumn(name = "USER_ID"),
        inverseJoinColumns = @JoinColumn(name = "ROLE_ID")
    )
    private List<Role> roles;

    @Column(name = "ENABLED", nullable = false)
    private boolean enabled = true;

    @Column(name = "EMAIL_VERIFIED", nullable = false)
    private boolean emailVerified = false;

    @Column(name = "REALM_ID", nullable = false) // For multi-realm setups in Keycloak
    private String realmId = "master"; // Default to "master"
}