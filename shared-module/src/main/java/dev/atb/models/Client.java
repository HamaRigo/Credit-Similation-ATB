package dev.atb.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "clients")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Client {

    @Id
    @Column(nullable = false, updatable = false)
    private String cin;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false)
    private String adresse;

    @Column(name = "numero_telephone", nullable = false)
    private String numeroTelephone;

    @JsonIgnore
    @OneToOne(mappedBy = "client", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Compte compte;
    // Getters and setters

    public String getNom() {
        return nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public String getAdresse() {
        return adresse;
    }

    public String getNumeroTelephone() {
        return numeroTelephone;
    }

    public String getCin() {
        return cin;
    }
}
