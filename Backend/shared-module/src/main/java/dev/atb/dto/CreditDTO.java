package dev.atb.dto;

import dev.atb.models.CreditStatus;
import dev.atb.models.CreditType;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CreditDTO {
    private Long id;
    private CreditType type;
    private CreditStatus status;
    private double tauxInteret;
    private double montant;
    private int period;
    private double paiementMensuel;
    private ClientDTO client;
}
