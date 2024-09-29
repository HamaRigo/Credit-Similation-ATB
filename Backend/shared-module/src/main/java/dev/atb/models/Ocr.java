package dev.atb.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "ocrs")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Ocr {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    private String id;

    @Column(nullable = false)
    private String typeDocument;

    @Column(nullable = false, name = "resultatsReconnaissance") // Renamed to match the database column
    private String resultatsReconnaissance;

    private boolean fraude;

    @Lob
    private String image; // Storing image data as a Base64 encoded string

    @JsonIgnoreProperties("ocrs")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "numeroCompte")
    private Compte numeroCompte;

    // Optional: Add created and updated timestamps
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTypeDocument() {
        return typeDocument;
    }

    public void setTypeDocument(String typeDocument) {
        this.typeDocument = typeDocument;
    }

    public String getResultatsReconnaissance() {
        return resultatsReconnaissance;
    }

    public void setResultatsReconnaissance(String resultatsReconnaissance) {
        this.resultatsReconnaissance = resultatsReconnaissance;
    }

    public boolean isFraude() {
        return fraude;
    }

    public void setFraude(boolean fraude) {
        this.fraude = fraude;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Compte getNumeroCompte() {
        return numeroCompte;
    }

    public void setNumeroCompte(Compte numeroCompte) {
        this.numeroCompte = numeroCompte;
    }

    // Optional: Getters and setters for createdAt and updatedAt
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
