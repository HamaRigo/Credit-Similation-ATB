package dev.atb.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String numeroDocument;

    @NotNull
    @Enumerated(EnumType.STRING)
    private DocumentType typeDocument;

    @NotNull
    private String nom;

    @NotNull
    private String prenom;

    @NotNull
    private String adresse;

    @NotNull
    private String telephone;

    @JsonIgnoreProperties("client")
    @OneToMany(mappedBy = "client", cascade = CascadeType.REMOVE)
    private List<Compte> comptes;

    @JsonIgnoreProperties("client")
    @OneToMany(mappedBy = "client", cascade = CascadeType.REMOVE)
    private List<Credit> credits;

    @CreationTimestamp
    @Column(updatable = false) // Ensure it is not updated after creation
    private LocalDateTime createdAt;
}
