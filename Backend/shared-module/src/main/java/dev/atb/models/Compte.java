package dev.atb.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Compte {
    @Id
    @Column(nullable = false, updatable = false)
    private String numeroCompte;

    private double solde;

    private String typeCompte;

    @JsonIgnoreProperties("compte")
    @OneToOne(optional = false, fetch = FetchType.LAZY)
    private Client client;

    @JsonIgnoreProperties("compte")
    @OneToMany(mappedBy = "compte", cascade = CascadeType.REMOVE)
    private List<Ocr> ocrs;

    @JsonIgnoreProperties("compte")
    @OneToMany(mappedBy = "compte", cascade = CascadeType.REMOVE)
    private List<Credit> credits;
}
