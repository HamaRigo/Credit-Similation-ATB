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
    private String clientCin; // Assuming Client DTO has a String field to represent CIN
    private Set<String> credits; // Assuming Credit DTO has a String field to represent it

    // If you need this method for some specific reason, implement it properly.
    public void setClient(String cin) {
        this.clientCin = cin;
    }
}
