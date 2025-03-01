package dev.atb.models;

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
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Changed for numeric ID
    private Long id;

    @NotBlank(message = "Account number cannot be blank")
    private String numeroCompte;

    @Column(nullable = false)
    @NotBlank(message = "Document type cannot be blank")
    private String typeDocument;

    @Column(name = "resultats_reconnaissance", length = 1000, nullable = false)
    private String resultatsReconnaissance;

    private Boolean fraud; // Nullable fraud field

    @Lob
    @NotBlank(message = "Image data cannot be empty")
    private String image;

    private String modelUsed;

    private String errorMessage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "compte_id")
    private Compte compte;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    // Automatically set the creation date
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
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
