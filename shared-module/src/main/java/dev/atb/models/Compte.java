package dev.atb.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Compte {

    @Id
    @Column(nullable = false, updatable = false)
    private String numeroCompte;

    private double solde;

    private String typeCompte;

    @OneToMany(mappedBy = "numeroCompte", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Ocr> ocrs;

    @OneToMany(mappedBy = "numeroCompte", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Credit> credits;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cin") // Assuming 'cin' is the name of the foreign key column in the database
    private Client client;

    /**
     * Returns the ID of the Compte entity.
     *
     * @return the ID (numeroCompte) of the Compte entity
     */
    public String getId() {
        return this.numeroCompte;
    }
}
