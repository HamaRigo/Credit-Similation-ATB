package dev.atb.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Credit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    private CreditType type;

    @NotNull
    @Enumerated(EnumType.STRING)
    private CreditStatus statut;

    @NotNull
    private double tauxInteret;

    @NotNull
    private double montant;

    @NotNull
    private Date dateDebut;

    @NotNull
    private Date dateFin;

    @NotNull
    private double paiementMensuel;

    @JsonIgnoreProperties("credits")
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Client client;

    @CreationTimestamp
    @Column(updatable = false) // Ensure it is not updated after creation
    private LocalDateTime createdAt;
}
