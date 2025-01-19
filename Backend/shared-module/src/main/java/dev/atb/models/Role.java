package dev.atb.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "ROLE") // Matches Keycloak's role table
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private String id;

    @Column(name = "NAME", unique = true, nullable = false) // Matches Keycloak's NAME column
    private String name;

    @Column(name = "DESCRIPTION") // Optional: Add description field to match Keycloak
    private String description;

    @ManyToMany(mappedBy = "roles")
    private List<User> users;
}