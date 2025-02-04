package dev.atb.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Ocr {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Changed for numeric ID
    private Long id;

    @Column(nullable = false)
    private String typeDocument;

    @Column(length = 1000, nullable = false)
    private String resultatsReconnaissance;

    private Boolean fraud;

    private String errorMessage;

    @Lob
    @NotBlank(message = "Image data cannot be empty")
    private String image; // Storing image data as a Base64 encoded string

    @JsonIgnoreProperties("ocrs")
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Compte compte;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(updatable = false)
    private LocalDateTime updatedAt;
}
