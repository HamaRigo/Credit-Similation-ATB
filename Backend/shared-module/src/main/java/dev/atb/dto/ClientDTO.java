package dev.atb.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ClientDTO {
    private String cin;
    private String nom;
    private String prenom;
    private String adresse;
    private String numeroTelephone;
    private String signature;

}
