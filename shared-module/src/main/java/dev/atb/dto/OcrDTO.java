package dev.atb.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OcrDTO {

        private String id; // Keeping id as String
        private String typeDocument;
        private String resultatsReconnaissance;
        private boolean fraude;
        private String numeroCompte; // Representing the ID of the associated Compte entity
        private String image; // Storing image data as a Base64 encoded string
        // Getters and setters
}
