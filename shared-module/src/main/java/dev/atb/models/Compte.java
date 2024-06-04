package dev.atb.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class Compte {
    @Id

    @Column(nullable = false, updatable = false)
    private String numeroCompte;

    private double solde;

    private String typeCompte;

    @OneToMany(mappedBy = "numeroCompte")
    private Set<Ocr> ocrs;


    @OneToOne
    @JoinColumn(name = "cin") // Assuming 'cin' is the name of the column in the database
    private Client client;

    @OneToMany(mappedBy = "numeroCompte")
    private Set<Credit> credits;

}