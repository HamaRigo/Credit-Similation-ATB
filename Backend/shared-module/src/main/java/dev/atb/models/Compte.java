package dev.atb.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Formula;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type_compte")
public abstract class Compte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String numeroCompte;

    @Formula("type_compte") // Exposes the discriminator column
    private String typeCompte;

    @Column(nullable = false)
    private double solde;

    @Column(nullable = false)
    private boolean activated = true;

    @JsonIgnoreProperties("comptes")
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Client client;

    @JsonIgnoreProperties("compte")
    @OneToMany(mappedBy = "compte", cascade = CascadeType.REMOVE)
    private List<Ocr> ocrs;

    @CreationTimestamp
    @Column(updatable = false) // Ensure it is not updated after creation
    private LocalDateTime createdAt;
}
