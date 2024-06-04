package dev.atb.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreditModelDTO {
    private Long id;
    private List<String> facteursDeRisque;
    private Map<String, Float> scores;
    private Long creditId; // Representing the Credit entity ID
}
