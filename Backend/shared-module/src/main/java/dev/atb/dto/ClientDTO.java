package dev.atb.dto;

import dev.atb.models.DocumentType;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ClientDTO {
    private String numeroDocument;
    private DocumentType typeDocument;
    private String nom;
    private String prenom;
    private String adresse;
    private String telephone;
}
