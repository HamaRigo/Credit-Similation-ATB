package dev.atb.client.dto;



import lombok.*;



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

}

