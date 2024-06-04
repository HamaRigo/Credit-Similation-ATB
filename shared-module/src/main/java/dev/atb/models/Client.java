package dev.atb.models;

import jakarta.persistence.*;

@Entity
@Table(name = "clients")
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


    @OneToOne(mappedBy = "client")
    private Compte compte;



}
