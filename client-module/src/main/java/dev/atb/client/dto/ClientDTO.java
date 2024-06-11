package dev.atb.client.dto;

import dev.atb.models.Client;
import lombok.*;

@Getter
@Setter

@NoArgsConstructor
public class ClientDTO {
    private String cin;
    private String nom;

    public ClientDTO(String cin, String nom, String prenom, String adresse, String numeroTelephone) {
        this.cin = cin;
        this.nom = nom;
        this.prenom = prenom;
        this.adresse = adresse;
        this.numeroTelephone = numeroTelephone;
    }

    private String prenom;
    private String adresse;
    private String numeroTelephone;

    public ClientDTO(Client client) {
    }

//    public ClientDTO(Client client) {
//        this.cin = client.getCin();
//        this.nom = client.getNom();
//        this.prenom = client.getPrenom();
//        this.adresse = client.getAdresse();
//        this.numeroTelephone = client.getNumeroTelephone();
//    }
}
