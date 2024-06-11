package dev.atb.compte.dto;



import lombok.*;

import java.util.Set;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CompteDTO {
    public String getNumeroCompte() {
        return numeroCompte;
    }

    public void setNumeroCompte(String numeroCompte) {
        this.numeroCompte = numeroCompte;
    }

    public Set<String> getOcrs() {
        return ocrs;
    }

    public void setOcrs(Set<String> ocrs) {
        this.ocrs = ocrs;
    }

    public String getClient() {
        return client;
    }

    public void setClient(String client) {
        this.client = client;
    }

    public Set<String> getCredits() {
        return credits;
    }

    public void setCredits(Set<String> credits) {
        this.credits = credits;
    }

    private String numeroCompte;
    private double solde;
    private String typeCompte;
    private Set<String> ocrs; // Assuming Ocr DTO has a String field to represent it
    private String client; // Assuming Client DTO has a String field to represent it
    private Set<String> credits; // Assuming Credit DTO has a String field to represent it


}
