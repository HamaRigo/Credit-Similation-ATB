package dev.atb.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CompteDTO {
    private Long id;
    private String typeCompte;
    private String numeroCompte;
    private double solde;
    private boolean activated;
    private double tauxInteret;
    private double soldeMinimum;
    private ClientDTO client;
    private List<OcrDTO> ocrs;
}
