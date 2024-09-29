package dev.atb.dto;

import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CreditModelDTO {
    private Long id;
    private List<String> facteursDeRisque;
    private Map<String, Float> scores;
}
