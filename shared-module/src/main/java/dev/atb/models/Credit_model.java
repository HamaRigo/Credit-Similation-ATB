package dev.atb.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;
@Entity
@Getter
@Setter
public class Credit_model {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ElementCollection
    private List<String> facteursDeRisque;

    @ElementCollection
    @MapKeyColumn(name = "score_key")
    @Column(name = "score_value")
    @CollectionTable(name = "modele_credit_scores", joinColumns = @JoinColumn(name = "modele_credit_id"))
    private Map<String, Float> scores;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "credit_id_id", unique = true)
    private Credit creditId;
}

