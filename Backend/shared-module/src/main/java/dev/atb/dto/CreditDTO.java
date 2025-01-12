package dev.atb.dto;

import dev.atb.models.CreditStatus;
import dev.atb.models.CreditType;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CreditDTO {
    private Long id;
    private CreditType type;
    private CreditStatus statut;
    private double tauxInteret;
    private double montant;
    private Date dateDebut;
    private Date dateFin;
    private double paiementMensuel;
    private ClientDTO client;
}
