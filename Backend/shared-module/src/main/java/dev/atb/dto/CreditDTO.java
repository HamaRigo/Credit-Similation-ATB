package dev.atb.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CreditDTO {
    private Long id;
    private float tauxInteret;
    private int duree;
    private float montant;
    private String statut;
    private CreditModelDTO modelDeCredit;
}
