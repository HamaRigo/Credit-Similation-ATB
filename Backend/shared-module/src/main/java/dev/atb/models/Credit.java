package dev.atb.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Credit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private float tauxInteret;

    @Column(nullable = false)
    private int duree;

    @Column(nullable = false)
    private float montant;

    @Column(nullable = false)
    private String statut;

    @JsonIgnoreProperties("credits")
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Compte compte;

    @JsonIgnoreProperties("credit")
    @OneToOne(mappedBy = "credit")
    private CreditModel modelDeCredit;
}
