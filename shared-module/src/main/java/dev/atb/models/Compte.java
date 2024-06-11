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

    @JsonIgnoreProperties("numeroCompte")
    @OneToMany(mappedBy = "numeroCompte", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Ocr> ocrs;

    @JsonIgnoreProperties("numeroCompte")
    @OneToMany(mappedBy = "numeroCompte", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Credit> credits;


    @OneToOne
    @JoinColumn(name = "cin") // Assuming 'client_cin' is the name of the foreign key column in the database
    private Client client;



    public void setNumeroCompte(String numeroCompte) {
        this.numeroCompte = numeroCompte;
    }

    public double getSolde() {
        return solde;
    }

    public void setSolde(double solde) {
        this.solde = solde;
    }

    public String getTypeCompte() {
        return typeCompte;
    }

    public void setTypeCompte(String typeCompte) {
        this.typeCompte = typeCompte;
    }

    public Set<Ocr> getOcrs() {
        return ocrs;
    }

    public void setOcrs(Set<Ocr> ocrs) {
        this.ocrs = ocrs;
    }

    public Set<Credit> getCredits() {
        return credits;
    }

    public void setCredits(Set<Credit> credits) {
        this.credits = credits;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public Object getCin() {
        return client;
    }

    public void setCin(Client client) {
        this.client = client;
    }

}