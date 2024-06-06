package dev.atb.dto;



import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreditDTO {
    private Long id;
    private float montant;
    private float tauxInteret;
    private int duree;
    private String statut;
    private String numeroCompte; // Assuming Compte has a String field to represent it
    private CreditModelDTO modeldecredit; // Assuming CreditModelDTO has been created to represent Credit_model

    public CreditModelDTO getModeldecredit() {
        return modeldecredit;
    }

    public void setModeldecredit(CreditModelDTO modeldecredit) {
        this.modeldecredit = modeldecredit;
    }
}
