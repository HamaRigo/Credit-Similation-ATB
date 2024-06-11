package dev.atb.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

public class Compte {
    @Id

    @Column(nullable = false, updatable = false)
    private String numeroCompte;

    private double solde;

    private String typeCompte;

//    @JsonIgnoreProperties("compte")
//    @OneToMany(mappedBy = "numeroCompte")
//    private Set<Ocr> ocrs;

//    @JsonIgnoreProperties("compte")
//    @OneToMany(mappedBy = "numeroCompte",fetch = FetchType.LAZY, cascade = CascadeType.ALL)
//    private Set<Credit> credits;

    @JsonIgnoreProperties("numeroCompte")
    @OneToMany(mappedBy = "numeroCompte", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Ocr> ocrs;

    @JsonIgnoreProperties("numeroCompte")
    @OneToMany(mappedBy = "numeroCompte", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Credit> credits;


    @OneToOne
    @JoinColumn(name = "cin") // Assuming 'client_cin' is the name of the foreign key column in the database
    private Client client;

//    @JsonIgnoreProperties("compte")
//    @OneToMany(mappedBy = "compte")
//    private Set<Credit> credits;
}