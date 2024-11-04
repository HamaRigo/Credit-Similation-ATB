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
    private String image; // Base64 encoded string
    private String modelUsed = "defaultModel"; // Default model name if not provided
    private String errorMessage; // For error messages
    private double confidenceScore = 0.0; // Default confidence score

    /**
     * Constructor with all fields except `errorMessage`.
     * Useful for regular OCR processing results.
     */
    public OcrDTO(String id, String typeDocument, String resultatsReconnaissance, boolean fraud, String image, String modelUsed, double confidenceScore) {
        this.id = id;
        this.typeDocument = typeDocument;
        this.resultatsReconnaissance = resultatsReconnaissance;
        this.fraud = fraud;
        this.image = image;
        this.modelUsed = (modelUsed != null) ? modelUsed : "defaultModel";
        this.confidenceScore = confidenceScore;
    }

    /**
     * Constructor with `errorMessage` only.
     * Useful for error handling in OCR processing.
     */
    public OcrDTO(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}
