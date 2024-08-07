package dev.atb.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import dev.atb.dto.CompteDTO;
import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "ocr")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Ocr {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    private String id;

    @Column(nullable = false)
    private String typeDocument;

    @Column(nullable = false)
    private String resultatsReconnaissance;

    private boolean fraude;

    @Lob
    private String image; // Storing image data as a Base64 encoded string

    @JsonIgnoreProperties("ocrs")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "numeroCompte")
    private Compte numeroCompte;

    public Compte getNumeroCompte() {
        return numeroCompte;
    }

    public void setNumeroCompte(Compte numeroCompte) {
        this.numeroCompte = numeroCompte;
    }

    public void setTypeDocument(String typeDocument) {
    }

    public void setResultatsReconnaissance(String resultatsReconnaissance) {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}