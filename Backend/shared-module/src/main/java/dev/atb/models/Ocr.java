package dev.atb.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
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
    private String id;

    @Column(nullable = false)
    private String typeDocument;

    @Column(nullable = false)
    private String resultatsReconnaissance;

    private boolean fraude;

    @Lob
    private String image; // Storing image data as a Base64 encoded string

    private String modelUsed;
    private String errorMessage;

    @JsonIgnoreProperties("ocrs")
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Compte compte;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @Column(updatable = false)
    private LocalDateTime updatedAt;
}
