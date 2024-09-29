package dev.atb.dto;

import jakarta.validation.constraints.NotBlank;

public class OcrDTO {

        private String id;

        @NotBlank
        private String typeDocument;

        @NotBlank
        private String resultatsReconnaissance;

        private boolean fraude;

        private String image;

        private String numeroCompteId; // ID of the related Compte

        private String modelUsed; // New field for pre-trained model name

        private String errorMessage; // Field to hold error messages

        // Default constructor
        public OcrDTO() {}

        // Constructor for success case
        public OcrDTO(String id, String typeDocument, String resultatsReconnaissance, boolean fraude, String image, String numeroCompteId, String modelUsed) {
                this.id = id;
                this.typeDocument = typeDocument;
                this.resultatsReconnaissance = resultatsReconnaissance;
                this.fraude = fraude;
                this.image = image;
                this.numeroCompteId = numeroCompteId;
                this.modelUsed = modelUsed;
        }

        // Constructor for error case
        public OcrDTO(String errorMessage) {
                this.errorMessage = errorMessage;
        }

        // Getters and Setters
        public String getId() {
                return id;
        }

        public void setId(String id) {
                this.id = id;
        }

        public String getTypeDocument() {
                return typeDocument;
        }

        public void setTypeDocument(String typeDocument) {
                this.typeDocument = typeDocument;
        }

        public String getResultatsReconnaissance() {
                return resultatsReconnaissance;
        }

        public void setResultatsReconnaissance(String resultatsReconnaissance) {
                this.resultatsReconnaissance = resultatsReconnaissance;
        }

        public boolean isFraude() {
                return fraude;
        }

        public void setFraude(boolean fraude) {
                this.fraude = fraude;
        }

        public String getImage() {
                return image;
        }

        public void setImage(String image) {
                this.image = image;
        }

        public String getNumeroCompteId() {
                return numeroCompteId;
        }

        public void setNumeroCompteId(String numeroCompteId) {
                this.numeroCompteId = numeroCompteId;
        }

        public String getModelUsed() {
                return modelUsed;
        }

        public void setModelUsed(String modelUsed) {
                this.modelUsed = modelUsed;
        }

        public String getErrorMessage() {
                return errorMessage;
        }

        public void setErrorMessage(String errorMessage) {
                this.errorMessage = errorMessage;
        }
}
