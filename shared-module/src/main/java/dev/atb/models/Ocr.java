package dev.atb.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

@Entity

@Getter
@Setter
public class Ocr {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    private String id;  // Ensure this is String

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
    private Compte numeroCompte; // Changed to Compte

    // Getters and setters

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}