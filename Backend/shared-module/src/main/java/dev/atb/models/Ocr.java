package dev.atb.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Ocr {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    private String NumeroCompte;

    @Column(nullable = false)
    private String typeDocument;

    @Column(name = "resultats_reconnaissance", length = 1000, nullable = false)
    private String resultatsReconnaissance;

    private Boolean fraud; // Changed to Boolean to allow null values for undefined fraud status
    @Lob
    @NotBlank(message = "Image data cannot be empty")
    private String image; // Storing image data as a Base64 encoded string
    private String modelUsed;
    private String errorMessage;

//    @JsonIgnoreProperties("ocrs")
//    @ManyToOne(optional = false, fetch = FetchType.LAZY)
//    private Compte compte;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "compte_id") // Adjust `compte_id` if the column name is different in the database
    private Compte compte;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(updatable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Automatically set the creation date
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now(); // Initial setting for update tracking
    }

    // Automatically set the update date
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Boolean isFraud() {
        return fraud;
    }


}
