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
        public String getId() {
                return id;
        }

        public void setId(String id) {
                this.id = id;
        }

        private String id; // Keeping id as String
        private String typeDocument;
        private String resultatsReconnaissance;
        private boolean fraude;
        private String image; // Storing image data as a Base64 encoded string
        private String numeroCompteId; // Representing the ID of the associated Compte entity

        // Getters and setters
}
