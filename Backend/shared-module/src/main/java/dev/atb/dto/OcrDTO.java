package dev.atb.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class OcrDTO {
        private String id;
        private String typeDocument;
        private String resultatsReconnaissance;
        private boolean fraude;
        private String image;
        private String modelUsed; // New field for pre-trained model name
        private String errorMessage; // Field to hold error messages

        // Constructor for success case
        public OcrDTO(String id, String typeDocument, String resultatsReconnaissance, boolean fraude, String image, String modelUsed) {
                this.id = id;
                this.typeDocument = typeDocument;
                this.resultatsReconnaissance = resultatsReconnaissance;
                this.fraude = fraude;
                this.image = image;
                this.modelUsed = modelUsed;
        }

        // Constructor for error case
        public OcrDTO(String errorMessage) {
                this.errorMessage = errorMessage;
        }
}
