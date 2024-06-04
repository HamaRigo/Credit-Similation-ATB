package dev.atb.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Credit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private float montant;

    @Column(nullable = false)
    private float tauxInteret;

    @Column(nullable = false)
    private int duree;

    private String statut;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "numero_compte_id")
    private Compte numeroCompte;

    @OneToOne(mappedBy = "creditId", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Credit_model modeldecredit;




}
