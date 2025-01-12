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
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(unique = true, updatable = false)
    private String username;

    @NotNull
    private String password;

    @NotNull
    private String email;

    @NotNull
    private String nom;

    @NotNull
    private String prenom;

    @NotNull
    private String telephone;

    @ManyToMany(fetch = FetchType.LAZY)
    private List<Role> roles;
}
