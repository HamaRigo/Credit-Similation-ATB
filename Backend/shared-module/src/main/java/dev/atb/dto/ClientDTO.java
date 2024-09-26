package dev.atb.dto;

import dev.atb.models.Client;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ClientDTO {
    private String cin;
    private String nom;
    private String prenom;
    private String adresse;
    private String numeroTelephone;

    public ClientDTO(Client client) {
        this.cin = client.getCin();
        this.nom = client.getNom();
        this.prenom = client.getPrenom();
        this.adresse = client.getAdresse();
        this.numeroTelephone = client.getNumeroTelephone();
    }
}
