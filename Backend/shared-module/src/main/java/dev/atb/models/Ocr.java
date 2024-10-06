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

    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    private String id;

    @Column(nullable = false)
    private String typeDocument;

    @Column(nullable = false)
    private String resultatsReconnaissance;

    private boolean fraud;

    @Lob
    @NotBlank(message = "Image data cannot be empty")
    private String image; // Storing image data as a Base64 encoded string

    private String modelUsed;
    private String errorMessage;

    @JsonIgnoreProperties("ocrs")
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Compte compte;

    public boolean isFraud() {
        return fraud;
    }

    public void setFraud(boolean fraude) {
        this.fraud = fraud;
    }

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @Column(updatable = false)
    private LocalDateTime updatedAt;


}
