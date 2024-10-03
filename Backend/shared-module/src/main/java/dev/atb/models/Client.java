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
    @Column(nullable = false, updatable = false)
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

    @NotNull
    @CreationTimestamp
    private LocalDateTime createdAt;
}
