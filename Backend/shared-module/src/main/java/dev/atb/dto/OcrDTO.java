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
    private boolean fraud;
    private String image;
    private String modelUsed; // For pre-trained model name
    private String errorMessage; // For error messages
    private double confidenceScore; // To store confidence score of OCR result

    // Constructor with all fields except errorMessage
    public OcrDTO(String id, String typeDocument, String resultatsReconnaissance, boolean fraud, String image, String modelUsed, double confidenceScore) {
        this.id = id;
        this.typeDocument = typeDocument;
        this.resultatsReconnaissance = resultatsReconnaissance;
        this.fraud = fraud;
        this.image = image;
        this.modelUsed = (modelUsed != null) ? modelUsed : "defaultModel"; // Handle null for modelUsed
        this.confidenceScore = confidenceScore;
    }

    // Constructor with optional confidenceScore, defaulting it to 0.0
    public OcrDTO(String id, String typeDocument, String resultatsReconnaissance, boolean fraud, String image, String modelUsed) {
        this.id = id;
        this.typeDocument = typeDocument;
        this.resultatsReconnaissance = resultatsReconnaissance;
        this.fraud = fraud;
        this.image = image;
        this.modelUsed = (modelUsed != null) ? modelUsed : "defaultModel"; // Handle null for modelUsed
        this.confidenceScore = 0.0; // Default confidence score if not provided
    }

    // Constructor to handle error scenarios
    public OcrDTO(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}
