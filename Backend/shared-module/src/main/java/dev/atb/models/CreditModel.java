package dev.atb.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.Map;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreditModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ElementCollection
    private List<String> facteursDeRisque;

    @ElementCollection
    @MapKeyColumn(name = "score_key")
    @Column(name = "score_value")
    @CollectionTable(name = "credit_model_scores", joinColumns = @JoinColumn(name = "credit_model_id"))
    private Map<String, Float> scores;

    @JsonIgnoreProperties("modelDeCredit")
    @OneToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private Credit credit;
}
