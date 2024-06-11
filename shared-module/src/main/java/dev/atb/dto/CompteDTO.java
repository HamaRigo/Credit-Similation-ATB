package dev.atb.dto;



import lombok.*;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CompteDTO {
    private String numeroCompte;
    private double solde;
    private String typeCompte;
    private Set<String> ocrs; // Assuming Ocr DTO has a String field to represent it
    private String client; // Assuming Client DTO has a String field to represent it
    private Set<String> credits; // Assuming Credit DTO has a String field to represent it
}
