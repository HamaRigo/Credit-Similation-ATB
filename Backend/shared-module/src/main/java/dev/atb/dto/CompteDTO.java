package dev.atb.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CompteDTO {
    private String numeroCompte;
    private double solde;
    private String typeCompte;
    private ClientDTO client;
    private List<OcrDTO> ocrs;
    private List<CreditDTO> credits;
}
